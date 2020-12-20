const puppeteer = require('puppeteer');


async function product_scraper(username,password,start_date,end_date) {
	try {
		console.log('called')
		//open the headless browser to scrap data;
		const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
		//create a new page
		const page = await browser.newPage();
		//goto the original url to login 
		await page.goto('https://cavemen.revelup.com', {waitUntil:'networkidle0',timeout:0});
		//type the uername and password in the respective input and submit
		await page.type('.auth0-lock-input-username > div:nth-child(1) > input:nth-child(2)', username); //gto_paulanerbrauhaussg
	  await page.type('.auth0-lock-input-password > div:nth-child(1) > input:nth-child(2)', password); 
		await page.click('.auth0-label-submit');
		//wait for what happen
		await page.waitForNavigation({waitUntil:'networkidle0', timeout:0});
		//if page url don't includes dashboard then login failed
		if(!page.url().includes('dashboard')) throw new Error('deverror incorrect email or password');
		//if page url includes the reset word then user have to reset password first
		if(page.url().includes('reset')) throw new Error('deverror please reset your password first');
		//then goto the url where we need to scrap data
		await page.goto(`https://cavemen.revelup.com/resources/OrderItem/?limit=0&created_date__gte=${start_date}T06:00:00&created_date__lte=${end_date}T06:00:00&voided_date__isnull=true`, {waitUntil:'networkidle0', timeout: 0 });
		// tahe all the json file
		const response = await page.evaluate(() => {
			const data = JSON.parse(document.body.innerText)
			if(data.error) throw new Error(data.error);
			return data.objects; 
		})
		// after take the json data then loop through all the data to add specific value to the datas
		for(let i = 0; i<response.length; i++) {
			let res = await objects_scraper(browser,page,response[i].product);
			//if it contains a error then throw it again.
			if(res.errorMsg) throw new Error(res.errorMsg);
			// else add the data specific object;
			response[i] = {...response[i],...res};
		}
		// close the browser
		await browser.close();
		// after modification return the response data
		// console.log(response)
		return {status:'ok',response,};
	} catch (e) {
			console.log('error in scrap_product function',e);
			// if error contains any error throw by me then send the error message
			if(e.message.includes('Navigation timeout') ) return {errorMsg:'Your password or username is  incorrect. please check it and try again.'}; 
	    if(e.message.includes('deverror')) return {errorMsg: e.message.replace('deverror', '')};
			// otherwise just send the message
			return {errorMsg:e.message};
	}
}

async function objects_scraper (browser,page,url) {
	try {
		//the object which take all the values
		const result = {};
		// gogo to the product page and scrap first product datas
		await page.goto('https://cavemen.revelup.com'+ url, {waitUntil:'networkidle0', timeout:0});
		const response = await page.evaluate(() => {
			let data = JSON.parse(document.body.innerText);
			return data;
		})

		//set the productname and sku property
		result['product_name'] = response.name;
		result['sku'] = response.sku;
		// if response is true
		if(response) { 
			// first goto establishment page and then get estabiishment data and save store in result
			await page.goto('https://cavemen.revelup.com'+response.establishment, {waitUntil:'networkidle0', timeout:0});
			const establishmentData = await page.evaluate( () => {
				let data = JSON.parse(document.body.innerText);
				return data;
			})

			//set the store property
			result['store'] = establishmentData.name;
			// second goto product class data page and then get product class data and save product class into productClassData
			await page.goto('https://cavemen.revelup.com'+response.productclass, {waitUntil:'networkidle0', timeout:0});
			const productClassData = await page.evaluate(() => {
				let data = JSON.parse(document.body.innerText);
				return data;
			})
			//set the product class 
			result['product_class'] = productClassData.name;

			// goto category and do same as above
			await page.goto('https://cavemen.revelup.com'+ response.category, {waitUntil:'networkidle0', timeout:0});
			const categoryData = await page.evaluate(() => {
				let data = JSON.parse(document.body.innerText);
				return data;
			});
			// console.log(categoryData);
			// category has category or parent 
			if(categoryData.category || categoryData.parent) {
			// goto parent
				await page.goto('https://cavemen.revelup.com'+ categoryData.parent, {waitUntil:'networkidle0', timeout:0});
				const categoryParentData = await page.evaluate(() => {
					let data = JSON.parse(document.body.innerText);
					return data;
				});
				// category parent has parent then set the category property
				if(categoryParentData.parent) { 
					console.log('catrgory parent exist ', categoryParentData);
					result['category'] = categoryParentData.name;
					result['sub_category'] = '';
				} else {
					//set the category and sub catrgory blank string for table
					result['category'] = '';
					result['sub_category'] = '';
				}	
			} else {
				// just set the subcategory property
				result['sub_category'] = categoryData.name;
				result['category'] = '';
			}

		}
		return result;
	} catch (e) {
		console.log('error in objects_scraper functon' , e);
		return {errorMsg:e.message};
	}
}




module.exports = product_scraper;
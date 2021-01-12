const puppeteer = require('puppeteer');
const axios = require('axios');


function urlMaker(url,start_date,end_date,establishment) {
		
		let dataURL;
		establishment ? (dataURL = `https://${url}.revelup.com/resources/OrderAllInOne/?limit=0&created_date__gte=${start_date}T06:00:00&created_date__lte=${end_date}T06:00:00&establishment=${establishment}`) 
			: 
		(dataURL = `https://${url}.revelup.com/resources/OrderAllInOne/?limit=0&created_date__gte=${start_date}T06:00:00&created_date__lte=${end_date}T06:00:00`)
		
	return dataURL;
}

console.log(urlMaker('cavemen','2020-12-02','2020-12-03', 0));

async function product_scraper(url,username,password,start_date,end_date,establishment_code) {
	// const url = window.URL.createObjectURL(new Blob([json]));
	try {
		const browser = await puppeteer.launch({ args: ['--no-sandbox','--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.goto(`https://${url}.revelup.com`, {waitUntil: 'networkidle0', timeout: 0,});
    
	  await page.type('.auth0-lock-input-username > div:nth-child(1) > input:nth-child(2)', username); //gto_paulanerbrauhaussg
	  await page.type('.auth0-lock-input-password > div:nth-child(1) > input:nth-child(2)',password); 
		await page.click('.auth0-label-submit');
		await page.waitForNavigation({waitUntil:'networkidle0', timeout:0});

		if(!page.url().includes('dashboard')) throw new Error('deverror Please check your username and password')
		
		if(page.url().includes('reset')) {
			throw new Error('deverror Please reset your password first');
		}
		let cook = '';
		const cookies = await page.cookies();

		for(let i=0;i<cookies.length;i++) {
			cook = cook + `${cookies[i].name+'='+cookies[i].value}; `
		}
		// const dataURL = `https://${url}.revelup.com/resources/OrderAllInOne/?limit=0&created_date__gte=${start_date}T06:00:00&created_date__lte=${end_date}T06:00:00`;
		const dataURL = urlMaker(url,start_date,end_date,establishment_code);
		let {data:{ objects: response,error:jsonError } } = await axios.get( dataURL, {
			headers: {
				Cookie:cook,
			}
		});
		// if(establishment_code){
		// 		response = response.filter((product,index) => {
		// 		const product_establishment = product.establishment.split('/')[3];
		// 		console.log(index,product.establishment,product_establishment);
		// 		return product_establishment == establishment_code
		// 	})
		// }
		await browser.close();
		return {status:'ok', response:response,cookies:cook};
	} catch (e) {
			console.log(e);
			if(e.message.includes('Navigation timeout') ) return {errorMsg:'Your password or username is  incorrect. please check it and try again.'}; 
	  	if(e.message.includes('deverror')) return {errorMsg: e.message.replace('deverror', '')};
	    return {
	    	errorMsg:e.message,
	  	};
	}
}

module.exports = product_scraper;
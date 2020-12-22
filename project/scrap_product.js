const puppeteer = require('puppeteer');
const axios = require('axios');
// const objects_scraper = require('./objects_scraper');

async function product_scraper(username,password,start_date,end_date) {
	try {
		const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.goto('https://cavemen.revelup.com', {waitUntil: 'networkidle0', timeout: 0,});
    
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
		const { data:{ objects:response,error:jsonError } } = await axios.get(`https://cavemen.revelup.com/resources/OrderItem/?limit=0&created_date__gte=${start_date}T06:00:00&created_date__lte=${end_date}T06:00:00&voided_date__isnull=true`, {
			headers: {
				Cookie:cook,
			}
		});

		if(jsonError) throw new Error(jsonError);
		
		// for(let i = 0; i<response.length; i++) {
		// 	const items = await objects_scraper(response[i].product, cook);
		// 	response[i] = {...response[i],...items};
		// }

		await browser.close();
		return {status:'ok', response:response};

	} catch (e) {
			console.log(e);
			if(e.message.includes('Navigation timeout') ) return {errorMsg:'Your password or username is  incorrect. please check it and try again.'}; 
	  	if(e.message.includes('deverror')) return {errorMsg: e.message.replace('deverror', '')};
	    return {
	    	errorMsg:e.message,
	  	};
	}
}



// scrap_product('', 'data_cavemen', 'Hello2020!!')
// 	.then(res => console.log(res))
// 	.catch(e => console.log(e))

module.exports = product_scraper;
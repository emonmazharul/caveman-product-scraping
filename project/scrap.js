const puppeteer = require('puppeteer');

async function scrap(username,password,start_date,end_date){
	try {
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.setViewport({ width: 1366, height: 768 });
    const url = `https://cavemen.revelup.com/resources/OrderItem/?limit=0&created_date__gte=${start_date}T06:00:00&created_date__lte=${end_date}T06:00:00&voided_date__isnull=true`
    await page.goto('https://cavemen.revelup.com', {waitUntil: 'networkidle0', timeout: 0,});
	  await page.type('.auth0-lock-input-username > div:nth-child(1) > input:nth-child(2)', username); //gto_paulanerbrauhaussg
	  await page.type('.auth0-lock-input-password > div:nth-child(1) > input:nth-child(2)',password); 
		await page.click('.auth0-label-submit');
		let interest = await page.waitForNavigation({waitUntil: 'networkidle0', timeout: 0,});
		//error for wrong username and password.
		// console.log(page.url().includes('dashboard') , page.url());
		if(page.url().includes('reset') ) {
			// console.log('login error');
			throw new Error('');
		}
		
		await page.goto(url, {waitUntil: 'networkidle0', timeout: 0,} );
		const response = await page.evaluate(() => {
			return JSON.parse(document.querySelector('body').innerText).objects.filter(product => product.bill_parent === null);
		})
    await browser.close();
    if(!response) throw new Error('');
    return {status:'ok', response,};
  } catch(e) {
  		console.log(e);
      return {
      	errorMsg:`
	  		Failed to get your desire data.Check your username,password and 
	  		network connection. Finally check weather you have to reset your 
	  		password or your ip address is blocked by them.
      `,
  	};
	}
}


module.exports = scrap;
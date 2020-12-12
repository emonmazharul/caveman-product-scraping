const puppeteer = require('puppeteer');


async function scrap(username,password,start_date,end_date){
	try {
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();
    // await page.setViewport({ width: 1366, height: 768 });
    const url = `https://cavemen.revelup.com/resources/OrderItem/?limit=0&created_date__gte=${start_date}T06:00:00&created_date__lte=${end_date}T06:00:00&voided_date__isnull=true`
    await page.goto('https://cavemen.revelup.com', {waitUntil: 'networkidle0', timeout: 0,});

	  await page.type('.auth0-lock-input-username > div:nth-child(1) > input:nth-child(2)', username); //gto_paulanerbrauhaussg
	  await page.type('.auth0-lock-input-password > div:nth-child(1) > input:nth-child(2)',password); 
		await page.click('.auth0-label-submit');

		await page.waitForNavigation({waitUntil:'networkidle0', timeout:60000});

		if(!page.url().includes('dashboard')) throw new Error('deverror Please check your username and password')
		
		if(page.url().includes('reset')) {
			throw new Error('deverror Please reset your password first');
		}
		
		await page.goto(url, {waitUntil: 'networkidle0', timeout: 0,});
		const response = await page.evaluate(() => {
			const isLoginRequired = document.querySelector('.title');
			if(isLoginRequired  && isLoginRequired.textContent) {
				return null;
			}
			return JSON.parse(document.querySelector('body').innerText).objects.filter(product => product.bill_parent === null);
		});

		await browser.close();

		if(!response) throw new Error('deverror check your username and password or check manually weather the website is working properly');
		return {status:'ok', response,};

  } catch(e) {
  		console.log(e);
  		console.log('message',e.message);
  		if(e.message.includes('Navigation timeout') ) return {errorMsg:'Your password or username is  incorrect. please check it and try again.'}; 
      if(e.message.includes('deverror')) return {errorMsg: e.message.replace('deverror', '')};
      return {
      	errorMsg:`
	  		Failed to get your desire data.Check your username,password and 
	  		network connection. Finally check weather you have to reset your 
	  		password or your ip address is blocked by them.
      `,
  	};
	}
}









// async function scrap(username,password,start_date,end_date){
// 	try {
//     const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
//     const page = await browser.newPage();
//     await page.setViewport({ width: 1366, height: 768 });
//     const url = `https://cavemen.revelup.com/resources/OrderItem/?limit=0&created_date__gte=${start_date}T06:00:00&created_date__lte=${end_date}T06:00:00&voided_date__isnull=true`
//     await page.goto('https://cavemen.revelup.com', {waitUntil: 'networkidle0', timeout: 0,});
// 	  await page.type('.auth0-lock-input-username > div:nth-child(1) > input:nth-child(2)', username); //gto_paulanerbrauhaussg
// 	  await page.type('.auth0-lock-input-password > div:nth-child(1) > input:nth-child(2)',password); 
// 		await page.click('.auth0-label-submit');
// 		// https://dzone.com/articles/5-puppeteer-tricks-that-will-make-your-web-scrapin

// 		await page.waitForNavigation({waitUntil: 'networkidle0', timeout: 0,});
// 		if(page.url().includes('reset') ) {
// 			console.log('login error');
// 			await page.type('#id_new_password1', password);
// 			await page.type('#id_new_password2', password);
// 			await page.click('.css3');
// 			throw new Error({errorMsg:'You have to reset your password first'});

// 		}
// 		await page.goto(url, {waitUntil: 'networkidle0', timeout: 0,} );
// 		const response = await page.evaluate(() => {
// 			const isLoginRequired = document.querySelector('.title');
// 			if(isLoginRequired  && isLoginRequired.textContent === 'LOG IN REQUIRED') {
// 				return null;
// 			}
// 			return JSON.parse(document.querySelector('body').innerText).objects.filter(product => product.bill_parent === null);
// 		})
//     await browser.close();
//     if(!response) throw new Error('');
//     return {status:'ok', response,};
//   } catch(e) {
//   		console.log(e);
//   		console.log(e.message);
//   		console.log(e.info)
//   		if(e.message.errorMsg) return {errorMsg:e.message.errorMsg}
//       return {
//       	errorMsg:`
// 	  		Failed to get your desire data.Check your username,password and 
// 	  		network connection. Finally check weather you have to reset your 
// 	  		password or your ip address is blocked by them.
//       `,
//   	};
// 	}
// }

// ( async function() {
// 		const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
//     const page = await browser.newPage();
//     await page.setViewport({ width: 1366, height: 768 });
//     await page.goto('https://google.com', {waitUntil:'networkidle0',timeout:0});
//     console.log(page.title);
// } )()


module.exports = scrap;
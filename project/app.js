const express = require('express');
const path =  require('path');
const cors = require('cors')
const product_scraper = require('./scrap_product.js');
const html = require('./html');

const app = express();

const publiPath = path.join(__dirname, '../public');

app.use(cors({origin:true}))
app.use(express.urlencoded({extended:false}))
app.use(express.json());
app.use(express.static(publiPath) );

app.post('/product_data', async (req,res) => {
	const {username,password,start_date,end_date} = req.body;
	// console.log(req.body);
	let errorMsg;
	try {
		const response = await product_scraper(username,password,start_date,end_date);

		if(!response.status) {
		 errorMsg = response;
		 throw new Error(response);
		}
		res.status(201).send(html(response.response,username,password));
	} catch (e) {
		console.log('error in product_data request', e);
		res.status(404).send(errorMsg);
	}
})

// app.post('/test', async (req,res) => {
// 	let errorMsg;
// 	try {
// 		response  = await scrap_test('https://cavemen.revelup.com', 'data_cavemen', 'Hello2020!!');
// 		if(!response.url) {
// 			errorMsg = response;
// 			throw new Error('');
// 		}
// 		res.status(201).send(response);
// 	} catch (e) {
// 		console.log(e);
// 		res.status(404).send(errorMsg)
// 	}
// })

module.exports = app;
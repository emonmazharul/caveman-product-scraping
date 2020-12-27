const express = require('express');
const path =  require('path');
const cors = require('cors')
const product_scraper = require('./scrap_product.js');
const uplodFile = require('./ftp');
const createCSVFile = require('./obj');

const app = express();

const publiPath = path.join(__dirname, '../public');

app.use(cors({origin:true}))
app.use(express.urlencoded({extended:false}))
app.use(express.json());
app.use(express.static(publiPath) );

app.post('/product_data', async (req,res) => {
	const {username,password,start_date,end_date} = req.body;
	let errorMsg;
	try {
		const response = await product_scraper(username,password,start_date,end_date);

		if(!response.status) {
		 errorMsg = response;
		 throw new Error(response);
		}
		createCSVFile(response.response);
		const {isUploaded,errorMsg:ftpError} =await uplodFile();
		if(ftpError) {
			let errorMsg = ftpError;
			throw new Error('');
		}
		res.status(201).send({msg:isUploaded});
	} catch (e) {
		console.log('error in product_data request', e);
		res.status(404).send(errorMsg);
	}
})

module.exports = app;
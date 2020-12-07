const express = require('express');
const path =  require('path');
const scrap = require('./scrap');
const fs = require('fs');

const cors = require('cors')

const app = express();

const publiPath = path.join(__dirname, '../public');

app.use(cors({origin:true}))
app.use(express.urlencoded({extended:false}))
app.use(express.json());
app.use(express.static(publiPath) );

app.post('/product_data', async (req,res) => {
	const {username,password,start_date,end_date} = req.body;
	console.log(req.body);
	let errorMsg;
	try {
		const response = await scrap(username,password,start_date,end_date);

		if(!response.status) {
		 errorMsg = response;
		 throw new Error(response);
		}
		// fs.writeFileSync('data.json', JSON.stringify(response.response));
		res.status(201).send(response.response);
	} catch (e) {
		res.status(404).send(errorMsg);
	}
})
module.exports = app;
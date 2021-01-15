const express = require('express');
const path =  require('path');
const cors = require('cors')
const User = require('./db/userSchema');
const product_scraper = require('./project/scrap_product.js');
const uploadFile = require('./project/ftp');
const createCSVFile = require('./project/obj');
const checkFTP = require('./project/checkFtp');

let global_response;
let clientCookies;
const app = express();


const publicPath = path.join(__dirname, '/public');

app.use(cors({origin:true}))
app.use(express.urlencoded({extended:false}))
app.use(express.json());
app.use(express.static(publicPath) );

app.get('/edit', (req,res) => {
  res.sendFile(publicPath+'/edit.html')
})


app.post('/product_data', async (req,res) => {
  const {url,username,password,mall_code,tenant_code,establishment_code,start_date,end_date} = req.body;
  let errorMsg;
  try {
    const {status,response,errorMsg,cookies} = await product_scraper(url,username,password,start_date,end_date,establishment_code);

    if(!status) {
     throw new Error(errorMsg);
    }
    clientCookies = cookies;
    if(!response.length) {
      global_response = '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0';
      res.status(201).send('data is fetched. Choose a option below');
      return;
    }
    const csv = createCSVFile(response,mall_code,tenant_code);
    global_response = csv;
    res.status(201).send('data is fetched.Choose a option below.');
  } catch (e) {
    console.log('error in product_data request', e);
    res.status(404).send(e.message);
  }
})

app.post('/uploadfile', async (req,res) => {
  const {ftp_url,ftp_username,ftp_password,isSecure} = req.body 
  try {
    const {isUploaded,errorMsg} = await uploadFile(global_response,ftp_url,ftp_username,ftp_password,isSecure);
    if(!isUploaded) throw new Error(errorMsg);
    res.status(201).send(isUploaded) 
  } catch (e) {
    res.status(404).send(e.message);
  }
});

app.get('/download', async (req,res) => {
  res.send(global_response);
})

app.post('/user', async (req,res) => {
  const {username,ftp_url,ftp_username,ftp_password,subdomain,isSecure} = req.body;
  const user = new User({...req.body,cookies:clientCookies});
  try {
    const existUser = await User.findOne({username,subdomain});
    if(existUser) {
      const {code,message,errorMsg} = await checkFTP(ftp_url,ftp_username,ftp_password,isSecure);
      if(errorMsg) throw new Error(errorMsg);
      await User.findByIdAndUpdate(existUser._id,{...req.body,cookies:clientCookies});
      // await existUser.save();
      res.status(201).send('successfully saved your credentials.we will upload file on your ftp server daily basis.')
      return;
    }
    const {code,message,errorMsg} = await checkFTP(ftp_url,ftp_username,ftp_password);
    if(errorMsg) throw new Error(errorMsg);
    await user.save();
    res.status(201).send('successfully saved your credentials.we will upload file on your ftp server daily basis.')
  } catch (e) {
    console.log(e)
    res.status(404).send(e.message);
  }
})


function auth(req,res,next) {
  const token = req.header('Authorization').replace('Bearer ', '')
  if(token !== process.env.SECRET_CODE) {
    res.status(401).send('Authorization failed');
    return;
  }
  next();
}

app.get('/' + process.env.SECRET_ROUTE, auth, async (req,res) => {
  try { 
    const users = await User.find({});
    res.status(200).send(users);
  } catch (e) {
    console.log(e);
    res.status(404).send(e.message);
  }
})

app.delete('/user', async (req,res) => {
  const {username,password,subdomain} = req.body;
  try {
    const user = await User.findOne({username,password,subdomain});
    if(!user) throw new Error('');
    await user.remove();
    res.status(200).send('successfully deleted user from automated task.');
  } catch (e) {
    console.log(e);
    res.status(401).send({msg:'could not find your id with the given credentials'});
  }
})

app.patch('/update', async (req,res) => {
  const {username,password,subdomain,runAutoTask,scheduleTime} = req.body; 
  try {
    const user = await User.findOne({username,password,subdomain});
    if(!user) throw new Error('');
    user.runAutoTask = runAutoTask;
    user.scheduleTime = scheduleTime || user.scheduleTime;
    await user.save();
    res.status(201).send('updated your auto task fields.');
  } catch (e) {
    console.log(e);
    res.status(401).send({msg:'could not find your id with the given credentials'});
  }
})

module.exports = app;


// const mongoose = require('mongoose');
const ftp = require("basic-ftp");
const User = require('./schema');

async function uploadFile(chost,user,password) {
    const client = new ftp.Client()
    try {
       const cl =  await client.access({
            host:'118.201.222.212',
            user:'70100035',
            password:'3n8w8d4v',
            secure: false
        })
        console.log(cl);
        // const Filestream = myCsvReadStream(csv);
        // const readableStream = new Filestream();
        // const fileName = uuidv4().slice(5,13)+'.csv';
        // await client.uploadFrom(readableStream, fileName);
        // return {isUploaded:'uploaded the file successfully to ftp server. '+ 'filename is ' + fileName}
    }
    catch(err) {
        console.log(err);
        return {errorMsg:err.message};
    }
    client.close()
}

// uploadFile();

(async function () {
	try {
		console.log('auto run function')
		const users = await User.find({});
		console.log(users); 
	} catch (e) {
		console.lgo(e);
	}
} )()
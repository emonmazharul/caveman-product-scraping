const ftp = require("basic-ftp");
const { uuid } = require('uuidv4');

async function uploadFile() {
    const client = new ftp.Client()
    client.ftp.verbose = true
    try {
        await client.access({
            host: process.env.HOST,
            user: process.env.USERNAME,
            password: process.env.PASSWORD,
            secure: false
        })
        const fileName = uuid().slice(5,13)+'.csv';
        await client.uploadFrom("latestFile.csv", fileName);
        return {isUploaded:'uploaded the file successfully to ftp server'}
    }
    catch(err) {
        console.log(err);
        return {errorMsg:err.message};
    }
    client.close()
}

module.exports = uploadFile;
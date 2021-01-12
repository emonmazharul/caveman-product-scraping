const ftp = require("basic-ftp");

async function checkFTP(host,user,password,isSecure) {
    const client = new ftp.Client()
    try {
       const cl =  await client.access({
            host,
            user,
            password,
            secure: isSecure
        })
        return cl;
    }
    catch(err) {
        console.log(err);
        return {errorMsg:err.message};
    }
    client.close()
}

module.exports = checkFTP;
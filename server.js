const http = require('http');
const app = require('./app');

const port = process.env.PORT || 5000;
const server = http.createServer(app);
server.listen(port, (err) => {
	if(err) {
		console.log(err);
	}
	console.log('server running on port ' +  port);
})
const server = require('./project/app');

const port = process.env.PORT || 5000;
server.listen(5000, (err) => {
	if(err) {
		console.log(err);
	}
	console.log('server running on port ' +  port);
})
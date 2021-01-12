const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URL, {
	useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: true,
  useUnifiedTopology:true,
})
.then(res => {
	console.log('connected to databse');
})
.catch(e => {
	console.log(e);
})
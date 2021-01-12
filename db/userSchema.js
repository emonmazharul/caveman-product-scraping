const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const userSchema = new Schema({
	subdomain: {
		type:String,
		required:true,
		trim:true,
	},
	username: {
		type:String,
		required:true,
		trim:true,
	},
	password:{
		type:String,
		required:true,
		trim:true,
	},
	isSecure: {
		type:Boolean,
		required:true,
	},
	mall_code: {
		type:String,
		required:true,
		trim:true,
	},
	tenant_code: {
		type:String,
		required:true,
		trim:true,
	},
	establishment_code: {
		type:String,
		trim:true,
	},
	ftp_url : {
		type:String,
		trim:true,
		required:true,
	},
	ftp_username: {
		type:String,
		trim:true,
		required:true,
	},
	ftp_password:{
		type:String,
		trim:true,
		required:true
	},
	cookies:{
		type: String,
		trim:true,
	}
},{
	timestamps:true,
})

const User = mongoose.model('User', userSchema);

module.exports = User;
const form = document.querySelector('#formOne');
const upload_form = document.querySelector('#formTwo');
const saveTask_form = document.querySelector('#formThree');
const start_date_info = document.querySelector('#start_date_info');
const error_text = document.querySelector('#error_text');

const btn = document.querySelector('button');

const download_button = document.querySelector('#download_button');
const upload_button = document.querySelector('#upload_button');
const saveTask_button = document.querySelector('#saveTask_button');

const collapseOneBtn = document.querySelector('#collapseOneBtn');
const collapseTwoBtn = document.querySelector('#collapseTwoBtn');

const collapseOne = document.querySelector('#collapseExample');
const collapseTwo = document.querySelector('#collapseSaveTask');

const server_info = document.querySelector('#server_info');
const srever_error = document.querySelector('#server_error');

const formTwoBtn = document.querySelector('#formTwoBtn');
const formThreeBtn = document.querySelector('#formThreeBtn');

let global_response;
let global_user_data = {};


function dateChcker(start_date){
	const currentDateArr = new Date().toLocaleDateString().split('/');
	const currentDate = currentDateArr[2] +'-' + currentDateArr[1] + '-'+ currentDateArr[0]
	if(start_date === currentDate ){
		console.log('error')
		start_date_info.textContent = "You can't get data of this date";
		return false;
	}
	start_date_info.textContent = "";
	return true;
}

form.addEventListener('submit', (e) => {
	e.preventDefault();
	const url = e.target.elements.url.value;
	const username = e.target.elements.username.value;
	const password = e.target.elements.password.value;
	const start_date = e.target.elements.start_date.value;
	const mall_code = e.target.elements.mall_code.value;
	const tenant_code = e.target.elements.tenant_code.value;
	const establishment_code = e.target.elements.establishment_code.value;

	let d = new Date(start_date);
	let stamps = d.setDate(d.getDate() + 1);
	let created_date_lte = new Date(stamps);
	
	let created_date_lte_year = created_date_lte.getFullYear() + '';
	let created_date_lte_month = created_date_lte.getMonth() + 1 + '';
	created_date_lte_month =  created_date_lte_month.length == 2 ? created_date_lte_month : ('0' +  created_date_lte_month);
	let created_date_lte_date = created_date_lte.getDate() + '';
	created_date_lte_date = created_date_lte_date.length == 2 ? created_date_lte_date : ('0'+ created_date_lte_date);

	global_user_data = {
		...global_user_data,
		subdomain:url,
		username,
		password,
		start_date,
		end_date:created_date_lte_year+created_date_lte_month+created_date_lte_date,
		mall_code,
		tenant_code,
		establishment_code,
	};

	btn.disabled = true;
	download_button.disabled = true;
	formTwoBtn.disabled = true;
	formThreeBtn.disabled = true;

	error_text.className = '';
	error_text.classList.add('text-primary')
	error_text.textContent = 'Loading...';
	server_info.textContent = '';
	server_error.textContent = '';

	axios.post('/product_data', {
		url,
		username,
		password,
		start_date,
		end_date:created_date_lte,
		mall_code,
		tenant_code,
		establishment_code,
	})
	.then(res => {
		const json  = res.data;
		error_text.className = '';
		error_text.classList.add('text-primary')
		error_text.textContent = json;
    btn.disabled = false;
		global_response = json;
		download_button.disabled = false;
		formTwoBtn.disabled = false;
		formThreeBtn.disabled = false;
	})
	.catch(e => {
		console.log(e.response)
		btn.disabled = false;
		error_text.textContent = '';
		error_text.className = '';
		error_text.classList.add('text-danger');
		error_text.textContent = e.response.data ||  `Failed to get your desire data.Check your username,password and network connection. Finally check weather you have to reset your password or your ip address is blocked by them.`;
	})
})


download_button.addEventListener('click', (e) => {
	axios.get('/download')
		.then(res => {
			const url = URL.createObjectURL(new Blob([res.data]));
			const downloadLink = document.createElement('a');
			downloadLink.href = url;
			const fileName = String(Math.random()) + '.csv'; 
			downloadLink.setAttribute('download', fileName);
			downloadLink.click();
			download_button.disabled = true;
		})
		.catch(e => {
			server_error.textContent = e.response.data || 'please try again.server failed to perform';
		})
})

upload_form.addEventListener('submit', (e) => {
	e.preventDefault();
	const uploadInfo = document.querySelector('#upload_info');
	const uploadError = document.querySelector('#upload_error');

	const ftp_url = e.target.elements.ftp_url.value;
	const ftp_username = e.target.elements.ftp_username.value;
	const ftp_password = e.target.elements.ftp_password.value;
	const isSecure = e.target.elements.isSecure.checked;
	console.log(isSecure);
	uploadInfo.textContent = 'uploading...';
	uploadError.textContent = '' 
	
	axios.post('/uploadfile',{
		ftp_url,
		ftp_username,
		ftp_password,
		isSecure,
	})
		.then(res => {
			uploadInfo.textContent = res.data;
			uploadError.textContent = '';
			// upload_button.disabled = true;
			// formTwoBtn.disabled = true;
		})
		.catch(e => {
			console.log(e);
			let msg = e.response ? e.response.data : 'reenter the input again then submit it another time';
			uploadInfo.textContent = '';
			uploadError.textContent = msg;
	})
})


saveTask_form.addEventListener('submit', (e) => {
	e.preventDefault();
	const saveTask_info = document.querySelector('#saveTask_info');
	const saveTask_error = document.querySelector('#saveTask_error');

	const ftp_url = e.target.elements.ftp_url.value;
	const ftp_username = e.target.elements.ftp_username.value;
	const ftp_password = e.target.elements.ftp_password.value;
	const schedule_time = e.target.elements.schedule_time.value;
	const isSecure = e.target.elements.isSecure.checked;
	console.log(schedule_time);
	return;
	saveTask_info.textContent = 'saving...';
	saveTask_error.textContent = '';
	axios.post('/user', {
		...global_user_data,
		ftp_url,
		ftp_username,
		ftp_password,
		isSecure,
		schedule_time,
	})
	.then(res => {
		saveTask_info.textContent = res.data;
		saveTask_error.textContent = '';
		formThreeBtn.disabled = true;		

	})
	.catch(e => {
		const msg = e.response ? e.response.data : 'server failed please try again. refresh the page when it occues two+ times';
		saveTask_error.textContent = msg;		
		saveTask_info.textContent = '';
	})
})


upload_button.addEventListener('click', (e) => {
	var bsCollapse = new bootstrap.Collapse(collapseOne, {
	  toggle:true,
	});
})

saveTask_button.addEventListener('click', (e) => {
	var bsCollapseTwo =  new bootstrap.Collapse(collapseTwo, {
		toggle:true,
	})
})
const form = document.querySelector('form');
const start_date_info = document.querySelector('#start_date_info');
const error_text = document.querySelector('#error_text');
const btn = document.querySelector('button');

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
	const username = e.target.elements.username.value;
	const password = e.target.elements.password.value;
	const start_date = e.target.elements.start_date.value;
	if( !dateChcker(start_date)) {
		return;
	}
	let end_date = Number(start_date.slice(8,)) + 1;
	end_date < 10 ? (end_date = '0'+end_date) : (end_date = end_date+'')
	const created_date_lte = start_date.slice(0,8)+end_date;
	btn.disabled = true;
	error_text.className = '';
	error_text.classList.add('text-primary')
	error_text.textContent = 'Loading...';
	axios.post('/product_data', {
		username,
		password,
		start_date,
		end_date:created_date_lte,
	})
	.then(res => {
		const json  = res.data;
		error_text.className = '';
		error_text.classList.add('text-primary')
		error_text.textContent = json.msg;
    btn.disabled = false;
		
	})
	.catch(e => {
		console.log(e.response)
		btn.disabled = false;
		error_text.textContent = '';
		error_text.className = '';
		error_text.classList.add('text-danger');
		if(!e.response) {
			error_text.textContent = `Failed to get your desire data.Check your username,password and network connection. Finally check weather you have to reset your password or your ip address is blocked by them.`
		}
		error_text.textContent = e.response.data.errorMsg;
	})
})
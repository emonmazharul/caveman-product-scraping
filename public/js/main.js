const form = document.querySelector('form');
const start_date_info = document.querySelector('#start_date_info');
const error_text = document.querySelector('#error_text');
function dateChcker(start_date,end_date){
	if(start_date === end_date) {
		start_date_info.textContent = 'Date must be different';
		return false;
	}
	if( new Date() < new Date(end_date) ) {
		start_date_info.textContent = 'The end date has not pass yet';
		return false;
	}
	if( new Date(start_date) > new Date(end_date) ) {
		start_date_info.textContent = 'Please make sure start date is less than the end date';
		return false;
	}
	start_date_info.textContent = ''
	return true;
}

form.addEventListener('submit', (e) => {
	e.preventDefault();
	error_text.textContent = '';
	const username = e.target.elements.username.value;
	const password = e.target.elements.password.value;
	const start_date = e.target.elements.start_date.value;
	const end_date = e.target.elements.end_date.value;
	if( !dateChcker(start_date,end_date)) {
		return;
	}
	axios.post('/product_data', {
		username,
		password,
		start_date,
		end_date,
	})
	.then(res => {
		console.log(res.data);
		const json = JSON.stringify(res.data);
		const url = window.URL.createObjectURL(new Blob([json]));
		const link = document.createElement('a');
    link.href = url;
    link.style.display = 'none';
    const fileName = 'product_data'+ new Date().toLocaleString().replace(/ /g, '') +'.json';
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
		
	})
	.catch(e => {
		console.log(e);
		console.log(e.response);
		if(!e.response || !e.response.data) error_text.textContent = `Failed to get your desire data.Check your username,password and network connection. Finally check weather you have to reset your password or your ip address is blocked by them.`
		error_text.textContent = e.response.data.errorMsg;
	})
})
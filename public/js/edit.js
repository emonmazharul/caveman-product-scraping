const updateForm = document.querySelector('#formOne');
const deleteForm = document.querySelector('#formTwo')

const info_update = document.querySelector('#info_one');
const info_delete = document.querySelector('#info_two');

updateForm.addEventListener('submit',  e => {
	e.preventDefault();
	const username  = e.target.elements.username.value;
	const password  = e.target.elements.password.value;
	const subdomain = e.target.elements.subdomain.value;
	const schedule_time = e.target.elements.schedule_time.value;
	const runAutoTask = e.target.elements.runAutoTask.checked;
	info_update.className = '';
	info_update.textContent = 'updating...';
	axios.patch('/update', {
		username,
		password,
		subdomain,
		scheduleTime:schedule_time,
		runAutoTask,
	})
	.then(res => {
		info_update.className = 'text-success';
		info_update.textContent = res.data;
	})
	.catch(e => {
		let msg =  e.response ? e.response.data.msg : 'failed!try again';
		info_update.className = 'text-danger';
		info_update.textContent = msg;
	})
})


deleteForm.addEventListener('submit', e => {
	e.preventDefault();
	const username  = e.target.elements.username.value;
	const password  = e.target.elements.password.value;
	const subdomain = e.target.elements.subdomain.value;
	info_delete.className = '';
	info_delete.textContent = 'deleteing...'
	axios.delete('/user', {
		data: {
			username,
			password,
			subdomain,
		}
	})
	.then(res => {
		info_delete.className = 'text-success';
		info_delete.textContent = res.data;
	})
	.catch(e => {
		let msg =  e.response ? e.response.data.msg : 'failed!try again';
		info_delete.className = 'text-danger';
		info_delete.textContent = msg;
	})
})

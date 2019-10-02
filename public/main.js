var update = document.getElementById('update')
update.addEventListener('click', function () {
	fetch('monsters', {
  		method: 'put',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify({
		    'name': 'Goblin',
		    'special': 'nothing particularly interesting.'
  		})
	})
	.then(response => {
		if (response.ok) return response.json()
	})
	.then(data => {
		console.log(data)
		window.location.reload(true)
	})
})

var del = document.getElementById('delete')
del.addEventListener('click',function (){
	fetch('monsters', {
		method: 'delete',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify({
			'name': 'Goblin'
		})
	})
	.then(response => {
		if (response.ok) return response.json()
	})
	.then(data => {
		console.log(data)
		window.location.reload()
	})
})
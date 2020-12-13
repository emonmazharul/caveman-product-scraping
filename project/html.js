const table_headers = ['<th scope="col">#</th>','<th scope="col">month</th>','<th scope="col">date</th>','<th scope="col">year</th>','<th scope="col">hour</th>','<th scope="col">minute</th>','<th scope="col">day of week</th>', '<th scope="col">id</th>','<th scope="col">Order</th>', '<th scope="col">quantity</th>', '<th scope="col">price</th>','<th scope="col">Sales</th>', '<th scope="col">dining_option</th>','<th scope="col">Product Name</th>',];
// console.log(table_headers)

function trows(th){
	return table_headers.join(' ');
}

function tbody_data_maker(json) {
    let res = '';
    // json = json.slice(0,5);
    for(let i =0; i<json.length; i++) {
      const {created_date,id,order_local_id:Order,quantity,price,pure_sales:Sales,dining_option,product} = json[i];
      // const obj = {created_date,id,Order,quantity,price,Sales,dining_option,product};
      const dateArr =  new Date(created_date).toString().split(' ');
      const [day_of_week,month,date,year] = dateArr.slice(0, 4)
      const [hour,minute] = dateArr[4].split(':') 
      res = res + `<tr>  
      	\n <td scope="row" >${i+1}</td> 
      	\n <td scope="row" data-bs-toggle="tooltip" data-bs-placement="top" title="month">${month}</td> 
      	\n <td scope="row" data-bs-toggle="tooltip" data-bs-placement="top" title="date">${date}</td> 
      	\n<td scope="row" data-bs-toggle="tooltip" data-bs-placement="top" title="year">${year}</td>
      	\n <td scope="row" data-bs-toggle="tooltip" data-bs-placement="top" title="hour">${hour}</td> 
      	\n <td scope="row" data-bs-toggle="tooltip" data-bs-placement="top" title="minute">${minute}</td> 
      	\n  <td scope="row" data-bs-toggle="tooltip" data-bs-placement="top" title="day of week">${day_of_week}</td>
      	\n <td scope="row" data-bs-toggle="tooltip" data-bs-placement="top" title="id">${id}</td>
      	\n <td scope="row" data-bs-toggle="tooltip" data-bs-placement="top" title="Order">${Order}</td>
      	\n <td scope="row" data-bs-toggle="tooltip" data-bs-placement="top" title="quantity">${quantity}</td> 
      	\n<td scope="row" data-bs-toggle="tooltip" data-bs-placement="top" title="price">${price}</td> 
      	\n <td scope="row" data-bs-toggle="tooltip" data-bs-placement="top" title="Sales">${Sales}</td> 
      	\n<td scope="row" data-bs-toggle="tooltip" data-bs-placement="top" title="dining_option">${dining_option}</td> 
      	\n <td scope="row" data-bs-toggle="tooltip" data-bs-placement="top" title="product"> <a href="https://cavemen.revelup.com${product}" target="_blank"> https://cavemen.revelup.com${product} </a> </td>
      	\n 
      	</tr> \n`
    }
    return res;
}

function html(tds){

	return `
		<!DOCTYPE html>
			<html>
			<head>
				<title>Cavemen product data</title>
				<meta charset="UTF-8">
			  <meta name="description" content="Product data management">
			  <meta name="keywords" content="HTML, CSS, JavaScript">
			  <meta name="author" content="">
			  <meta name="viewport" content="width=device-width, initial-scale=1.0">
			  <!-- CSS only -->
				<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-giJF6kkoqNQ00vy+HMDP7azOuL0xtbfIcaT9wjKHr8RbDVddVHyTfAAsrekwKmP1" crossorigin="anonymous">
				<!-- JavaScript Bundle with Popper -->
				<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/js/bootstrap.bundle.min.js" integrity="sha384-ygbV9kiqUc6oa4msXn9868pTtWMgiQaeYH7/t7LECLbyPA2x65Kgf80OJFdroafW" crossorigin="anonymous"></script>
			</head>
			<body>
				<table class="table table-dark table-striped table-bordered table-hover table-responsive" style="width:100%">
					<thead>
						<tr>
							${trows()}
						</tr>
					</thead>
				  <tbody>
				  	${tbody_data_maker(tds)}
				  </tbody>
				</table>
			</body>
		</html>
	`
}

module.exports = html;
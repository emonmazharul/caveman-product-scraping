const table_headers = [
	'<th scope="col">#</th>',
	'<th scope="col">Month</th>',
	'<th scope="col">Date</th>',
	'<th scope="col">Year</th>',
	'<th scope="col">Hour</th>',
	'<th scope="col">Minute</th>',
	'<th scope="col">Day of week</th>', 
	'<th scope="col">ID</th>',
	'<th scope="col">Order</th>', 
	'<th scope="col">Quantity</th>', 
	'<th scope="col">Price</th>',
	'<th scope="col">Sales</th>',
	'<th scope="col">Dining option</th>',
	'<th scope="col">Product Name</th>',
	'<th scope="col">sku</th>',
	'<th scope="col">Store</th>',
	'<th scope="col">Product Class</th>',
	'<th scope="col">Category</th>',
	'<th scope="col">Sub Category</th>',
];

function trows(th){
	return table_headers.join(' ');
}

function tbody_data_maker(json,username,password) {
    let res = '';
    // json = json.slice(0,5);
    for(let i =0; i<json.length; i++) {
      const {created_date,id,order_local_id,quantity,price,pure_sales,dining_option,product,product_name,sku,product_class,store,category,sub_category} = json[i];
      // const obj = {created_date,id,Order,quantity,price,Sales,dining_option,product};
      const dateArr =  new Date(created_date).toString().split(' ');
      const [day_of_week,month,date,year] = dateArr.slice(0, 4)
      const [hour,minute] = dateArr[4].split(':') 
      res = res + `<tr>  
      	\n <td scope="row" >${i+1}</td> 
      	\n <td scope="row" data-bs-toggle="tooltip" data-bs-placement="top" title="Month">${month}</td> 
      	\n <td scope="row" data-bs-toggle="tooltip" data-bs-placement="top" title="Date">${date}</td> 
      	\n<td scope="row" data-bs-toggle="tooltip" data-bs-placement="top" title="Year">${year}</td>
      	\n <td scope="row" data-bs-toggle="tooltip" data-bs-placement="top" title="Hour">${hour}</td> 
      	\n <td scope="row" data-bs-toggle="tooltip" data-bs-placement="top" title="Minute">${minute}</td> 
      	\n  <td scope="row" data-bs-toggle="tooltip" data-bs-placement="top" title="Day of week">${day_of_week}</td>
      	\n <td scope="row" data-bs-toggle="tooltip" data-bs-placement="top" title="ID">${id}</td>
      	\n <td scope="row" data-bs-toggle="tooltip" data-bs-placement="top" title="Order">${order_local_id}</td>
      	\n <td scope="row" data-bs-toggle="tooltip" data-bs-placement="top" title="Quantity">${quantity}</td> 
      	\n<td scope="row" data-bs-toggle="tooltip" data-bs-placement="top" title="Price">${price}</td> 
      	\n <td scope="row" data-bs-toggle="tooltip" data-bs-placement="top" title="Sales">${pure_sales}</td> 
      	\n<td scope="row" data-bs-toggle="tooltip" data-bs-placement="top" title="Dining option">${dining_option}</td> 
      	\n<td scope="row" data-bs-toggle="tooltip" data-bs-placement="top" title="Product Name">${product_name}</td>
      	\n<td scope="row" data-bs-toggle="tooltip" data-bs-placement="top" title="sku">${sku}</td>
      	\n<td scope="row" data-bs-toggle="tooltip" data-bs-placement="top" title="Store">${store}</td>
      	\n<td scope="row" data-bs-toggle="tooltip" data-bs-placement="top" title="Product Class">${product_class}</td>
      	\n<td scope="row" data-bs-toggle="tooltip" data-bs-placement="top" title="Category">${category}</td>
      	\n<td scope="row" data-bs-toggle="tooltip" data-bs-placement="top" title="Product Class">${sub_category}</td> 
      	\n 
      	</tr> \n`
    }
    return res;
}

function html(tds,username,password){

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
			<body data-username="${username}" data-password="${password}">
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
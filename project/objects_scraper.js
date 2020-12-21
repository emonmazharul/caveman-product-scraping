const axios = require('axios');

async function objects_scraper (product,cookies) {
	try {
		//the object which take all the values
		const result = {};
		// gogo to the product page and scrap first product datas
		const {data:response} = await axios.get('https://cavemen.revelup.com'+ product, { headers:{ Cookie:cookies } });

		//set the productname and sku property
		result['product_name'] = response.name;
		result['sku'] = response.sku;
		// if response is true
		if(response) { 
			// first goto establishment page and then get estabiishment data and save store in result
			const {data:establishmentData} = await axios.get('https://cavemen.revelup.com'+response.establishment, { headers:{ Cookie:cookies } } );

			//set the store property
			result['store'] = establishmentData.name;

			// second goto product class data page and then get product class data and save product class into productClassData
			const {data:productClassData} = await axios.get('https://cavemen.revelup.com'+ response.productclass, { headers:{ Cookie:cookies } } );
			//set the product class 
			result['product_class'] = productClassData.name;

			// goto category and do same as above
			const {data:categoryData} = await axios.get('https://cavemen.revelup.com'+ response.category, { headers:{ Cookie:cookies } });

			if(categoryData.category || categoryData.parent) {
			// goto parent
				const {data:categoryParentData} = await axios.get('https://cavemen.revelup.com'+ categoryData.parent, { headers:{ Cookie:cookies } });

				// category parent has parent then set the category property
				if(categoryParentData.parent) { 
					result['category'] = categoryParentData.name;
					result['sub_category'] = '';
				} else {
					//set the category and sub catrgory blank string for table
					result['category'] = '';
					result['sub_category'] = '';
				}	
			} else {
				// just set the subcategory property
				result['sub_category'] = categoryData.name;
				result['category'] = '';
			}

		}
		return result;
	} catch (e) {
		console.log('error in objects_scraper functon' , e);
		return {errorMsg:e.message};
	}
}

module.exports = objects_scraper;
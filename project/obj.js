// i don't understand which property you want to keep so follow the steps
// these are poperties every prdocut has
// just delete the properties you don't want keep in your excel 
// then send it back
// const product_data = {
//     applied_discounts: [],
//     applied_service_fee: [],
//     applied_taxes: [ [Object] ],
//     appointment: null,
//     appointment_ref_uuid: null,
//     bill_parent: null,
//     catering_complete: false,
//     catering_delivery_date: null,
//     combo_fraction_part: 0,
//     combo_product_set: null,
//     combo_saving_amount: '0.000000',
//     combo_type: 0,
//     combo_used: null,
//     combo_uuid: null,
//     commission_amount: '0.0000',
//     commissions: [],
//     cost: '0.0000',
//     course_number: 0,
//     created_by: '/enterprise/User/9/',
//     created_date: '2020-11-06T14:54:11',
//     crv_value: 0,
//     cup_qty: 0,
//     cup_weight: 0,
//     date_paid: null,
//     deleted: false,
//     deleted_date: null,
//     dining_option: 1,
//     discount: null,
//     discount_amount: null,
//     discount_code: null,
//     discount_reason: '',
//     discount_rule_amount: null,
//     discount_rule_type: null,
//     discount_tax_amount_included: '0.000000',
//     discount_taxed: null,
//     discounted_by: null,
//     dynamic_combo: null,
//     dynamic_combo_slot: null,
//     ervc_type: 0,
//     event_date: null,
//     exchange_discount: null,
//     exchanged: null,
//     exclude_from_discounts: false,
//     expedited: null,
//     external_shipping_address: null,
//     gift_card_number: null,
//     id: 128534,
//     ingredientitems: [],
//     initial_price: 6.5,
//     invoice_document_uuid: null,
//     is_cold: false,
//     is_discounted: false,
//     is_layaway: false,
//     is_store_credit: false,
//     item_type: 0,
//     kitchen_completed: null,
//     manual_unit_price_adjustment: 0,
//     modifier_amount: 0,
//     modifier_cost: '0.0000',
//     modifieritems: [],
//     not_returnable: false,
//     on_hold: false,
//     on_layaway: null,
//     order: '/resources/Order/60539/',
//     order_local_id: '60539',
//     package: null,
//     package_uuid: null,
//     parent_combo_uuid: null,
//     parent_uuid: null,
//     price: 6.5,
//     price_to_display: '0.000000',
//     printed: true,
//     product: '/resources/Product/3209/',
//     product_name_override: 'Iced White',
//     pump_date: null,
//     pump_number: 0,
//     pure_sales: 6.5,
//     quantity: 1,
//     reference_discount: '',
//     reference_discounts: '[]',
//     resource_uri: '/resources/OrderItem/128534/',
//     returned_establishment: null,
//     sales_tax_exemption_reason: null,
//     scanned_barcode: null,
//     seat_number: 1,
//     sent: false,
//     serial_number: null,
//     service_fee_tax: '0.000000',
//     service_fee_taxed: '0.000000',
//     service_fee_untaxed: '0.000000',
//     service_provider: null,
//     shared: 0,
//     sold_by_weight: false,
//     special_request: null,
//     split_parts: 1,
//     split_type: 0,
//     split_with_seat: 0,
//     start_time: null,
//     station: '/resources/PosStation/9/',
//     tax_amount: 0.455,
//     tax_included: false,
//     tax_rate: 7,
//     tax_rebate: 0,
//     taxed_flag: true,
//     temp_sort: 1604645632,
//     uom: null,
//     updated_by: '/enterprise/User/38/',
//     updated_date: '2020-11-06T15:59:27',
//     uuid: '75f74b65-b0a6-4563-a77e-f7ae0aab9194',
//     void_ref_uuid: null,
//     voided_by: null,
//     voided_date: null,
//     voided_reason: '',
//     weight: 0,
//     wholesale_saving_amount: '0.000000'
//   }

// product "/resources/Product/5408/"

// name "Cavemen Bohemian Pilsner" (cavemen.revelup.com/resources/Product/5408/) as Product Name
// You need to use the field Product above , to get the full URL of the product and extract the name , and put under column Product Name

var json2xls = require('json2xls');
const fs = require('fs');

function dataModifier(object) {
    const {created_date,id,Order,quantity,price,Sales,dining_option,product} = object
    const dateArr =  new Date(created_date).toString().split(' ');
    const [day_of_week,month,date,year] = dateArr.slice(0, 4)
    const [hour,minute] = dateArr[4].split(':') 
    return {
        month,
        date,
        year,
        hour,
        minute,
        'day of week' : day_of_week,
        id,
        Order,
        quantity,
        price,
        Sales,
        dining_option:1,
        'Product Name' : ` "Cavemen Bohemian Pilsner" (cavemen.revelup.com${product})`,
         sku : `"100000028704" (cavemen.revelup.com${product})`
    }
}

fs.readFile('data.json', (err,data) => {
    if(err){
        throw new Error(err);
    }
    const arr = JSON.parse(data).objects;
    const res = [];
    for(let i =0; i<arr.length; i++) {
      const {created_date,id,order_local_id:Order,quantity,price,pure_sales:Sales,dining_option,product} = arr[i];
      const obj = {created_date,id,Order,quantity,price,Sales,dining_option,product};
      res.push(dataModifier(obj));
      // console.log(arr[i].establishment,arr[i].productclass, arr[i].category);
    }
    console.log(res);

})
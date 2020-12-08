const xl = require('excel4node');
const wb = new xl.Workbook();
const fs = require('fs');
const ws = wb.addWorksheet('Worksheet Name');
var json2xls = require('json2xls');

const data = [
 {
    "name":"Shadab Shaikh",
    "email":"shadab@gmail.com",
    "mobile":"1234567890"
 },
 {
    name:'emon',
    email:'emon@gmail.com',
    mobile: '4542453',
 }
]

const headingColumnNames = [
    "Name",
    "Email",
    "Mobile",
]

//Write Column Title in Excel file
let headingColumnIndex = 1;
headingColumnNames.forEach(heading => {
    ws.cell(1, headingColumnIndex++)
        .string(heading)
});

//Write Data in Excel file
let rowIndex = 3;
data.forEach( record => {
    let columnIndex = 1;
    Object.keys(record ).forEach(columnName =>{
        ws.cell(rowIndex,columnIndex++)
            .string(record [columnName])
    });
    rowIndex++;
}); 
console.log('script running');
wb.write('TeacherData.xlsx');
const keeper = ['created_date','id','order_local_id','quantity','price','pure_sales','dining_option', 'product', 'name', ]
fs.readFile('data.json', (err,buffer) => {
  const arr = JSON.parse(buffer).objects.slice(0,1);
  // const headingColumnNames = Object.keys(arr[0]);
  // let headingColumnIndex = 1;
  // headingColumnNames.forEach(heading => {
  //   ws.cell(1, headingColumnIndex++)
  //   .string(heading)
  // });
  // let rowIndex = headingColumnNames.length;
  // arr.forEach( record => {
  //   let columnIndex = 1;
  //   Object.keys(record ).forEach(columnName =>{
  //       ws.cell(rowIndex,columnIndex++)
  //           .string('string')
  //   });
  //   rowIndex++;
  // }); 
  
})


// var json2xls = require('json2xls');
var jsonArr = [{
    foo: 'bar',
    qux: 'moo',
    poo: 123,
    stux: new Date()
},
{
    foo: 'bar',
    qux: 'moo',
    poo: 345,
    stux: new Date()
}];

var xls = json2xls(jsonArr);

fs.writeFileSync('data.xlsx', xls, 'binary');

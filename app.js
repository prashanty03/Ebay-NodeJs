/**
 * Module dependencies.
 */
var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var crypto = require('crypto');
var session = require('express-session');
var bodyParser = require('body-parser');
var fs = require('fs');
//load customers route
var customers = require('./routes/customers'); 
var app = express();
var connection  = require('express-myconnection'); 
//var mysql = require('mysql');
var sess=null;
// all environments
app.set('port', process.env.PORT || 4300);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//app.use(express.favicon());
app.use(session({secret: 'ssshhhhh'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.bodyParser({ keepExtensions: true, uploadDir:'/Users/prashantyadav/Documents/images/uploads' }));
// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}
var flash = require('connect-flash');
app.use(flash());
/*------------------------------------------
    connection peer, register as middleware
    type koneksi : single,pool and request 
-------------------------------------------*/
/*app.use(
    connection(mysql,{        
        host: 'localhost',
        user: 'root',
        password : 'admin',
        port : 3306, //port mysql
        database:'nodejs'
    },'request')
);*/

//route index, hello world
//app.get('/home', routes.index);//route customer list
app.get('/history', customers.getHistoryPage);

app.get('/getBiddingHistory', customers.getBiddingHistory);
app.get('/getPurchaseHistory', customers.getPurchaseHistory);
app.get('/getSellingHistory', customers.getSellingHistory);
app.get('/search', customers.searchproducts);
/////prashant luthra/////
app.get('/', customers.login);
app.get('/users', customers.list);
app.get('/login', customers.login);
app.get('/signup', customers.signup);
app.post('/signup', customers.saveUser);
app.post('/login', customers.logindo);
//////end//////

//app.get('/logout', customers.logout);
//app.post('/addCategory', customers.addCategory);
//app.post('/addElement', customers.addElement);
//app.get('/getDetails/:name', customers.getDetails);
//app.get('/listCategory', customers.listCategory);

//app.get('/customers', customers.list);//route add customer, get n post
//app.get('/customers/add', customers.add);
//app.get('/getAllCategories', customers.getAllCategories);
//app.get('/review_submit/:name', customers.reviews);
//app.get('/get_reviews/:name', customers.get_reviews);
//app.post('/write_reviews', customers.write_reviews);
//app.get('/customers/delete/:id', customers.delete_customer);//edit customer route , get n post
//app.get('/customers/edit/:id', customers.edit); 
//app.post('/customers/edit/:id',customers.save_edit);
app.get('/addProduct', customers.addProduct);
app.post('/addProduct', customers.saveProduct)
app.get('/home', customers.home);
//var CronJob = require('cron').CronJob;
//new CronJob('10 * * * * *', function(){
//    console.log('You will see this message every second');
//}, null, true, "America/Los_Angeles");

app.get('/upload', customers.imageForm);
app.post('/upload', customers.uploadImage);

app.use(app.router);
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
var crypto = require('crypto');
var assert = require('assert');
var algorithm = 'aes256';
var key = 'password';
var password_temp;

var mysqldb = require('../mysqldb.js');
var util = require('util');

//var md5 = require('MD5');
/*
 * GET users listing.
 */


exports.login = function(req, res){
	res.render('login', { message: req.flash('error') });
};

exports.signup = function(req, res){
	res.render('signup',{ message: req.flash('error') });
};

exports.saveUser = function(req,res){
	var input = JSON.parse(JSON.stringify(req.body));
	console.log(input);
	console.log("PAssword: "+input.hash+ " "+ input.password);
	if(input.buyer == 1){
		var buyer = 1;
		var seller = 0;
	}
	else if(input.seller == 2){
		var buyer = 0;
		var seller = 1;
	}
	else{
		var buyer = 1;
		var seller = 1;
	}
//	var password = crypto.createCipher(md5, input.pass);
	var password = input.pass;
	var password_temp = input.pass;
	console.log("Password_temp and password: " + password_temp +password);
	//var hash = require('crypto').createHash('md5').update(password).digest('hex');
	var cipher = crypto.createCipher(algorithm, key);
	var encrypted = cipher.update(password, 'utf8', 'hex') + cipher.final('hex');
	//req.getConnection(function (err, connection) {
	var data = {
			firstname : input.firstname,
			lastname : input.lastname,
			email : input.email,
			password : encrypted,
			address : input.address,
			city: input.city,
			state: input.state,
			country : input.country,
			street : input.street,
			zip: input.zip,
			contact: input.contact,
			isAdmin: 'N',
			lastlogin: new Date(),
			isActive:'1',
			isBuyer: buyer,
			isSeller: seller
	};
	var connection = mysqldb.getConnection();
	connection.connect();
	var query = connection.query("SELECT * from person WHERE email = ? ", [data.email], function(err, rows){
		if(err){
			console.log("Error fecthing details : %s", err);
			res.redirect('/signup');
		}
		if(rows[0]==undefined){
			var query = connection.query("INSERT INTO person set ?",data,function(err,rows){
				if(err)
					console.log("Error Inserting: %s",err);
				req.flash('error', 'You are registerd.Please Login!');
				res.redirect('/');
			});
			connection.end();
		}
		else {
			if(rows[0].email == input.email)
			{
				req.flash('error', 'Email ID already exists. Please try another email.');
				res.redirect('/signup');
			}
		}
		
	});
	//});
};

exports.logindo = function(req,res){
	var input = JSON.parse(JSON.stringify(req.body));
	//req.getConnection(function(err,connection){
		var data = {
				email : input.email,
				password : input.pass,
		};
		console.log(data);
		var password_check = input.pass;
		var cipher = crypto.createCipher(algorithm, key);
		var encrypted_password = cipher.update(password_check, 'utf8', 'hex') + cipher.final('hex');
		var connection = mysqldb.getConnection();
		connection.connect();
		var query = connection.query("SELECT * from person WHERE email = ? ", [data.email], function(err, rows){
			if(err){
				console.log("Error fecthing details : %s", err);
				res.redirect('/');
			}
			var userexist = rows[0];
			console.log("rows: " + userexist);
			if(userexist == undefined)
			{
				console.log("rows: " + userexist);
				req.flash('error','Username does not exists in database');
				res.redirect('/');
			}
			else{
				if(rows[0].password == encrypted_password){
					sess = req.session;
					console.log(req.session);
					console.log(rows[0].firstname);
					sess.fname = rows[0].firstname;
					sess.lname = rows[0].lastname;
					sess.email = rows[0].email;
					sess.isAdmin = rows[0].isAdmin;
					sess.isBuyer = rows[0].isBuyer;
					sess.isSeller = rows[0].isSeller;
					sess.memberno = rows[0].membership_no;
					sess.lastlogin = rows[0].lastlogin.toString().substr(0,23);
					console.log("Session: " +JSON.stringify(sess));

					res.render('home', {page_title:"After Login", data:rows, firstname: sess.fname, lastname: sess.lname, email: sess.email, lastlogin: sess.lastlogin, isAdmin: sess.isAdmin, isBuyer: sess.isBuyer, isSeller: sess.isSeller, memberno: sess.memberno});
				}
				else{
					req.flash('error','Username or password is incorrect. Try Again!');
					res.redirect('/');
				}
			}
		});
		connection.end();
	//});
};


/*
 * GET users listing.
 */

exports.list = function(req, res){
	var coneection = mysqldb.getConnection();
	connection.query('SELECT * FROM customer',function(err,rows)     {
		if(err)
			console.log("Error Selecting : %s ",err );
		res.render('customers',{page_title:"Customers - Node.js",data:rows});
	});
	connection.end();

};

exports.getAllCategories = function(req, res){
	res.render('allCategories',{page_title:"Categories"});
};

exports.listCategory = function(req, res){
	//console.log(req.session.fname);
//	if(req.session.fname == undefined){
//	res.redirect("/");
//	}
//	else{
	var connection = mysqldb.getConnection();
	connection.connect();
	connection.query('SELECT * from category', function(err, rows){
		if(err)
			console.log("Error getting vlaues % s", err);
		res.render('categories', {page_title:"Categories", data:rows, isAdmin : sess.isAdmin, name: sess.fname, email : sess.email, lastlogin: sess.lastlogin});
	});
	connection.end();
	//}
}


exports.addCategory = function(req,res){
	var input = JSON.parse(JSON.stringify(req.body));
	var data = {
			name : input.name,
			description : input.description,
	};
	var connection = mysqldb.getConnection();
	console.log(data);
	connection.connect();
	var query = connection.query("Insert into category set ? ", data, function(err, rows){
		if(err)
			console.log("Error inserting : %s", err);
		res.redirect('/home');
		//res.render('categories', {page_title:"Categories", data:rows, name:sess.fname, lastlogin: sess.lastlogin, email :sess.email});
	});
	connection.end();
	//}
}

exports.addElement = function(req, res){
//	if(req.session.fname == undefined){
//	res.redirect("/");
//	}
//	else {

	var input = JSON.parse(JSON.stringify(req.body));
	var data = {
			name : input.name,
			description : input.description,
			address : input.address,
			total_reviews: 0,
			category_name : input.category_name
	};
	var connection = mysqldb.getConnection();
	console.log(data);
	connection.connect();

	var query = connection.query("Insert into element set ? ", data, function(err, rows){
		if(err)
			console.log("Error inserting : %s", err);
		res.redirect('/getDetails/'+data.category_name);
	});
	connection.end();
	//}

}
exports.edit = function(req,res){
	var id = req.params.id;
	req.getConnection(function(err, connection){
		connection.query('select * from customer where id = ?', [id], function(err, rows){
			if(err){
				cosole.log("error : %s", err);
			}
			res.render('edit_customer', {page_title:"Edit Customers",data : rows});
		});
	});
};

exports.save = function(req, res){
//	var input = JSON.parse(JSON.stringify(req.body));
//	console.log(input);
//	var connection = mysqldb.getConnection();
//	connection.connect();
//	var data = {
//	firstName : input.firstName,
//	lastName : input.lastName,
//	email : input.email,
//	password : input.password,
//	isAdmin : 'N',
//	lastlogin: new Date()
//	};
//	console.log(data);
//	var query = connection.query("Insert into users set ? ", data, function(err, rows){
//	if(err)
//	console.log("Error inserting : %s", err);
//	res.redirect('/');
//	});
//	connection.end();
	var rest = require('restler');

	rest.get('http://localhost:8080/NewGumBall/machines').on('complete', function(result) {
		if (result instanceof Error) {
			console.log('Error:', result.message);
			this.retry(5000); // try again after 5 sec
		} else {
			console.log(result);
		}
	});

}


exports.reviews = function(req, res){
	var name = req.params.name;
	res.render('review_submit',{page_title:"Categories",element_name:name, name:sess.fname, lastlogin: sess.lastlogin, email :sess.email});
}
exports.get_reviews = function(req, res){
	var name = req.params.name;
//	if(req.session.fname == undefined){
//	res.redirect("/");
//	}
//	else {
	var connection = mysqldb.getConnection();

	connection.query("Select * from reviews where element_name = ?",[name], function(err, rows){
		if(err)
			console.log("Error fetching results : %s", err);
		res.render('get_reviews',{page_title:"Categories", data: rows, element_name:name, name:sess.fname, lastlogin: sess.lastlogin, email :sess.email});
	});
	connection.end();
	//}

}
exports.write_reviews = function(req, res){
	var input = JSON.parse(JSON.stringify(req.body));
//	if(req.session.fname == undefined){
//	res.redirect("/");
//	}
//	else {
	var connection = mysqldb.getConnection();

	var data = {
			element_name : input.element_name,
			rating : input.rating,
			review : input.review,
			submitted_by : sess.email,
			submitted_on : new Date(),
	};

	var query  = connection.query("Insert into reviews set ? ", data, function(err, rows){
		if (err)
			console.log("Error inserting : %s ",err );
		else{

			connection.query("Select * from reviews where element_name = ?",[input.element_name], function(err, rows){
				if(err)
					console.log("Error fetching results : %s", err);
				console.log(rows + "************");
				res.render('get_reviews',{page_title:"Categories", data: rows, element_name:data.element, name:sess.fname, lastlogin: sess.lastlogin, email :sess.email});
			});
			connection.end();
		}
	});

	//}

};
exports.save_edit = function(req,res){
	var input = JSON.parse(JSON.stringify(req.body));
	var id = req.params.id;
	req.getConnection(function (err, connection) {
		var data = {
				name    : input.name,
				address : input.address,
				email   : input.email,
				phone   : input.phone 

		};

		connection.query("UPDATE customer set ? WHERE id = ? ",[data,id], function(err, rows)
				{

			if (err)
				console.log("Error Updating : %s ",err );

			res.redirect('/customers');

				});

	});
};

exports.delete_customer = function(req,res){

	var id = req.params.id;

	req.getConnection(function (err, connection) {

		connection.query("DELETE FROM customer  WHERE id = ? ",[id], function(err, rows)
				{

			if(err)
				console.log("Error deleting : %s ",err );

			res.redirect('/customers');

				});

	});
};

exports.getDetails = function(req,res){
	var name = req.params.name;
//	if(req.session.fname == undefined){
//	res.redirect("/");
//	}
//	else {
	var connection = mysqldb.getConnection();

	connection.query("Select * from element where category_name = ?",[name], function(err, rows){
		if(err)
			console.log("Error fetching results : %s", err);
		console.log(rows + "************");

		res.render('details',{page_title:"Details", isAdmin : sess.isAdmin, data : rows, category_name : name, data:rows, name : sess.fname, lastlogin: sess.lastlogin});
	});

	connection.end();
	//}
}

exports.logout = function(req, res){
	var email = sess.email;
	var lastlogin = new Date();
	console.log(email);
	req.session.destroy(function(err){
		if(err){
			console.log(err);
		}
		else{
			var connection = mysqldb.getConnection();

			connection.query("UPDATE users set lastlogin = ? WHERE email = ? ", [lastlogin,email], function(err, rows){
				if(err){
					cosole.log("error : %s", err);
				}
				res.redirect('/');
			});

			connection.end();
		}
	});
}

exports.getHistoryPage = function(req, res){
	res.render('History', {page_title:"",dataVar : "ABC"});
}

exports.getBiddingHistory  = function(req, res){
	var connection = mysqldb.getConnection();
	var id = 1 //session user-id
	connection.query("select p.id as purchase_id, pr.id as product_id, pr.name as product_name, pr.details as product_details, " +
			" pr.image, s.id as seller_id," +
			" s.firstname as seller_name, s.membership_no as membership_no, p.bid_amount, p.submitted_on, p.rating " +
			" from Purchase p JOIN Products pr" +
			" ON p.product_id = pr.id " +
			" JOIN person s ON s.id = pr.seller_id " +
			" WHERE p.customer_id = ? AND pr.isForAuction = 1",[id], function(err, rows){
		if(err)
			console.log("Error fetching results : %s", err);
		console.log(rows + "************");
		res.render('BiddingHistory',{page_title:"",dataVar : rows});
	});

	connection.end();
}


exports.getPurchaseHistory  = function(req, res){
	var connection = mysqldb.getConnection();
	var id = 1 //session user-id
	connection.query("	select p.id as purchase_id, pr.id as product_id, pr.name " +
			" as product_name,pr.details as product_details, pr.image, s.id " +
			" as seller_id,s.firstname as seller_name, p.bid_amount, " +
			" p.submitted_on, p.rating " +
			" from Purchase p JOIN Products pr ON p.product_id = pr.id JOIN person s " +
			" ON s.id = pr.seller_id WHERE p.customer_id = ? AND p.sold=1",[id], function(err, rows){
		if(err)
			console.log("Error fetching results : %s", err);
		console.log(rows + "************");
		res.render('BiddingHistory',{page_title:"",dataVar : rows});
	});

	connection.end();
}




exports.getSellingHistory  = function(req, res){
	var connection = mysqldb.getConnection();
	var id = 2 //session user-id
	connection.query("select p.id as purchase_id, pr.id as product_id, pr.name as product_name, pr.image as image, " +
			" s.id as seller_id, s.firstname as seller_name, p.bid_amount as bid_amount, p.submitted_on, p.rating, " +
			" c.firstname as customer_name, c.id as customer_id, p.quantity " +
			" from Purchase p JOIN Products pr ON p.product_id = pr.id " +
			" JOIN person s ON s.id = pr.seller_id JOIN  person c " +
			" ON c.id = p.customer_id WHERE pr.seller_id = 2 AND p.sold=1",[id], function(err, rows){
		if(err)
			console.log("Error fetching results : %s", err);
		console.log(rows + "************");
		res.render('SellingHistory',{page_title:"",dataVar : rows});
	});

	connection.end();
}

exports.imageForm = function(req, res) {
	res.render('upload', {
		title: 'Upload Images'
	});

};

exports.uploadImage = function(req, res, next){
	// console.log('file info: ',req.files.image);

	//split the url into an array and then get the last chunk and render it out in the send req.
	var pathArray = req.files.image.path.split( '/' );

	var ts = new Date();
	console.log('A : '+ req.files.image.name);
	console.log('A1 : ' + req.files.image.size);
	console.log('A2 : '+req.files.image.path);
	console.log('A3 : '+req.body.title);
	console.log('A4 : '+req.files.image);
	console.log('A5 :'+ pathArray)


	var fs = require('fs');
	fs.rename( req.files.image.path, '/Users/prashantyadav/Documents/images/uploads/AF.png', function(err) {
		if ( err ) console.log('ERROR: ' + err);
	});

//	res.send(util.format('<img src="/Users/prashantyadav/Documents/images/uploads/AF.png">'
//	));


};

exports.addProduct = function(req, res){
	res.render('addProduct',{ message: req.flash('error')});
};

exports.saveProduct = function(req, res){
	var input = JSON.parse(JSON.stringify(req.body));
	var connection = mysqldb.getConnection();
	var condition = input.condition=="1000"?"New":"Refurbished";
	var auction = input.format=="Auction"?1:0;
	var temp_path = req.files.image.path; 
	console.log(temp_path);

	var data = {
			name : input.title,
			details : input.details,
			condition : condition,
			isForAuction : auction,
			min_bid : input.startPrice*1,
			quantity : parseInt(input.quantity),
			bid_duration : parseInt(input.duration),
			category_id : input.categoryId,
			cost : input.startPrice * 1,
			seller_id : 3,
			bid_start_time : new Date(),
			image : temp_path
	};
	//console.log(data);

	var msg = validate(input, req.files.image.name);

	console.log("Message : "+msg.length);
	if(msg.length==0){

		console.log("inside if")
		connection.connect();
		var query = connection.query("Insert into products set ? ", data, function(err, info){
			if(err)
				console.log("Error inserting : %s", err);
			else
			{
				console.log("dasdasdaaasda");
				console.log(info.insertId);
				res.render('addProduct', {message:'Product added successfuly'});
			}

			//res.redirect('/addProduct');
			//res.render('categories', {page_title:"Categories", data:rows, name:sess.fname, lastlogin: sess.lastlogin, email :sess.email});
		});
		connection.end();
	}
	else
	{
		console.log("inside else")
		req.flash('error', msg);
		res.redirect('/addProduct');
	}

	// set where the file should actually exists - in this case it is in the "images" directory
	//   var target_path = '/images/' + req.files.image.name;
	// move the file from the temporary location to the intended location
//	fs.rename(tmp_path, target_path, function(err) {
//	if (err) throw err;
//	// delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files
//	fs.unlink(tmp_path, function() {
//	if (err) throw err;
//	res.send('File uploaded to: ' + target_path + ' - ' + req.files.thumbnail.size + ' bytes');
//	});
//	});

}

exports.home = function(req, res){
	res.render('home');
}
validate = function(input, name){

	var msgappender =" is mandoatory";
	var msg="";
	console.log(typeof (input.startPrice*1));
	console.log(name.toString());
	console.log(name.toString().indexOf("JPEG")!=-1);
	console.log(name.toString().indexOf("jpeg")!=-1);
	console.log(name.toString().indexOf("JPG")!=-1);
	console.log(name.toString().indexOf("jpg")!=-1);
	console.log(name.toString().indexOf("PNG")!=-1);
	console.log(name.toString().indexOf("png")!=-1);

	if(input.title=="" || input.title.length==0){
		msg = "Title" +msgappender;
	}
	else if(input.details=="" || input.details.length==0){
		msg = "Description"+msgappender;
	}
	else if(input.condition=="" || input.condition.length==0)
		msg = "Condition"+msgappender;
	else if(input.format=="" || input.format.length==0)
		msg = "List As"+msgappender;
	else if(input.startPrice=="" || input.condition.length==0)
		msg = "Start Prie"+msgappender;
	else if(input.duration=="" || input.duration.length==0)
		msg = "Duration"+msgappender;
	else if(name.toString().indexOf(".")==-1 )
		msg = "Invalid Image";
//	else if(!(name.toString().indexOf("JPEG")!=-1 || name.toString().indexOf("jpeg")!=-1 
//	|| name.toString().indexOf("JPG")!=-1 || name.toString().indexOf("jpg")!=-1
//	|| name.toString().indexOf("png")!=-1)){
//	msg = "Only JPEG,JPG and PNG Image supported";
//	}
	else if((input.startPrice*1)==NaN)
		msg == "Invalid Start Price";


	return msg;

}


exports.searchproducts = function(req, res){
	var connection = mysqldb.getConnection();
	connection.connect();
	
	var query =  connection.query('SELECT name from products where name like "%'+req.query.key+'%"', 
			function(err, rows, fields) {
			      if (err) throw err;
			    var data=[];
			    for(i=0;i<rows.length;i++)
			      {
			        data.push(rows[i].name);
			      }
			      res.end(JSON.stringify(data));
			    });
	
	connection.end();
}
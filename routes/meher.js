var mysqldb = require('../mysqldb.js');

exports.getCategories = function(req, res) {
	if (req.session.uid == undefined) {
		req.flash('error', 'Please Login..!!');
		res.redirect("/login");
	} else {
		var connection = mysqldb.getConnection();
		connection.connect();
		var query = connection.query('SELECT name from category', function(err,
				rows) {
			if (err)
				console.log("Error getting vlaues % s", err);
			connection.end();
			res.render('categories', {
				page_title : "Categories",
				data : rows
			});
		});
	}
}

exports.updateProduct = function(req, res) {
	if (req.session.uid == undefined) {
		req.flash('error', 'Please Login..!!');
		res.redirect("/login");
	} else {
		var connection = mysqldb.getConnection();
		connection.connect();
		var productId = req.params.productId;
		var catName = req.params.catName;
		console.log('********' + productId + 'in update***********');
		var query = connection.query('SELECT * from products where id=?',
				[ productId ], function(err, rows) {
					if (err)
						console.log("Error getting vlaues % s", err);
					connection.end();
					console.log(rows);
					res.render('updateProduct', {
						page_title : "Update Product",
						data : rows,
						productId : productId,
						catName : catName,
						message : req.flash('error')
					});
				});
	}
};

exports.saveUpdatedProduct = function(req, res) {
	if (req.session.uid == undefined) {
		req.flash('error', 'Please Login..!!');
		res.redirect("/login");
	} else {
		var input = JSON.parse(JSON.stringify(req.body));
		var connection = mysqldb.getConnection();
		var productId = input.productId;
		console.log('********************' + productId
				+ ' in saveUpdated******************');
		var condition = input.condition == "1000" ? "New" : "Refurbished";
		var auction = input.format == "Auction" ? 1 : 0;
		var temp_path = req.files.image.path;
		console.log(temp_path);
		var fs = require('fs');
		var data = {
			name : input.title,
			details : input.details,
			condition : condition,
			isForAuction : auction,
			min_bid : input.startPrice * 1,
			quantity : parseInt(input.quantity),
			bid_duration : parseInt(input.duration),
			category_id : input.categoryId,
			cost : input.startPrice * 1,
			bid_start_time : new Date(),
			image : input.image
		};
		// console.log(data);

		var msg = validate(input, req.files.image.name);
		console.log(msg);
		console.log("Message : " + msg.length);
		if (msg.length == 0) {

			console.log("inside if")
			// get the temporary location of the file
			var tmp_path = req.files.image.path;
			// set where the file should actually exists - in this case it is in
			// the
			// "images" directory
			var target_path = './public/images/' + req.files.image.name;
			// move the file from the temporary location to the intended
			// location
			fs.rename(tmp_path, target_path, function(err) {
				if (err)
					throw err;
				// delete the temporary file, so that the explicitly set
				// temporary
				// upload dir does not get filled with unwanted files
				fs.unlink(tmp_path, function() {
					if (err)
						throw err;
					console.log();
					// res.send('File uploaded to: ' + target_path + ' - ' +
					// req.files.image.size + ' bytes');
				});
			});
			var data = {
				name : input.title,
				details : input.details,
				condition : condition,
				isForAuction : auction,
				min_bid : input.startPrice * 1,
				quantity : parseInt(input.quantity),
				bid_duration : parseInt(input.duration),
				category_id : input.categoryId,
				cost : input.startPrice * 1,
				bid_start_time : new Date(),
				image : target_path.substring(8)
			};
			connection.connect();
			var query = connection.query("update products set ? where id = ?",
					[ data, productId ], function(err, info) {
						if (err)
							console.log("Error inserting : %s", err);
						else {
							res.redirect('/getSellerProducts');
						}

					});
			console.log(query);
			connection.end();
		} else {
			console.log("inside else")
			req.flash('error', msg);
			res.redirect('/updateProduct');
		}

		// set where the file should actually exists - in this case it is in the
		// "images" directory
		// var target_path = '/images/' + req.files.image.name;
		// move the file from the temporary location to the intended location
		// fs.rename(tmp_path, target_path, function(err) {
		// if (err) throw err;
		// // delete the temporary file, so that the explicitly set temporary
		// upload
		// dir does not get filled with unwanted files
		// fs.unlink(tmp_path, function() {
		// if (err) throw err;
		// res.send('File uploaded to: ' + target_path + ' - ' +
		// req.files.thumbnail.size + ' bytes');
		// });
		// });
	}
}

exports.getProducts = function(req, res) {
	if (req.session.uid == undefined) {
		req.flash('error', 'Please Login..!!');
		res.redirect("/login");
	} else {
		var category_name = req.params.name;
		console.log(category_name);
		var connection = mysqldb.getConnection();
		connection.connect();

		var query = connection
				.query(
						"Select * from products where category_id = (select id from category where name = ?)",
						[ category_name ],
						function(err, rows) {
							if (err)
								console.log("Error fetching results : %s", err);
							connection.end();
							res.render('getProducts', {
								page_title : "Products",
								data : rows,
								name : category_name
							});
						});
	}
};

exports.getSellerProducts = function(req, res) {
	if (req.session.uid == undefined) {
		req.flash('error', 'Please Login..!!');
		res.redirect("/login");
	} else {
		var seller_id = req.session.uid;
		console.log(seller_id + "Seller_Id");
		var connection = mysqldb.getConnection();
		connection.connect();

		var query = connection.query(
				"Select p.*, c.name as cname from products p join category c on c.id = p.category_id where p.seller_id = ?", seller_id,
				function(err, rows) {
					if (err)
						console.log("Error fetching results : %s", err);
					connection.end();
					res.render('getSellerProducts', {
						page_title : "Listed Products",
						data : rows
					});
				});
	}
};

validate = function(input, name) {

	var msgappender = " is mandoatory";
	var msg = "";
	console.log(typeof (input.startPrice * 1));
	console.log(name.toString());
	console.log(name.toString().indexOf("JPEG") != -1);
	console.log(name.toString().indexOf("jpeg") != -1);
	console.log(name.toString().indexOf("JPG") != -1);
	console.log(name.toString().indexOf("jpg") != -1);
	console.log(name.toString().indexOf("PNG") != -1);
	console.log(name.toString().indexOf("png") != -1);

	if (input.title == "" || input.title.length == 0) {
		msg = "Title" + msgappender;
	} else if (input.details == "" || input.details.length == 0) {
		msg = "Description" + msgappender;
	} else if (input.condition == "" || input.condition.length == 0)
		msg = "Condition" + msgappender;
	else if (input.format == "" || input.format.length == 0)
		msg = "List As" + msgappender;
	else if (input.startPrice == "" || input.condition.length == 0)
		msg = "Start Price" + msgappender;
	else if (input.duration == "" || input.duration.length == 0)
		msg = "Duration" + msgappender;
	else if (name.toString().indexOf(".") == -1)
		msg = "Invalid Image";
	// else if(!(name.toString().indexOf("JPEG")!=-1 ||
	// name.toString().indexOf("jpeg")!=-1
	// || name.toString().indexOf("JPG")!=-1 ||
	// name.toString().indexOf("jpg")!=-1
	// || name.toString().indexOf("png")!=-1)){
	// msg = "Only JPEG,JPG and PNG Image supported";
	// }
	else if ((input.startPrice * 1) == NaN)
		msg == "Invalid Start Price";
	return msg;
}

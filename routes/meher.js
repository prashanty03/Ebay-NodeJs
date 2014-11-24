var mysqldb = require('../mysqldb.js');

exports.getCategories = function(req, res) {
	/*
	 * if(req.session.fname == undefined){ res.redirect("/"); } else{
	 */
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

exports.updateProduct = function(req, res) {
	var connection = mysqldb.getConnection();
	connection.connect();
	var product_id = req.params.id;
	var query = connection.query('SELECT * from products where id="1"',
			function(err, rows) {
				if (err)
					console.log("Error getting vlaues % s", err);
				connection.end();
				console.log(rows);
				res.render('updateProduct', {
					page_title : "Update Product",
					data : rows
				});
			});
};

exports.saveUpdatedProduct = function(req, res) {
	var input = JSON.parse(JSON.stringify(req.body));
	var connection = mysqldb.getConnection();
	connection.connect();
	var product_id = req.params.id;
	var condition = input.condition == "1000" ? "New" : "Refurbished";
	var auction = input.format == "Auction" ? 1 : 0;
	var temp_path = req.files.image.path;
	console.log(temp_path);
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
		seller_id : 3,
		bid_start_time : new Date(),
		image : temp_path
	};
	// console.log(data);
	var msg = validate(input, req.files.image.name);
	console.log("Message : " + msg.length);
	if (msg.length == 0) {
		console.log("inside if")
		// connection.connect();
		var query = connection.query("Update products set ? where id = '1' ",
				data, function(err, info) {
					if (err)
						console.log("Error inserting : %s", err);
					else {
						console.log("dasdasdaaasda");
						res.render('updateProduct', {});
					}
					// res.redirect('/addProduct');
					// res.render('categories', {page_title:"Categories",
					// data:rows, name:sess.fname, lastlogin: sess.lastlogin,
					// email :sess.email});
				});
		connection.end();
	} else {
		console.log("inside else")
		// req.flash('error', msg);
		res.redirect('/updateProduct');
	}
	// set where the file should actually exists - in this case it is in the
	// "images" directory
	// var target_path = '/images/' + req.files.image.name;
	// move the file from the temporary location to the intended location
	// fs.rename(tmp_path, target_path, function(err) {
	// if (err) throw err;
	// // delete the temporary file, so that the explicitly set temporary upload
	// dir does not get filled with unwanted files
	// fs.unlink(tmp_path, function() {
	// if (err) throw err;
	// res.send('File uploaded to: ' + target_path + ' - ' +
	// req.files.thumbnail.size + ' bytes');
	// });
	// });
};

exports.getProducts = function(req, res) {
	var category_name = req.params.name;
	console.log(category_name);
	/*
	 * if(req.session.fname == undefined){ res.redirect("/"); } else {
	 */
	var connection = mysqldb.getConnection();
	connection.connect();
	var query = connection
			.query(
					"Select * from products where category_id = (select id from category where name = ?)",
					[ category_name ], function(err, rows) {
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

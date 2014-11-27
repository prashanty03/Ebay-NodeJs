/**
 * New node file
 */

var mysqldb = require('../mysqldb.js');
var util = require('util');

exports.getProductDetails = function(req,res){
	//var input = JSON.parse(JSON.stringify(req.body));
	var id = req.params.id;
	var connection = mysqldb.getConnection();
	connection.connect();
	var query =connection.query("select pr.name as product_name,pr.details as product_details, pr.image,pr.`condition` as product_condition,pr.cost as cost,pr.isForAuction as auction,pr.min_bid as min_bid,pr.bid_duration as bid_duration,pr.quantity as quantity,pr.bid_start_time as bid_start_time,p.firstname as seller_name from Products pr JOIN Person p ON pr.seller_id=p.id WHERE pr.id=?",[id], function(err, rows)
			{

		if (err)
			console.log("Error : %s ",err );
		res.render('getProductDetailsBid',{data:rows,message: req.flash('message')});

			});
	connection.end();

};

exports.bid = function(req, res){
	var id = req.params.id;
	var input = JSON.parse(JSON.stringify(req.body));
	var data = {
			product_id : 1,
			customer_id : 1,   //to be replaced by sesion id
			bid_amount : input.bid_amount,
			submitted_on: new Date(),
			sold : 0,
			quantity : 1

	};
	var connection = mysqldb.getConnection();
	console.log(data);
	connection.connect();
	var query=connection.query("select min_bid from products where id = 1 ",[data.product_id],function(err,rows)
			{
		  console.log(rows);
		if(err){
			console.log("Error fecthing details : %s", err);
			res.redirect('/getProductDetailsBid');
		} 
		if(input.bid_amount<rows[0].min_bid)
		{
			req.flash('message','Error : Invalid Bid Amount!');
			res.redirect('/getProductDetailsBid');
		}
		else
		{
			var query = connection.query("Insert into purchase set ? ", data, function(err, rows){
				if(err)
					console.log("Error inserting : %s", err);
				else
				{
					req.flash('message','Your Bid Hasbeen Successfully Placed!');
					res.redirect('/getProductDetailsBid');

				}



			});
			connection.end();
		}
			});
	//connection.end();

}

exports.buy = function(req, res){
	var id = req.params.id;
	var input = JSON.parse(JSON.stringify(req.body));
	var connection = mysqldb.getConnection();
	connection.connect();
	var query=connection.query("select cost,quantity from products where id =1 ",id,function(err,rows){
		if(err){
			console.log("Error fecthing details : %s", err);
			res.redirect('/getProductDetailsBid');
		} 	
		else{
			var data = {
					product_id : 1,
					customer_id : 1,   //to be replaced by sesion id
					bid_amount : rows[0].cost,
					submitted_on: new Date(),
					sold : 0,
					quantity : input.quantity

			};
			var old_qty=rows[0].quantity;
			console.log(data);
			if(input.quantity<=old_qty)
			{
				var query = connection.query("Insert into purchase set ? ", data, function(err, rows){
					console.log(rows);
					if(err)
						console.log("Error inserting : %s", err);
					else
					{
						console.log(typeof old_qty);
						console.log(typeof input.quantity);
						var query= connection.query("update products set quantity=?", [old_qty-input.quantity], function(err, rows){
							if(err)
								console.log("Error inserting : %s", err);
							else{

								req.flash('message','You have Successfully Placed your Order!');
								res.redirect('/getProductDetailsBid');

							}
						});
						connection.end();
					}

				});
			}
			
			else{
				req.flash('message','Error:Invalid Quantity!');
				res.redirect('/getProductDetailsBid');

			}
		}	
			
		});
						//connection.end();

	}
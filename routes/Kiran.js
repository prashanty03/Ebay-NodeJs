var ejs = require("ejs");
var mysql = require('../mysqldb');
var url=require('url');
function getUserDetails(req,res)
{   var url_parts=url.parse(req.url,true);
    var query= url_parts.query;
    var user_id=parseInt(query.id);  
	var details="select * from person where id='"+user_id+"'";
	var con=mysql.getConnection();
	con.query(details, function(err, results)
	{
		if(results.length >0)
			{
			res.send(results);
			console.log(results);
			res.end();
			}
		else
			{
			console.log("no details for the given id");
			res.send("no details for the given id");
			}
	}
	
	);
	con.end();
}
function start(req,res)
{
	ejs.renderFile('./views/home.ejs',function(err,result)
			{
		if(!err){
			
			res.end(result);
		}
		else
			{
			res.end('An error occured');
			console.log(err);
			}
		      
			});	
}
function update(req,res)
{   
	var query="select * from person where ";
	ejs.renderFile('./views/update.ejs',function(err,result)
			{
		if(!err){
			
			res.end(result);
		}
		else
			{
			res.end('An error occured');
			console.log(err);
			}
		      
			});	

}
function updateUserDetails(req,res)
{
	var firstname=req.param("firstname");
	var lastname=req.param("lastname");
	var address=req.param("address");
	var password=req.param("pass");
	var city=req.param("city");
	var state=req.param("state");
	var zip=req.param("zip");
	var contact=req.param("contact");
	var query="update person set firstname='"+firstname+"',lastname='"+lastname+"',address='"+address+"',city='"+city+"',state='"+state+"',zip='"+zip+"',contact='"+contact+"' where id='2'";
    var con=mysql.getConnection();
    con.query(query,function(err,results)
    		{
    	      if(!err)
    	    	  {
    	    	  res.send("updated");
    	    	  console.log("updated");
    	    	  res.end();
    	    	  }
    	      else
    	    	  {
    	    	  res.send("not updated");
    	    	  console.log("not updated");
    	    	  res.end();
    	    	  }
    		});
    con.end();

}
function searchProducts(req,res)
{   var details=[];
    var cost=[]; 
    var condition=[];
    var availableQuantity=[];
    var name=[];
	var searchQuery=req.param("_nkw");
	//var condition=req.param("Condition");
	//console.log(condition);
	var query="select * from products where name REGEXP '"+searchQuery+"' OR details REGEXP '"+searchQuery+"' OR `condition` REGEXP '"+searchQuery+"'";
	//var query="select name,details,condition from products where condition REGEXP '"+searchQuery+"'";
	var con=mysql.getConnection();
	con.query(query,function(err,results)
	{
		if(!err)
			{
		//res.send(results);
			for(var i=0; i<results.length;i++)
				{
				name[i]=results[i].name;
				details[i]=results[i].details;
				cost[i]=results[i].cost;
				condition[i]=results[i].condition;
				availableQuantity[i]=results[i].quantity;
				}
		  ejs.renderFile('./views/sample.ejs',{data0:name,data:details, data1:cost, data2:condition,data3:availableQuantity,searchName:searchQuery},function(err,result)
				  {
			        if(!err)
			        	{
			        	  res.end(result);
			        	}
			        else
			        	{
			        	res.end("An error occured");
			        	console.log(err);
			        	}
				  });
        res.end();
			}
		else
			{
			console.log(results);
			res.send("no results");
			}
	});

}
function getCustomers(req,res)
{   
	var firstname=[];
	var lastname=[];
	var email=[];
	var contact=[];
	var query="select * from person where isBuyer=1";
	var con=mysql.getConnection();
	con.query(query,function(err,results)
			{
		      if(results.length>0)
		      { 
		    	  for(var i=0; i<results.length;i++)
					{
					firstname[i]=results[i].firstname;
					lastname[i]=results[i].lastname;
					email[i]=results[i].email;
					contact[i]=results[i].contact;
					}
		    	ejs.renderFile('./views/users.ejs',{data:firstname, data1:lastname, data2:email,data3:contact},function(err,result)
				  {
			        if(!err)
			        	{
			        	  res.end(result);
			        	}
			        else
			        	{
			        	res.end("An error occured");
			        	console.log(err);
			        	}
				  });
        
			}
		else
			{
			console.log(results);
			res.send("no results");
			res.end();
			  
		    	  
		      }
		    	
			});


}
function getSellers(req,res)
{
	var firstname=[];
	var lastname=[];
	var email=[];
	var contact=[];
	var query="select * from person where isSeller=1";
	var con=mysql.getConnection();
	con.query(query,function(err,results)
			{
		      if(results.length>0)
		      { 
		    	  for(var i=0; i<results.length;i++)
					{
					firstname[i]=results[i].firstname;
					lastname[i]=results[i].lastname;
					email[i]=results[i].email;
					contact[i]=results[i].contact;
					}
		    	ejs.renderFile('./views/sellers.ejs',{data:firstname, data1:lastname, data2:email,data3:contact},function(err,result)
				  {
			        if(!err)
			        	{
			        	  res.end(result);
			        	}
			        else
			        	{
			        	res.end("An error occured");
			        	console.log(err);
			        	}
				  });
        
			}
		else
			{
			console.log(results);
			res.send("no results");
			res.end();
			  
		    	  
		      }
		    	
			});



}
/*function search(req,res)
{
	ejs.renderFile('./views/search.ejs',function(err,result)
			{
		if(!err){
			
			res.end(result);
		}
		else
			{
			res.end('An error occured');
			console.log(err);
			}
		      
			});	
	
	
}*/

exports.getUserDetails=getUserDetails;
exports.start=start;
exports.updateUserDetails=updateUserDetails;
exports.update=update;
exports.searchProducts=searchProducts;
exports.getCustomers=getCustomers;
exports.getSellers=getSellers;

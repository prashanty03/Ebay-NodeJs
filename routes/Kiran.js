var ejs = require("ejs");
var mysql = require('../mysqldb');
var url = require('url');
function getUserDetails(req, res) {
    if (req.session.fname == undefined) {
        res.redirect("/");
    }

    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;
    var user_id = parseInt(query.id);
    var details = "select * from person where id='" + user_id + "'";
    var con = mysql.getConnection();
    con.query(details, function(err, results) {
        if (results.length > 0) {
            res.send(results);
            console.log(results);
            res.end();
        } else {
            console.log("no details for the given id");
            res.send("no details for the given id");
        }
    }

    );
    con.end();
}
function start(req, res) {
    if (req.session.fname == undefined) {
        res.redirect("/");
    } else {
        ejs.renderFile('./views/home.ejs', function(err, result) {
            if (!err) {

                res.end(result);
            } else {
                res.end('An error occured');
                console.log(err);
            }

        });
    }
}
function update(req, res) {
    var query = "select * from person where ";
    ejs.renderFile('./views/update.ejs', function(err, result) {
        if (!err) {

            res.end(result);
        } else {
            res.end('An error occured');
            console.log(err);
        }

    });

}
function updateUserDetails(req, res) {
    var firstname = req.param("firstname");
    var lastname = req.param("lastname");
    var address = req.param("address");
    var password = req.param("pass");
    var city = req.param("city");
    var state = req.param("state");
    var zip = req.param("zip");
    var contact = req.param("contact");
    var query = "update person set firstname='" + firstname + "',lastname='"
            + lastname + "',address='" + address + "',city='" + city
            + "',state='" + state + "',zip='" + zip + "',contact='" + contact
            + "' where id='2'";
    var con = mysql.getConnection();
    con.query(query, function(err, results) {
        if (!err) {
            res.send("updated");
            console.log("updated");
            res.end();
        } else {
            res.send("not updated");
            console.log("not updated");
            res.end();
        }
    });
    con.end();

}
function searchProducts(req, res) {
    if (req.session.fname == undefined) {
        res.redirect("/");
    } else {

        var searchQuery = req.param("_nkw");
        var query = "select p.*,c.id as catId,c.name as catName from products p join category c on c.id = p.category_id where p.name REGEXP '"
                + searchQuery
                + "' OR details REGEXP '"
                + searchQuery
                + "' OR `condition` REGEXP '"
                + searchQuery
                + "' and p.isActive='1' and p.quantity>'0'";

        var con = mysql.getConnection();
        con.query(query, function(err, results) {
            if (!err) {
                // res.send(results);
                // for(var i=0; i<results.length;i++)
                // {
                // name[i]=results[i].name;
                // details[i]=results[i].details;
                // cost[i]=results[i].cost;
                // condition[i]=results[i].condition;
                // availableQuantity[i]=results[i].quantity;
                // image[i]=results[i].image;
                // catId[i]=results[i].catId;
                // catName[i]=results[i].catName;
                // productId[i]=results[i];
                // }
                ejs.renderFile('./views/sample.ejs', {
                    results : results,
                    searchName : searchQuery
                }, function(err, result) {
                    if (!err) {
                        res.end(result);
                    } else {
                        res.end("An error occured");
                        console.log(err);
                    }
                });
                res.end();
            } else {
                console.log(results);
                res.send("no results");
            }
        });
    }

}
function getCustomers(req, res) {

    if (req.session.fname == undefined) {
        res.redirect("/");
    } else {
        var firstname = [];
        var lastname = [];
        var email = [];
        var contact = [];
        var id = [];
        var isActive = [];
        var query = "select * from person where isBuyer=1";
        var con = mysql.getConnection();
        con.query(query, function(err, results) {
            if (results.length > 0) {
                /*
                 * for ( var i = 0; i < results.length; i++) { firstname[i] =
                 * results[i].firstname; lastname[i] = results[i].lastname;
                 * email[i] = results[i].email; contact[i] = results[i].contact;
                 * id[i] = results[i].id; isActive = results[i].isActive }
                 */
                ejs.renderFile('./views/users.ejs', {
                    results : results

                }, function(err, result) {
                    if (!err) {
                        res.end(result);
                    } else {
                        res.end("An error occured");
                        console.log(err);
                    }
                });

            } else {
                console.log(results);
                res.send("no results");
                res.end();

            }

        });
    }

}
function getSellers(req, res) {

    if (req.session.fname == undefined) {
        res.redirect("/");
    } else {
        var query = "select * from person where isSeller=1";
        var con = mysql.getConnection();
        con.query(query, function(err, results) {
            if (results.length > 0) {

                ejs.renderFile('./views/sellers.ejs', {
                    results : results
                }, function(err, result) {
                    if (!err) {
                        res.end(result);
                    } else {
                        res.end("An error occured");
                        console.log(err);
                    }
                });

            } else {
                console.log(results);
                res.send("no results");
                res.end();

            }

        });
    }

}
function searchUsers(req, res) {
    if (req.session.fname == undefined) {
        res.redirect("/");
    } else {
        var searchQuery = req.param("_nkw");
        var flag = req.param("flag");
        var query = "select * from person where firstname REGEXP '"
                + searchQuery + "' OR lastname REGEXP '" + searchQuery
                + "' OR email REGEXP '" + searchQuery + "'";
        var con = mysql.getConnection();
        con.query(query, function(err, results) {
            if (results.length > 0) {
                if (flag === "AllSellers") {
                    ejs.renderFile('./views/sellers.ejs', {
                        results : results
                    }, function(err, result) {
                        if (!err) {
                            res.end(result);
                        } else {
                            res.end("An error occured");
                            console.log(err);
                        }
                    });
                }
                if (flag === "AllCustomers") {
                    ejs.renderFile('./views/users.ejs', {
                        results : results
                    }, function(err, result) {
                        if (!err) {
                            res.end(result);
                        } else {
                            res.end("An error occured");
                            console.log(err);
                        }
                    });
                }
            } else {
                console.log(results);
                res.send("no results");
                res.end();
            }
        });
    }
}
function signout(req, res) {

    if (req.session.fname == undefined) {
        res.redirect("/");
    } else {
        req.flash('error', "Successfully Signed out...");
        ejs.renderFile('./views/login.ejs', {
            message : req.flash('error')
        }, function(err, result) {
            if (!err) {

                res.end(result);
            } else {
                res.end('An error occured');
                console.log(err);
            }
        });
        req.session.destroy();
    }

}
function searchPurchasedProducts(req, res) {
    if (req.session.fname == undefined) {
        res.redirect("/");
    } else {
        var searchQuery = req.param("_nkw");
        var flag = req.param("flag");
        var id = req.session.uid;

        var con = mysql.getConnection();
        con
                .query(
                        "    select p.id as purchase_id, pr.id as product_id, pr.name "
                                + " as product_name,pr.details as product_details, pr.image, s.id "
                                + " as seller_id, p.bid_amount, pr.min_bid, s.firstname as seller_name, p.bid_amount, "
                                + " p.submitted_on, p.rating "
                                + " from Purchase p JOIN Products pr ON p.product_id = pr.id JOIN person s "
                                + " ON s.id = pr.seller_id WHERE p.customer_id = ? AND p.sold=1 AND pr.name REGEXP '"
                                + searchQuery + "'", [ id ], function(err,
                                results) {
                            if (results.length > 0) {
                                res.render('Purchase-History', {
                                    page_title : "",
                                    dataVar : results
                                });
                            } else {
                                res.send("no matches");
                            }
                        });
    }

}
function searchBiddedProducts(req, res) {
    if (req.session.fname == undefined) {
        res.redirect("/");
    } else {

        var searchQuery = req.param("_nkw");
        var flag = req.param("flag");
        var id = req.session.uid;

        var con = mysql.getConnection();
        con
                .query(
                        "select p.id as purchase_id, pr.id as product_id, pr.name as product_name, pr.details as product_details, "
                                + " pr.image, s.id as seller_id,p.bid_amount, pr.min_bid, "
                                + " s.firstname as seller_name, s.membership_no as membership_no, p.bid_amount, p.submitted_on, p.rating "
                                + " from Purchase p JOIN Products pr"
                                + " ON p.product_id = pr.id "
                                + " JOIN person s ON s.id = pr.seller_id "
                                + " WHERE p.customer_id = ? AND pr.isForAuction = 1 AND pr.name REGEXP '"
                                + searchQuery + "'", [ id ], function(err,
                                results) {
                            if (results.length > 0) {
                                console.log("hi");
                                res.render('BiddingHistory', {
                                    page_title : "",
                                    dataVar : results
                                });
                            } else {
                                res.send("no matches");
                            }
                        });
    }

}
function searchSoldProducts(req, res) {
    if (req.session.fname == undefined) {
        res.redirect("/");
    } else {
        var searchQuery = req.param("_nkw");
        var flag = req.param("flag");
        var id = req.session.uid;

        var con = mysql.getConnection();
        con
                .query(
                        "select p.id as purchase_id, pr.id as product_id, pr.name as product_name, pr.details as product_details, "
                                + "pr.image as image, "
                                + " s.id as seller_id,p.bid_amount, pr.min_bid, s.firstname as seller_name, p.bid_amount as bid_amount, p.submitted_on, p.rating, "
                                + " c.firstname as customer_name, c.id as customer_id, p.quantity "
                                + " from Purchase p JOIN Products pr ON p.product_id = pr.id "
                                + " JOIN person s ON s.id = pr.seller_id JOIN  person c "
                                + " ON c.id = p.customer_id WHERE pr.seller_id = ? AND p.sold=1 AND pr.name REGEXP '"
                                + searchQuery + "'", [ id ], function(err,
                                results) {
                            if (results.length > 0) {
                                res.render('BiddingHistory', {
                                    page_title : "",
                                    dataVar : results
                                });
                            } else {
                                res.send("no matches");
                            }
                        });
    }
}
/*
 * function search(req,res) {
 * ejs.renderFile('./views/search.ejs',function(err,result) { if(!err){
 * 
 * res.end(result); } else { res.end('An error occured'); console.log(err); }
 * 
 * }); }
 */

exports.getUserDetails = getUserDetails;
exports.start = start;
exports.updateUserDetails = updateUserDetails;
exports.update = update;
exports.searchProducts = searchProducts;
exports.getCustomers = getCustomers;
exports.getSellers = getSellers;
exports.searchUsers = searchUsers;
exports.signout = signout;
exports.searchPurchasedProducts = searchPurchasedProducts;
exports.searchBiddedProducts = searchBiddedProducts;
exports.searchSoldProducts = searchSoldProducts;

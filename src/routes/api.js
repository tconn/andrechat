module.exports = function(app){

	var express = require('express');
	var router = express.Router();

    // middleware to use for all requests
	router.use(function(req, res, next){
		console.log("All routes hit here");
		next();
	});

	// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
	router.get('/', function(req, res) {
    	res.json({ message: 'hooray! welcome to our api!' });   
	});

	app.use('/api', router);
}
'use strict'

import http from 'http';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import initializeDb from './db';
import middleware from './middleware';
import api from './api';
import config from './config.json';
import basicAuth from 'basic-auth';

var auth = function (req, res, next) {
  function unauthorized(res) {
    res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
    return res.send(401);
  };

  var user = basicAuth(req);

  if (!user || !user.name || !user.pass) {
    return unauthorized(res);
  };

  if (user.name === 'foo' && user.pass === 'foobar') {
    return next();
  } else {
    return unauthorized(res);
  };
};

let app = express();
let apiai = require('apiai');
let apiaiapp = apiai("71ced92360244263978c1130878483fd");
 

app.server = http.createServer(app);
 
// 3rd party middleware
app.use(cors({
	exposedHeaders: config.corsHeaders
}));

app.use(bodyParser.json({
	limit : config.bodyLimit
}));

// connect to db
initializeDb( db => {

	// internal middleware
	app.use(middleware({ config, db }));

	// myblackrock router
	app.use('/myblackrock',auth, api({ config, db }));
	app.get('/myblackrock/:query', function (req, res) {
	  var request = apiaiapp.textRequest(req.params.query, {
    sessionId: '<asdfasdfasdfasdfunique session id>'
    });
    
   
    request.on('response', function(response) {
        console.log(response);
        res.json(response.result.parameters);
    });
     
    request.on('error', function(error) {
        console.log(error);
        res.json(error);
    }); 
    request.end();
  })
	console.log( "port is " + process.env.PORT);
	app.server.listen(process.env.PORT);

	console.log(`Started on port ${app.server.address().port}`);
});

export default app;

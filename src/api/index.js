import { version } from '../../package.json';
import { Router } from 'express';
import facets from './facets';
import low from 'lowdb';

var db = low('/home/ubuntu/workspace/db.json')
db.defaults({employees:[]}).value();

var users= db.get('employees').find({}).value();

export default ({ config, db }) => {
	let api = Router();

	// mount the facets resource
	api.use('/facets', facets({ config, db }));

api.get('/services/search/whoami', (req, res) => {
	console.log( "request for authentication")
	res.json({result:"Success"});
});

api.get('/api/v1/Person/basicchanges', (req, res) => {
	console.log("Hello")
	    let hello ="Hello World"
	    let ts=req.params.ts;
	    console.log("request for person data")
	    let sendjson = {response:{docs:null}};
	    sendjson.response.docs=users;
		res.json( sendjson);
	});
	// perhaps expose some API metadata at the root
	api.get('/', (req, res) => {
		res.json({ version });
	});

	return api;
}

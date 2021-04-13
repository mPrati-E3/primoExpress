'use strict' ;
const express = require('express');
const morgan = require('morgan'); // logging requests to console
const app = express();

app.use(morgan('dev'));

app.use(express.static('./public')); // map static requests to the ./public directory

app.use(express.json()); // decode JSON in request body

// Example processing of query parameters
// for URLs like http://localhost:3000/login?user=fulvio&pass=12345
app.get('/login', (req,res) => {
    const user = req.query.user || 'Unknown';
    const pass = req.query.pass || 'Unknown';

    res.send(`Login request received by ${user}, password=${pass}`);
});


// REST API SERVER

// Fake database...
const dogsList = [
    { id: 3, name: "Worf"},
    { id: 5, name: "Daisy"},
 ] ;

// GET /dogs
// Request body: None
// Response body: Array with numerical IDs of dogs -- ex. [3, 5]
app.get('/dogs', (req, res) => {
    console.log('here');
    res.json(dogsList.map((dog)=>(dog.id))) ;
}) ;

// GET /dogs/<dogId>
// Request body: None
// Response body: Object description of a dog. Ex: { id: 3, name: "Worf"}
// Errors: Dog ID not found
app.get('/dogs/:dogId', (req, res) => {
    const dogId = req.params.dogId ;
    const theDog = dogsList.filter((dog)=>(dog.id==dogId)) ;
    if(theDog.length==1) {
        res.json(theDog[0]) ; // return the Dog description
    } else {
        // return an error with a description object
        res.status(400).json({reason: "dog not found", dogId: dogId});
    }
});

// POST /dogs  -- creates a new Dog
// Request body: Object description of a dog. Ex: { id: 3, name: "Worf"}
// Response body: none
// Errors: id and/or name properties not found
app.post('/dogs', (req, res) => {
    const theDog = req.body ;
    console.log(theDog) ;
    if( theDog.id && theDog.name ) {
        dogsList.push({id: theDog.id, name:theDog.name}); // add to database
        res.end(); // close the POST request with an empty body
    } else {
        // the Json object doesn't have the expected properties
        res.status(400).json({reason: "insufficient information"});
    }
});

app.listen(3000, ()=>{ console.log('Application started');});
/*********************************************************************************
*  WEB422 – Assignment 1
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: Student ID: Date: Sep 16, 2022
*  Cyclic Link: 
********************************************************************************/ 

const express = require('express');
const app = express();
const HTTP_PORT= process.env.PORT || 8080;
var cors = require('cors')
app.use(cors())
require('dotenv').config()

app.use(express.json())
app.use("/static", express.static(__dirname+"/static"));

const MoviesDB = require("./modules/moviesDB.js");
const db = new MoviesDB();


app.get("/", (req, res) =>{
    const data = JSON.parse(JSON.stringify({ message: "API Listening" }));
    res.end(JSON.stringify({ message: "API Listening" }));
    console.log(data);
});


app.post('/api/movies', (req, res) =>{
    if (res.status(201))
    db.addNewMovie(req.body).then((data) => {
        res.json(data);
    }).catch((err) => {
        res.json(err);
    });
});

app.get("/api/movies/:id", (req, res) => {
    db.getMovieById(req.params.id).then((data) => {
        res.json(data);
    }).catch((err) => {
        res.json({ message: `${err}` });
    })
});

app.get("/api/movies", (req, res) => {
    db.getAllMovies(req.query.page, req.query.perPage, req.query.title).then((data) => {
        res.json(data);
    }).catch((err) => {
        res.json(err);
    });
})


app.delete("/api/movies/:id",(req,res) => {
    db.deleteMovieById(req.params.id).then((msg) => {
        res.json({message:msg});
    }).catch((err) => {
        res.json(err);
    })
})


app.put("/api/movies/:id", (req, res) => {
    db.updateMovieById(req.body, req.params.id).then((msg) => {
        res.json({message: msg});
    }).catch((err) => {
        res.json(err);
    });
});



db.initialize(process.env.MONGODB_CONN_STRING).then(()=>{
    app.listen(HTTP_PORT, ()=>{
        console.log(`server listening on: ${HTTP_PORT}`);
    });
}).catch((err)=>{
    console.log(err);
});


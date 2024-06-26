'use strict'

var express = require('express');
var bodyParser = require('body-parser');
const cors = require('cors');
var app = express();

// cargar rutas
var user_routes = require('./routes/user');
var artist_routes = require('./routes/artist');
var album_routes = require('./routes/album');
var song_routes = require('./routes/song');

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// Configurar CORS
app.use(cors({
    origin: 'http://localhost:4200', // Reemplaza con la URL de tu aplicación Angular
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-API-KEY']
  }));

// // configurar cabeceras http
// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
//     //res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested');
//     res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
//     res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
//     next();

// });

// rutas base

app.use('/api', user_routes);
app.use('/api', artist_routes);
app.use('/api', album_routes);
app.use('/api', song_routes);

module.exports = app;
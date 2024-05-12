'use strict'
var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3977;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://127.0.0.1:27017/granja', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', (err) => {
  console.error('Error al conectar a MongoDB:', err);
});

db.once('open', () => {
  console.log('La conexion a la base de datos esta funcionando correctamente...');
  app.listen(port, function(){
    console.log("Servidor del api rest de musica escuchando en http://localhost:"+port)
  });
});
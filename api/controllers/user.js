'use strict'
var fs = require('fs');
var path = require('path');
var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');
var jwt = require('../services/jwt');


function pruebas(req, res){
    res.status(200).send({
        message: 'Probando una acción del controlador de usuarios del api rest con Node y Mongo'
    });
}

function saveUser(req, res){
    var user = new User();
    var params = req.body;

    console.log(params);

    user.name = params.name;
    user.surname = params.surname;
    user.email = params.email;
    user.role = 'ROLE_ADMIN';
    user.image = 'null'

    if(params.password){
        //Encriptar contraseña
        bcrypt.hash(params.password, null, null, function(err, hash){
            user.password = hash;
            if(user.name != null && user.surname != null && user.email != null){
                //guarda el usuario
                user.save()
                    .then(userStored => {
                        if(!userStored){
                            res.status(404).send({message: 'No se ha registrado el usuario'});
                        }else{
                            res.status(200).send({user: userStored});
                        }
                    })
                    .catch(err => {
                        res.status(500).send({message: 'Error al guardar el usuario'});
                    });
            }else{
                res.status(200).send({message: 'Rellena todos los campos'});
            }
        });
    }else{
        res.status(200).send({message: 'Introduce la contraseña'});
    }
}


function loginUser(req, res) {
    var params = req.body;
    var email = params.email;
    var password = params.password;
  
    User.findOne({ email: email.toLowerCase() })
      .then(user => {
        if (!user) {
          res.status(404).send({ message: 'El usuario no existe' });
        } else {
          bcrypt.compare(password, user.password, function(err, check) {
            if (check) {
              // devolver los datos del usuario logueado
              if (params.gethash) {
                // devolver un token de jwt
                res.status(200).send({
                    token: jwt.createToken(user)
                });
              } else {
                res.status(200).send({ user });
              }
            } else {
              res.status(404).send({ message: 'El usuario no ha podido loguearse' });
            }
          });
        }
      })
      .catch(err => {
        res.status(500).send({ message: 'Error en la petición' });
      });
  }

function updateUser(req, res) {
    var userId = req.params.id;
    var update = req.body;

    User.findByIdAndUpdate(userId, update, { new: true })
        .then(userUpdated => {
            if (!userUpdated) {
                res.status(404).send({ message: 'No se ha podido actualizar el usuario' });
            } else {
                res.status(200).send({ user: userUpdated });
            }
        })
        .catch(err => {
            res.status(500).send({ message: 'Error al actualizar el usuario' });
        });
}

function uploadImage(req, res) {
    var userId = req.params.id;
    var file_name = 'No subio...';
    if (req.files) {
      const fileKeys = Object.keys(req.files);
      if (fileKeys.length > 0) {
        const file_path = req.files[fileKeys[0]].path;
        var file_split = file_path.split('\\');
        var file_name = file_split[2];
        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];
        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif') {
          User.findByIdAndUpdate(userId, { image: file_name }, { new: true })
            .then((userUpdated) => {
              if (!userUpdated) {
                res.status(404).send({ message: 'No se ha podido actualizar el usuario' });
              } else {
                res.status(200).send({ image: file_name, user: userUpdated });
              }
            })
            .catch((err) => {
              res.status(500).send({ message: 'Error al actualizar el usuario' });
            });
        } else {
          res.status(200).send({ message: 'Extension del archivo no valida' });
        }
      } else {
        res.status(200).send({ message: 'No has subido ninguna imagen...' });
        return;
      }
    }
  }


function getImageFile(req, res){
    var imageFile = req.params.imageFile;
    var path_file = './uploads/users/'+imageFile;
    fs.exists(path_file, function(exists){
        if(exists){
            res.sendFile(path.resolve(path_file));
        }else{
            res.status(200).send({message: 'No existe la imagen'});
        }
    });
}

module.exports = {
    pruebas,
    saveUser,
    loginUser,
    updateUser,
    uploadImage,
    getImageFile
};
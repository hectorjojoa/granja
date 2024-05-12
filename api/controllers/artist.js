'use strict'
var path = require('path');
var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination')
var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');
const artist = require('../models/artist');



function getArtist(req, res) {
    const artistId = req.params.id;
  
    Artist.findById(artistId)
      .then((artist) => {
        if (!artist) {
          return res.status(404).send({ message: 'El artista no existe' });
        }
        res.status(200).send({ artist });
      })
      .catch((err) => {
        res.status(500).send({ message: 'Error en la petición.' });
      });
}

async function getArtists(req, res) {
  try {
    let page = req.params.page ? req.params.page : 1;
    const itemsPerPage = 3;

    const artists = await Artist.find()
      .sort('name')
      .skip((page - 1) * itemsPerPage)
      .limit(itemsPerPage);

    const totalArtists = await Artist.countDocuments();

    if (artists.length === 0) {
      return res.status(404).send({ message: 'No hay artistas.' });
    }

    const totalPages = Math.ceil(totalArtists / itemsPerPage);

    return res.status(200).send({
      total_items: totalPages,
      artists: artists
    });
  } catch (error) {
    return res.status(500).send({ message: 'Error en la petición.' });
  }
}

function saveArtist(req, res) {
    const artist = new Artist();
    const params = req.body;
  
    artist.name = params.name;
    artist.description = params.description;
    artist.image = 'null';
  
    artist.save()
      .then((artistStored) => {
        if (!artistStored) {
          res.status(404).send({ message: 'El artista no ha sido guardado' });
        } else {
          res.status(200).send({ artist: artistStored });
        }
      })
      .catch((err) => {
        res.status(500).send({ message: 'Error al guardar el artista' });
      });
}

async function updateArtist(req, res) {
   try {
     const artistId = req.params.id;
     const update = req.body;
       const artistUpdated = await Artist.findByIdAndUpdate(artistId, update, { new: true });
       if (!artistUpdated) {
       return res.status(404).send({ message: 'El artista no ha sido actualizado' });
     }
       return res.status(200).send({ artist: artistUpdated });
   } catch (error) {
     return res.status(500).send({ message: 'Error al guardar el artista' });
   }
}

async function deleteArtist(req, res) {
  try {
    const artistId = req.params.id;

    const artistRemoved = await Artist.findByIdAndDelete(artistId);

    if (!artistRemoved) {
      return res.status(404).send({ message: 'El artista no ha sido eliminado' });
    }

    const albumRemoved = await Album.deleteMany({ artist: artistRemoved._id });

    if (!albumRemoved) {
      return res.status(404).send({ message: 'El album no ha sido eliminado' });
    }

    const songRemoved = await Song.deleteMany({ album: albumRemoved._id });

    if (!songRemoved) {
      return res.status(404).send({ message: 'La canción no ha sido eliminada' });
    }

    return res.status(200).send({ artist: artistRemoved });
  } catch (error) {
    return res.status(500).send({ message: 'Error al eliminar el artista' });
  }
}

function uploadImage(req, res) {
  var artistId = req.params.id;
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
        Artist.findByIdAndUpdate(artistId, { image: file_name }, { new: true })
          .then((artistUpdated) => {
            if (!artistId) {
              res.status(404).send({ message: 'No se ha podido actualizar el usuario' });
            } else {
              res.status(200).send({ artist: artistUpdated });
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
  var path_file = './uploads/artists/'+imageFile;
  fs.exists(path_file, function(exists){
      if(exists){
          res.sendFile(path.resolve(path_file));
      }else{
          res.status(200).send({message: 'No existe la imagen'});
      }
  });
}


module.exports = {
    getArtist,
    saveArtist,
    getArtists,
    updateArtist,
    deleteArtist,
    uploadImage,
    getImageFile
};
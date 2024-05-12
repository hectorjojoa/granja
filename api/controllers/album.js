'use strict'
var path = require('path');
var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination')
var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');
const artist = require('../models/artist');


async function getAlbum(req, res) {
    try {
        const albumId = req.params.id;

        const album = await Album.findById(albumId).populate({ path: 'artist' }).exec();

        if (!album) {
            res.status(200).send({ message: 'El album no existe' });
        } else {
            res.status(200).send({ album });
        }
    } catch (error) {
        res.status(500).send({ message: 'Error en la petición' });
    }
}

async function getAlbums(req, res) {
    try {
        const artistId = req.params.artist;

        let find;
        if (!artistId) {
            // Sacar todos los albums de la bbdd
            find = Album.find({}).sort('title');
        } else {
            // Sacar los albums de un artista concreto de la bbdd
            find = Album.find({ artist: artistId }).sort('year');
        }

        const albums = await find.populate({ path: 'artist' }).exec();

        if (!albums || albums.length === 0) {
            res.status(404).send({ message: 'No hay albums' });
        } else {
            res.status(200).send({ albums });
        }
    } catch (error) {
        res.status(500).send({ message: 'Error en la petición' });
    }
}

async function saveAlbum(req, res) {
    try {
        const album = new Album();
        const params = req.body;

        album.title = params.title;
        album.description = params.description;
        album.year = params.year;
        album.image = 'null';
        album.artist = params.artist;

        const albumStored = await album.save();

        if (!albumStored) {
            res.status(404).send({ message: 'No se ha guardado el album' });
        } else {
            res.status(200).send({ album: albumStored });
        }
    } catch (error) {
        res.status(500).send({ message: 'Error en el servidor' });
    }
}

async function updateAlbum(req, res) {
    try {
        const albumId = req.params.id;
        const update = req.body;

        const albumUpdated = await Album.findByIdAndUpdate(albumId, update, { new: true });

        if (!albumUpdated) {
            res.status(404).send({ message: 'No se ha actualizado el album' });
        } else {
            res.status(200).send({ album: albumUpdated });
        }
    } catch (error) {
        res.status(500).send({ message: 'Error en el servidor' });
    }
}

async function deleteAlbum(req, res) {
    try {
        const albumId = req.params.id;

        const albumRemoved = await Album.findOneAndDelete({ _id: albumId });

        if (!albumRemoved) {
            res.status(404).send({ message: 'El album no ha sido encontrado' });
            return;
        }

        const songRemoved = await Song.deleteMany({ album: albumRemoved._id });

        if (songRemoved.deletedCount === 0) {
            res.status(404).send({ message: 'Las canciones no han sido eliminadas' });
            return;
        }

        res.status(200).send({ album: albumRemoved });
    } catch (error) {
        res.status(500).send({ message: 'Error al eliminar el album' });
    }
}

function uploadImage(req, res) {
    const albumId = req.params.id;
    let file_name = 'No subio...';
  
    if (req.files) {
      const fileKeys = Object.keys(req.files);
      if (fileKeys.length > 0) {
        const file_path = req.files[fileKeys[0]].path;
        const file_split = file_path.split('\\');
        file_name = file_split[2];
  
        const ext_split = file_name.split('\.');
        const file_ext = ext_split[1];
  
        if (file_ext === 'png' || file_ext === 'jpg' || file_ext === 'gif') {
          Album.findByIdAndUpdate(albumId, { image: file_name }, { new: true })
            .then((albumUpdated) => {
              if (!albumUpdated) {
                res.status(404).send({ message: 'No se ha podido actualizar el Album' });
              } else {
                res.status(200).send({ album: albumUpdated });
              }
            })
            .catch((err) => {
              res.status(500).send({ message: 'Error al actualizar el Album' });
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
    var path_file = './uploads/albums/'+imageFile;
    fs.exists(path_file, function(exists){
        if(exists){
            res.sendFile(path.resolve(path_file));
        }else{
            res.status(200).send({message: 'No existe la imagen'});
        }
    });
  }


module.exports = {
    getAlbum,
    saveAlbum,
    getAlbums,
    updateAlbum,
    deleteAlbum,
    uploadImage,
    getImageFile
}
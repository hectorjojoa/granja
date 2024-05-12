'use strict'
var path = require('path');
var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination')
var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');
const artist = require('../models/artist');

async function getSong(req, res) {
    try {
        const songId = req.params.id;

        const song = await Song.findById(songId).populate({ path: 'album' }).exec();

        if (!song) {
            return res.status(404).send({ message: 'La canción no existe' });
        } else {
            return res.status(200).send({ song });
        }
    } catch (error) {
        console.error('Error en la petición:', error);
        return res.status(500).send({ message: 'Error en la petición' });
    }
}

async function getSongs(req, res) {
    try {
        const albumId = req.params.album;

        let find;
        if (!albumId) {
            find = Song.find({}).sort('number');
        } else {
            find = Song.find({ album: albumId }).sort('number');
        }

        const songs = await find.populate({
            path: 'album',
            populate: {
                path: 'artist',
                model: 'Artist'
            }
        }).exec();

        if (!songs || songs.length === 0) {
            return res.status(404).send({ message: 'No hay canciones' });
        } else {
            return res.status(200).send({ songs });
        }
    } catch (error) {
        console.error('Error en la petición:', error);
        return res.status(500).send({ message: 'Error en la petición' });
    }
}

async function saveSong(req, res) {
    try {
        const song = new Song();

        const params = req.body;
        song.number = params.number;
        song.name = params.name;
        song.duration = params.duration;
        song.file = null;
        song.album = params.album;

        const songStored = await song.save();

        if (!songStored) {
            return res.status(404).send({ message: 'No se ha guardado la canción' });
        } else {
            return res.status(200).send({ song: songStored });
        }
    } catch (error) {
        console.error('Error en el servidor:', error);
        return res.status(500).send({ message: 'Error en el servidor' });
    }
}

async function updateSong(req, res) {
    try {
        const songId = req.params.id;
        const update = req.body;

        const songUpdated = await Song.findByIdAndUpdate(songId, update, { new: true });

        if (!songUpdated) {
            return res.status(404).send({ message: 'No se ha actualizado la canción' });
        } else {
            return res.status(200).send({ song: songUpdated });
        }
    } catch (error) {
        console.error('Error en el servidor:', error);
        return res.status(500).send({ message: 'Error en el servidor' });
    }
}

async function deleteSong(req, res) {
    try {
        const songId = req.params.id;

        const songRemoved = await Song.findByIdAndDelete(songId);

        if (!songRemoved) {
            return res.status(404).send({ message: 'No se ha borrado la canción' });
        } else {
            return res.status(200).send({ song: songRemoved });
        }
    } catch (error) {
        console.error('Error en el servidor:', error);
        return res.status(500).send({ message: 'Error en el servidor' });
    }
}

function uploadFile(req, res) {
    const songId = req.params.id;
    let file_name = 'No subio...';
  
    if (req.files) {
      const fileKeys = Object.keys(req.files);
      if (fileKeys.length > 0) {
        const file_path = req.files[fileKeys[0]].path;
        const file_split = file_path.split('\\');
        file_name = file_split[2];
  
        const ext_split = file_name.split('\.');
        const file_ext = ext_split[1];
  
        if (file_ext === 'mp3' || file_ext === 'ogg') {
          Song.findByIdAndUpdate(songId, { file: file_name }, { new: true })
            .then((songUpdated) => {
              if (!songUpdated) {
                res.status(404).send({ message: 'No se ha podido actualizar la cancion' });
              } else {
                res.status(200).send({ song: songUpdated });
              }
            })
            .catch((err) => {
              res.status(500).send({ message: 'Error al actualizar la cancion' });
            });
        } else {
          res.status(200).send({ message: 'Extension del archivo no valida' });
        }
      } else {
        res.status(200).send({ message: 'No has subido el fichero de audio ...' });
        return;
      }
    }
  }

function getSongFile(req, res){
    var imageFile = req.params.songFile;
    var path_file = './uploads/songs/'+imageFile;
    fs.exists(path_file, function(exists){
        if(exists){
            res.sendFile(path.resolve(path_file));
        }else{
            res.status(200).send({message: 'No existe el fichero de audio'});
        }
    });
  }


module.exports = {
    getSong,
    getSongs,
    saveSong,
    updateSong,
    deleteSong,
    uploadFile,
    getSongFile
};
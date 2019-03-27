const express = require('express');
const bodyParser = require('body-parser');
const Playlist = require('./models/playlist');
const Artist = require('./models/artist');
const Track = require('./models/track');
const Album = require('./models/album');
const Sequelize = require('sequelize');

const {Op} = Sequelize;
const app = express();
app.use(bodyParser.json());
Artist.hasMany(Album, {
  foreignKey:'ArtistId'
});

Album.belongsTo(Artist, {
  foreignKey:'ArtistId'
});

Playlist.belongsToMany(Track, {
  through: 'playlist_track',
  foreignKey: 'PlaylistId',
  timestamps:false
});

Track.belongsToMany(Playlist, {
  through: 'playlist_track',
  foreignKey: 'TrackId',
  timestamps:false
});

app.post('/api/artists', function(request, response){
  Artist.create({
    name: request.body.name
  }).then((artist)=>{
    response.json(artist);
  }, (validation) => {
    response.status(422).json({
      errors: validation.errors.map((error) => {
        return {
          attribute: error.path,
          message: error.message
        }
      })
    });
  });
});

app.patch('/api/tracks/:id', (request, result) => {
    let id = request.params.id;
    Track.findByPk(id).then((track) => {
        if(track) {
            track.update({
                name: request.body.name,
                milliseconds: request.body.milliseconds,
                unitPrice: request.body.unitPrice
            }).then(() => {
                result.status(200).json(track);
            }).catch((validation) => {
                result.status(422).json({
                    errors: validation.errors.map((error) => {
                        return {
                            attribute: error.path,
                            message: error.message
                        };
                    })
                });
            });
        } else {
            res.status(404).send();
        }
    })
});


app.get('/api/playlists', function(request, response){
  let filter = {};
  let { q }= request.query;
  if (q){
    filter = {
      where:{
        name: {
          [Op.like]: `${q}%`
        }
      }
    };
  }
  Playlist.findAll(filter).then((playlists)=>{
    response.json(playlists);
  });
});

app.get('/api/playlists/:id', function(request, response){
  let { id } = request.params;
  Playlist.findByPk(id,{
  include:[Track]
}).then((playlist)=>{
    if(playlist){
      response.json(playlist);
    } else {
      response.status(404).send();
    }
  });
});

app.get('/api/tracks/:id', function(request, response){
  let { id } = request.params;
  Track.findByPk(id,{
  include:[Playlist]
}).then((track)=>{
    if(track){
      response.json(track);
    } else {
      response.status(404).send();
    }
  });
});

app.get('/api/artist/:id', function(request, response){
  let { id } = request.params;
  Artist.findByPk(id, {
    include:[Album]
  }).then((artist)=>{
    if(artist){
      response.json(artist);
    } else {
      response.status(404).send();
    }
  });
});
app.get('/api/albums/:id', function(request, response){
  let { id } = request.params;
  Album.findByPk(id, {
    include:[Artist]
  }).then((album)=>{
    if(album){
      response.json(album);
    } else {
      response.status(404).send();
    }
  });
});

app.listen(process.env.PORT || 8000);

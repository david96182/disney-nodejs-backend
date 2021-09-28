const { response, query } = require("express");
const { subirArchivo } = require("../helpers/subir-archivo");
const { Character } = require("../models/character");
const path = require('path')
const fs = require('fs');
const { Movie } = require("../models/movies");

// PUT CHARACTER IMG
const setCharacterPic = async (req, res) => {

  const { id } = req.params
  char = await Character.findOne({ where: { uuid: id } });
  if (!char) {
    return res.status(400).json({
        msg: `There's no character with id ${id}`,
    });
  }

  if( char.img ){
    //
    const pathImagen = path.join(__dirname, '../uploads', 'characters', char.img)
    if(fs.existsSync( pathImagen )){
        fs.unlinkSync( pathImagen )
    }
}

const nombre = await subirArchivo( req.files, ['jpg','jpeg','png','ico','gif'], 'characters' )

respupd = await Character.update({ img: nombre }, {
    where: {
      uuid: id
}})
if( !respupd ){
    return res.status(400).json({
        msg: `There's no character with id ${id}`
    })
}

res.json(await Character.findOne({
    where: {
      uuid: id
}}))
};

//GET CHARACTER IMG
const getCharImg = async (req, res) => {

  const { id } = req.params
  char = await Character.findOne({ where: { uuid: id } });
  if (!char) {
    return res.status(400).json({
        msg: `There's no character with id ${id}`,
    });
  }
  if( char.img ){
    //Hay q borrar la imagen del servidor 
    const pathImagen = path.join(__dirname, '../uploads', 'characters', char.img)
    if( fs.existsSync( pathImagen ) ){
        return res.sendFile( pathImagen )
    }
}
    const pathimg = path.join(__dirname,'../assets','13.1 no-image.jpg')
    return res.sendFile(pathimg)
}

//GET ALL CHARACTERS
const getCharacters = async (req, res) => {
  const { name, age, movie, weigth } = req.query;
  
  if (name == null && age == null && weigth == null && movie == null) {
    return Character.findAll({
      attributes: ["uuid", "name", "img"]
    })
      .then((characters) =>
        res.json({
          characters,
        })
      )
      .catch((err) => res.render("error", { error: err }));
  } else {
      if(name){
        
        return Character.findOne({
            where: {name: name},
            attributes: ["uuid", "name", "img"]
        })
        .then((character) => {
          if(character){
          res.json({
          character
        })}
        else{
            res.json({msg: `There's no character ${name}`})
        }
    }
      )
      .catch((err) => res.render("error", { error: err }));
          
    }

    if(age){
        
        return Character.findAll({
            where: {age: age},
            attributes: ["uuid", "name", "img"]
        })
        .then((characters) => {
          if(characters.length > 0){
          res.json({
          characters
        })}
        else{
            res.json({msg: `There are no characters with age ${age}`})
        }
    }
      )
      .catch((err) => res.render("error", { error: err }));
          
    }

    if(weigth){
        
        return Character.findAll({
            where: {weigth: weigth},
            attributes: ["uuid", "name", "img"]
        })
        .then((characters) => {
          if(characters.length > 0){
          res.json({
          characters
        })}
        else{
            res.json({msg: `There are no characters with weigth ${weigth}`})
        }
    }
      )
      .catch((err) => res.render("error", { error: err }));
          
    }

    if(movie){
        
      let mov = await Movie.findOne({
          where: {title: movie},
          attributes: ["uuid", "title", "img"]
      })
      if(!mov){
        return res.json({msg: `There's no movie with title ${movie}`})
      }

      let charactersbymovie = []
      Character.findAll({
        attributes: ["uuid", "name", "img", "movies"]
    })
    .then((characters) => {
      characters.forEach(e => {
        if(e.movies.includes(mov.uuid)){
          charactersbymovie.push(e)
        }
})
    return res.json(
      charactersbymovie
)
})
    
    

    }
  }
}

//GET CHARACTER
const getCharacter = async (req, res) => {
    const { id } = req.params
    const chara = await Character.findOne(
        {
            where: {uuid: id},
            attributes: ["name", "img", "age", "weigth", "story", "movies"]
        })
    if (!chara) {
            return res.status(400).json({
                msg: `There's no character with id ${id}`,
            });
          }
    res.json(chara)
};

//POST CHARACTER
const postCharacter = async (req, res = response) => {
  const { name, age, weigth, story, movies } = req.body;

  let moviesSTR = ''
  movies.forEach(e => {
  moviesSTR = moviesSTR + ',' + e
  });
  moviesSTR = moviesSTR.slice(1)
  // save in db
  const charac = await Character.create({
    name: name,
    age: age,
    weigth: weigth,
    story: story,
    movies: moviesSTR,
  });

  res.status(201).json(charac);
};

//UPDATE CHARACTER
const updateCharacter = async (req, res) => {
    const { id } = req.params
    const { _,age,weigth,story,movies } = req.body

    const chara = await Character.findOne(
        {where: {uuid: id}})
    if (!chara) {
        return res.status(400).json({
            msg: `There's no character with id ${id}`,
        });}

    if(age){
        chara.age = age
    }
    if(weigth){
        chara.weigth = weigth
    }
    if(story){
        chara.story = story
    }
    if(movies){
        if(movies.length != 0){
          let moviesSTR = ''
          movies.forEach(e => {
          moviesSTR = moviesSTR + ',' + e
          });
          moviesSTR = moviesSTR.slice(1)

          chara.movies = moviesSTR
         }
    }
    
    await chara.save()

    res.json(chara)
};

//DELETE CHARACTER
const deleteCharacter = async (req, res) => {
    const { id } = req.params
    const char = await Character.findOne({where: {uuid: id}})
    if (!char) {
        return res.status(400).json({
            msg: `There's no character with id ${id}`,
    });}

    char.destroy()

    res.json({ msg: 'Character deleted' })
};

module.exports = {
  postCharacter,
  getCharacters,
  setCharacterPic,
  getCharImg,
  getCharacter,
  updateCharacter,
  deleteCharacter
};

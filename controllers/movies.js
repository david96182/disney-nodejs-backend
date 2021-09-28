const { response, query } = require("express");
const { subirArchivo } = require("../helpers/subir-archivo");
const { Movie } = require("../models/movies");
const path = require('path')
const fs = require('fs');
const { Gender } = require("../models/gender");
const { Character } = require("../models/character");

// PUT MOVIE IMG
const setMoviePic = async (req, res) => {

  const { id } = req.params
  mov = await Movie.findOne({ where: { uuid: id } });
  if (!mov) {
    return res.status(400).json({
        msg: `There's no movie with id ${id}`,
    });
  }

  if( mov.img ){
    //
    const pathImagen = path.join(__dirname, '../uploads', 'movies', mov.img)
    if(fs.existsSync( pathImagen )){
        fs.unlinkSync( pathImagen )
    }
}

const nombre = await subirArchivo( req.files, ['jpg','jpeg','png','ico','gif'], 'movies' )

respupd = await Movie.update({ img: nombre }, {
    where: {
      uuid: id
}})
if( !respupd ){
    return res.status(400).json({
        msg: `There's no movie with id ${id}`
    })
}

res.json(await Movie.findOne({
    where: {
      uuid: id
}}))
};

//GET MOVIE IMG
const getMovieImg = async (req, res) => {

  const { id } = req.params
  mov = await Movie.findOne({ where: { uuid: id } });
  if (!mov) {
    return res.status(400).json({
        msg: `There's no movie with id ${id}`,
    });
  }
  if( mov.img ){
    //Hay q borrar la imagen del servidor 
    const pathImagen = path.join(__dirname, '../uploads', 'movies', mov.img)
    if( fs.existsSync( pathImagen ) ){
        return res.sendFile( pathImagen )
    }
}
    const pathimg = path.join(__dirname,'../assets','13.1 no-image.jpg')
    return res.sendFile(pathimg)
}

//GET ALL MOVIES
const getMovies = async (req, res) => {
  const { title, gender } = req.query;
  
  if (title == null && gender == null) {
    return await Movie.findAll({
      attributes: ["uuid", "title", "img", "date"]
    })
      .then((movies) =>
        res.json({
          movies,
        })
      )
      .catch((err) => res.render("error", { error: err }));
  } else {
      if(title){
        
        return await Movie.findOne({
            where: {title: title},
            attributes: ["uuid", "title", "img", "date"]
        })
        .then((movie) => {
          if(movie){
          res.json({
          movie
        })}
        else{
            res.json({msg: `There's no movie ${title}`})
        }
    }
      )
      .catch((err) => res.render("error", { error: err }));
          
    }

    if(gender){
        let moviebygender = []
        const gen = await Gender.findOne({
            where: {name: gender},
            attributes: ["uuid", "name", "img", "movies"]
        })
        if(!gen){
          return res.json({msg: `There's no gender with name ${gender}`})
        }
        let moviesid = gen.movies
        for (mo of moviesid ) {
          await Movie.findOne({where: {uuid: mo}, 
            attributes: ["uuid", "title", "img", "date"]})
            .then( (mo) => {
              moviebygender.push(mo)
            })
        }
        
        

        return res.json(moviebygender)
    }

  }

};


//GET MOVIE
const getMovie = async (req, res) => {
    const { id } = req.params
    const mov = await Movie.findOne(
        {
            where: {uuid: id},
            attributes: ["title", "img", "date", "rate", "characters"]
        })
    if (!mov) {
            return res.status(400).json({
                msg: `There's no movie with id ${id}`,
            });
          }
    res.json(mov)
};

//POST MOVIE
const postMovie = async (req, res = response) => {
  const { title, date, type, rate, characters } = req.body;

  let charsSTR = ''
  characters.forEach(e => {
  charsSTR = charsSTR + ',' + e
  });
  charsSTR = charsSTR.slice(1)
  // save in db
  const mov = await Movie.create({
    title: title,
    date: date,
    type: type,
    rate: rate,
    characters: charsSTR,
  });

  res.status(201).json(mov);
};

//UPDATE MOVIE
const updateMovie = async (req, res) => {
    const { id } = req.params
    const { _,title,date,type,rate,characters } = req.body

    const mov = await Movie.findOne(
        {where: {uuid: id}})
    if (!mov) {
        return res.status(400).json({
            msg: `There's no movie with id ${id}`,
        });}

    if(title){
        mov.title = title
    }
    if(date){
        mov.date = date
    }
    if(type){
        mov.rate = rate
    }
    if(characters){
        if(characters.length != 0){
          let charSTR = ''
          characters.forEach(e => {
          charSTR = charSTR + ',' + e
          });
          charSTR = charSTR.slice(1)

          mov.characters = charSTR
         }
    }
    
    await mov.save()

    res.json(mov)
};

//DELETE MOVIE
const deleteMovie = async (req, res) => {
    const { id } = req.params
    const mov = await Movie.findOne({where: {uuid: id}})
    if (!mov) {
        return res.status(400).json({
            msg: `There's no movie with id ${id}`,
    });}

    mov.destroy()

    res.json({ msg: 'Movie deleted' })
};

module.exports = {
  postMovie,
  getMovies,
  setMoviePic,
  getMovieImg,
  getMovie,
  updateMovie,
  deleteMovie
};

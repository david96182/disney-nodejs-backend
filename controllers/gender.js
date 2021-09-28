const { response } = require("express");
const { subirArchivo } = require("../helpers/subir-archivo");
const { Gender } = require("../models/gender");
const path = require('path')
const fs = require('fs')

// PUT GENDER IMG
const setGenderPic = async (req, res) => {

  const { id } = req.params
  gen = await Gender.findOne({ where: { uuid: id } });
  if (!gen) {
    return res.status(400).json({
        msg: `There's no gender with id ${id}`,
    });
  }

  if( gen.img ){
    //
    const pathImagen = path.join(__dirname, '../uploads', 'genders', gen.img)
    if(fs.existsSync( pathImagen )){
        fs.unlinkSync( pathImagen )
    }
}

const nombre = await subirArchivo( req.files, ['jpg','jpeg','png','ico','gif'], 'genders' )

respupd = await Gender.update({ img: nombre }, {
    where: {
      uuid: id
}})
if( !respupd ){
    return res.status(400).json({
        msg: `There's no gender with id ${id}`
    })
}

res.json(await Gender.findOne({
    where: {
      uuid: id
}}))
};

//GET GENDER IMG
const getGenImg = async (req, res) => {

  const { id } = req.params
  gen = await Gender.findOne({ where: { uuid: id } });
  if (!gen) {
    return res.status(400).json({
        msg: `Theres no gender ${id}`,
    });
  }
  if( gen.img ){
    //Hay q borrar la imagen del servidor 
    const pathImagen = path.join(__dirname, '../uploads', 'genders', gen.img)
    if( fs.existsSync( pathImagen ) ){
        return res.sendFile( pathImagen )
    }
}
    const pathimg = path.join(__dirname,'../assets','13.1 no-image.jpg')
    return res.sendFile(pathimg)
}

//GET ALL GENDERS
const getGenders = async (req, res) => {
  
  
    return Gender.findAll({
      attributes: ["uuid", "name", "img", "movies"]
    })
      .then((genders) =>
        res.json({
          genders
        })
      )
      .catch((err) => res.render("error", { error: err }));
  
};

//GET GENDER
const getGender = async (req, res) => {
    const { id } = req.params
    const gen = await Gender.findOne(
        {
            where: {uuid: id},
            attributes: ["name", "img", "movies"]
        })

    if (!gen) {
            return res.status(400).json({
                msg: `There's no gender with id ${id}`,
            });
          }
    res.json(gen)
};

//POST GENDER
const postGender = async (req, res = response) => {
  const { name, movies } = req.body;

  let moviesSTR = ''
  movies.forEach(e => {
  moviesSTR = moviesSTR + ',' + e
  });
  moviesSTR = moviesSTR.slice(1)
  
  // save in db
  const gen = await Gender.create({
    name: name,
    movies: moviesSTR
  });

  res.status(201).json(gen);
};

//UPDATE GENDER
const updateGender = async (req, res) => {
    const { id } = req.params
    const { name,movies } = req.body

    

    const gen = await Gender.findOne(
        {where: {uuid: id}})
    if (!gen) {
        return res.status(400).json({
            msg: `There's no gender with id ${id}`,
        });}

    if(movies){
        if(movies.length != 0){
            let moviesSTR = ''
            movies.forEach(e => {
            moviesSTR = moviesSTR + ',' + e
            });
            moviesSTR = moviesSTR.slice(1)
            
            gen.movies = moviesSTR
         }
    }
    
    await gen.save()
    
    res.json(gen)
};

//DELETE GENDER
const deleteGender = async (req, res) => {
    const { id } = req.params
    const gen = await Gender.findOne({where: {uuid: id}})
    if (!gen) {
        return res.status(400).json({
            msg: `There's no gender with id ${id}`,
    });}

    gen.destroy()

    res.json({ msg: 'Gender deleted' })
};

module.exports = {
    setGenderPic,
    getGenImg,
    getGenders,
    getGender,
    postGender,
    updateGender,
    deleteGender
};

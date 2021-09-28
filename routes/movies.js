const { Router } = require('express')
const { check } = require('express-validator')
const { setMoviePic, 
        getMovieImg, 
        getMovies, 
        getMovie, 
        postMovie, 
        updateMovie, 
        deleteMovie } = require('../controllers/movies')
const { existMovie, isValidType } = require('../helpers/db-validators')
const { validateFields } = require('../middlewares/validate-fields')
const { validateFileUpload } = require('../middlewares/validate-file')
const { validateJWT } = require('../middlewares/validate-jwt')


const router = Router()

router.get('/',getMovies)

router.get('/img/:id',getMovieImg)

router.get('/:id',getMovie)

router.post('/',[
    validateJWT,
    check('title','Null not allowed').not().isEmpty(),
    check('title').custom(existMovie),
    check('type').custom(isValidType),
    check('date','Null not allowed').not().isEmpty(),
    check('rate','Must be interger').isInt(),
    validateFields
],postMovie)

router.put('/:id',[
    validateJWT,
    validateFields
],updateMovie)

router.put('/img/:id',[
    validateJWT,
    validateFileUpload,
    validateFields
],setMoviePic)

router.delete('/:id',[
    validateJWT,
    validateFields
],deleteMovie)




module.exports = router
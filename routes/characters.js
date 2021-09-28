const { Router } = require('express')
const { check } = require('express-validator')
const { postCharacter, getCharacters, setCharacterPic, getCharImg, getCharacter, updateCharacter, deleteCharacter } = require('../controllers/characters')
const { existCharacter } = require('../helpers/db-validators')
const { validateFields } = require('../middlewares/validate-fields')
const { validateFileUpload } = require('../middlewares/validate-file')
const { validateJWT } = require('../middlewares/validate-jwt')


const router = Router()

router.get('/',getCharacters)

router.get('/img/:id',getCharImg)

router.get('/:id',getCharacter)

router.post('/',[
    validateJWT,
    check('name','Null not allowed').not().isEmpty(),
    check('name').custom(existCharacter),
    check('age','Null not allowed').not().isEmpty(),
    check('age','Must be interger').isInt(),
    check('weigth','Null not allowed').not().isEmpty(),
    check('story','Null not allowed').not().isEmpty(),
    validateFields
],postCharacter)

router.put('/:id',[
    validateJWT,
    validateFields
],updateCharacter)

router.put('/img/:id',[
    validateJWT,
    validateFileUpload,
    validateFields
],setCharacterPic)

router.delete('/:id',[
    validateJWT,
    validateFields
],deleteCharacter)




module.exports = router
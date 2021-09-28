const { Router } = require('express')
const { check } = require('express-validator')
const { getGenImg, setGenderPic, getGenders, getGender, postGender, updateGender, deleteGender } = require('../controllers/gender')
const { existGender } = require('../helpers/db-validators')
const { validateFields } = require('../middlewares/validate-fields')
const { validateFileUpload } = require('../middlewares/validate-file')
const { validateJWT } = require('../middlewares/validate-jwt')


const router = Router()

router.get('/',getGenders)

router.get('/img/:id',getGenImg)

router.get('/:id',getGender)

router.post('/',[
    validateJWT,
    check('name','Null not allowed').not().isEmpty(),
    check('name').custom(existGender),
    validateFields
],postGender)

router.put('/:id',[
    validateJWT,
    validateFields
],updateGender)

router.put('/img/:id',[
    validateJWT,
    validateFileUpload,
    validateFields
],setGenderPic)

router.delete('/:id',[
    validateJWT,
    validateFields
],deleteGender)




module.exports = router
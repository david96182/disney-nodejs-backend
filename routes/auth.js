const { Router } = require('express')
const { check } = require('express-validator')
const { login,register } = require('../controllers/auth')
const { validateFields } = require('../middlewares/validate-fields')

const router = Router()

router.post('/register',[
    check('name','Null not allowed').not().isEmpty(),
    check('email','Email is required').isEmail(),
    check('password','Password is required').not().isEmpty(),
    validateFields
],register)


router.post('/login',[
    check('email', 'Email is required').isEmail(),
    check('password','Password is required').not().isEmpty(),
    validateFields
], login) 





module.exports = router
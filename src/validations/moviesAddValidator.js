const {check, body} = require('express-validator')

module.exports = [
    check('title')
    .notEmpty()
    .withMessage('Campo requerido'),

    check('rating')
    .notEmpty()
    .withMessage('Campo requerido'),

    check('awards')
    .notEmpty()
    .withMessage('Campo requerido'),

    check('release_date')
    .notEmpty()
    .withMessage('Campo requerido'),

    check('genre_id')
    .notEmpty()
    .withMessage('Campo requerido'),

]
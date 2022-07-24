const {check} = require('express-validator')

module.exports = [
    check('code')
    .exists().withMessage('Vui lòng nhập Code')
    .notEmpty().withMessage('Code không được để trống'),

    check('status')
    .exists().withMessage('Vui lòng nhập status')
    .notEmpty().withMessage('Status không được để trống')
]
const {check} = require('express-validator')

module.exports = [
    check('user')
    .exists().withMessage('Vui lòng nhập user')
    .notEmpty().withMessage('User không được để trống'),

    check('status')
    .exists().withMessage('Vui lòng nhập status')
    .notEmpty().withMessage('Status không được để trống')
]
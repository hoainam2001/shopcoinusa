module.exports = (req, res, next) => {
    if(req.body.admin == "admin@gmail.com" || req.query.admin == "admin@gmail.com"){
        next()
    }else{
        return res.json({code: 404, message: "This service is not support for this type account"})
    }
}
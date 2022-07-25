const User = require('../models/user')
const History = require('../models/history')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
const {validationResult} = require('express-validator')

// support function
// for order deposit
function historyService(req, res, code, status){
    // let time = new Date()
    // `${time.getFullYear()}/${time.getMonth()}/${time.getDate()} - ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`
    let date = new Date()

    History.findOne({code : code}, (err, dep) => {
        if(err){
            return res.json(err.message)
        }
        if(!dep){
            const history = new History({
                code : code,
                status : status,
                createAt : date,
                updateAt : date
            })
        
            history.save()
            .then(his => {
                return res.json({
                    codeService: his.code,
                    message: "Thêm dịch vụ thành công"
                })
            })
            .catch(err => {
                return res.json({code: 1, message: err.message})
            })
        }else{
            dep.updateAt = date
            dep.status = status
            dep.save()
            .then(his => {
                return res.json({
                    codeService: his.code,
                    message: "Sửa trạng thái thành công của dịch vụ sang " + his.status
                })
            })
            .catch(err => {
                return res.json({code: 1, message: err.message})
            })
            
        }
    })
}

class UserController{

    // [GET] /api/outapi/sign-up
    signUp(req, res){

        let result = validationResult(req)
        if(result.errors.length === 0){
            const {username, email, password} = req.query
        
            User.findOne({email: email}, (err, user) => {
                if(err){
                    return res.json({code: 1, message: err.message})
                }
                else if(user){
                    return res.json({code: 2, message: "Email is exists"})
                }else{
                    User.findOne({username: username}, (e, u) => {
                        if(e){
                            return res.json({code: 1, message: e.message})
                        }
                        else if(u){
                            return res.json({code: 2, message: "Username is exists"})
                        }
                        else{
                            bcrypt.hash(password, 10)
                            .then(hashed => {
                                const newUser = new User({
                                    email: email,
                                    username: username,
                                    password: hashed,
                                    status : (email == "admin@gmail.com") ? "admin" : "non-active",
                                })

                                const token = jwt.sign(
                                    { user_id: newUser._id, email },
                                    process.env.JWT_SECRET,
                                    {
                                    expiresIn: "1h",
                                    }
                                )
                                // save user token
                                newUser.token = token;
                                newUser.save()
                                .then(person => {
                                    return res.json({code: 1, token: person.token})
                                })
                                .catch(err => console.log(err.message))
                            })
                        }
                    })
                }
        
            })
        }else{
            let messages = result.mapped()
            let message = ''
            for(let m in messages){
                message = messages[m]
                break
            }
            return res.json({code: 1, message: message.msg})
        }
        
    }

    // [GET] /api/outapi/sign-in
    signIn(req, res){       
        let result = validationResult(req)
        if(result.errors.length === 0){
            const {email, password} = req.query
            User.findOne({email: email}, (err, person) => {
                if(err){
                    return res.json(err.message)        
                }
                else if(!person){
                    return res.json("Email is not exists")
                }
                else{
                    let pwd = person.password
                    bcrypt.compare(password, pwd)
                    .then(match => {
                        if(!match){
                            return res.json("Password is not true")
                        }
                        const token = jwt.sign(
                            { user_id: person._id, email },
                            process.env.JWT_SECRET,
                            {
                            expiresIn: "1h",
                            }
                        )
                        // save user token
                        person.token = token
                        return res.json({code: 1, data: {token: person.token, email: person.email} })
                    })
                    .catch(err => {
                        return res.json(err.message)
                    })
                }
            })
        }else{
            let messages = result.mapped()
            let message = ''
            for(let m in messages){
                message = messages[m]
                break
            }
            return res.json({code: 1, message: message.msg})
        }
    }

    // [POST] /api/outapi/settypeaccount
    settypeaccount(req, res){

        let result = validationResult(req)
        if(result.errors.length === 0){

        }else{
            let messages = result.mapped()
            let message = ''
            for(let m in messages){
                message = messages[m]
                break
            }
            return res.json({code: 1, message: message.msg})
        }

        const {token, admin, user, status} = req.body
        const query = {'email': user};
        User.findOne(query, (err, person) => {
            if(err){
                return res.json(err.message)
            }else if(!person){
                return res.json("User is not exists")
            }

            person.status = status
            person.updateAt = new Date()
            person.save()
            .then(p => {
                return res.json({code: 1, data: p})
            })
            .catch(err => console.log(err.message))
        })
    }

    // [GET] /api/outapi/deposit/
    deposit(req, res){

        let result = validationResult(req)
        if(result.errors.length === 0){
            const {token, admin, code, status} = req.query
        
            if(status == "onhold"){
                historyService(req, res, code, status)
            }else if(status == "complete"){
                historyService(req, res, code, status)
            }else if(status == "confirm"){
                historyService(req, res, code, status)
            }else if(status == "cancel"){
                historyService(req, res, code, status)
            }else{
                return res.json({code: 3, message: "This method is not support"})
            }
        }else{
            let messages = result.mapped()
            let message = ''
            for(let m in messages){
                message = messages[m]
                break
            }
            return res.json({code: 1, message: message.msg})
        }

        
    }

    // [GET] /api/outapi/withdraw/
    withdraw(req, res){

        let result = validationResult(req)
        if(result.errors.length === 0){
            const {token, admin, code, status} = req.query

            if(status == "onhold"){
                historyService(req, res, code, status)
            }else if(status == "complete"){
                historyService(req, res, code, status)
            }else if(status == "confirm"){
                historyService(req, res, code, status)
            }else if(status == "cancel"){
                historyService(req, res, code, status)
            }else{
                return res.json({code: 3, message: "This method is not support"})
            }
        }else{
            let messages = result.mapped()
            let message = ''
            for(let m in messages){
                message = messages[m]
                break
            }
            return res.json({code: 1, message: message.msg})
        }
    }

}

module.exports = new UserController;
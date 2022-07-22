const User = require('../models/user')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')

class UserController{

    // [GET] /api/outapi/sign-up
    signUp(req, res){
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
                                return res.json({code: 1, data: person})
                            })
                            .catch(err => console.log(err.message))
                        })
                    }
                })
            }
    
        })
    }

    // [GET] /api/outapi/sign-in
    signIn(req, res){
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
                    return res.json(person)
                })
                .catch(err => {
                    return res.json(err.message)
                })
            }
        })
    }

    // [POST] /api/outapi/settypeaccount
    settypeaccount(req, res){
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
}

module.exports = new UserController;
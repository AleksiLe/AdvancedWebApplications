var express = require('express');
var router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {body, validationResult } = require("express-validator");
const validateToken = require('../auth/validateToken')
const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

//Database Connection
const mongoose = require('../database/db')
const dp = mongoose.connection
dp.on('error', console.error.bind(console, 'MongoDB connection error:'))

//Database Models
const Users = require('../database/models/Users')
const Todos = require('../database/models/Todos')


router.get('/', function(req, res, next) {
  res.send('API is working properly');
});

router.post('/user/register/', 
  body("email").isLength({min: 3}).trim().escape().isEmail(),
  body("password").isLength({min: 8}),
  async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()});
    }
    const user = await Users.findOne({email: req.body.email})
    console.log(user)
    if(user){
      return res.status(403).send({email: "Email already in use."});
    } else {
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(req.body.password, salt, (err, hash) => {
          if(err) throw err;
          Users.create(
            {
              email: req.body.email,
              password: hash
            }
          );
        res.send("ok")
        });
      });
    }
})

router.post('/user/login/', 
  body("email").isLength({min: 3}).trim().escape(),
  body("password").isLength({min: 8}),
  upload.none(),
  async (req, res, next) => {
    const user = await Users.findOne({email: req.body.email})

    if(!user) {
      return res.status(403).json({message: "Login failed :("});
    } else {
      bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
        if(err) {
          console.log(err)
        };
        if(isMatch) {
          const jwtPayload = {
            id: user._id,
            email: user.email
          }
          jwt.sign(
            jwtPayload,
            process.env.SECRET,
            {
              expiresIn: 120
            },
            (err, token) => {
              if(err) {
                console.log(err)
              }
              res.json({
                success: true,
                token: token
              })
            }
          )
        } else {  
          return res.status(403).json({message: "Login failed :("});
        }

      })
    }

})

router.get('/private', validateToken, (req, res, next) => {
  res.send({email: req.user.email})
})

router.post('/todos', validateToken, async (req, res, next) => {
  const todoList = await Todos.findOne({user: req.user.id})
  if (todoList) {
    for(let i = 0; i < req.body.items.length; i++) {
      todoList.items.push(req.body.items[i])
    }
    todoList.save()
    
    console.log("updated Todos")
    res.send("ok")
  }
  else {
    Todos.create(
      {
        user: req.user.id,
        items: req.body.items
      }
    )
    console.log("new Todos")
    res.send("ok")
  }
})



module.exports = router;

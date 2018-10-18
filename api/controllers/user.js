const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.user_signup = (req, res, next) => {
    User.find({ email: req.body.email })
      .exec()
      .then(user => {
        if (user.length >= 1) {
          return res.status(409).json({
            message: 'Email already exist'
          });
        } else {
          bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash,
              userCreationDate: req.body.userCreationDate
            });
            user
              .save()
              .then(result => {
                console.log(result);
                res.status(201).json({
                message: 'User created',
                createdUser: {
                  _id: result._id,
                  email: result.email,
                  password: result.password,
                  userCreationDate: result.userCreationDate
                }
              });
            })
            .catch(err => {
              console.log(err);
              res.status(500).json({
                error: err
              });
            });
          }
        });
      }
    })
  }

  exports.user_login = (req, res, next) => {
    User.find({ email: req.body.email })
      .exec()
      .then(user => {
        if (user.length < 1) {
          return res.status(401).json({
            message: 'Auth failed'
          })
        }
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
          if(err) {
            return res.status(401).json({
              message: "Auth failed"
            });
          }
          if (result) {
            const token = jwt.sign(
              {
                email: user[0].email,
                userId: user[0]._id
              },
              process.env.JWT_KEY,
              {
                expiresIn: "1h"
              }
            );
            return res.status(200).json({
              // https://jwt.io/
              message: 'Auth successful',
              token: token
            });
          }
          res.status(401).json({
            message: "Auth failed"
          });
        })
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  }

  exports.users_get_all = (req, res, next) => {
    User.find()
      .select('_id email password userCreationDate')
      .sort({ userCreationDate: -1 })
      .exec()
      .then(docs => {
        const response = {
          count: docs.length,
            users: docs.map(doc => {
              return {
                _id: doc._id,
                email: doc.email,
                password: doc.password,
                userCreationDate: doc.userCreationDate
              }
          })
        };
        res.status(200).json(response);
      })
      .catch();
}

exports.user_get_user = (req, res, next) => {
    const id = req.params.userId;
    User.findById(id)
      .select('_id email password userCreationDate')
      .exec()
      .then(result => {
        console.log("From db", result);
        if (result) {
          res.status(200).json({
              user: result
          });
        } else {
          res
            .status(404)
            .json({
              message: "No valid entry found for that id"
            });
        }
      })
      .catch(err => {
          console.log(err);
          res.status(500).json({
              error: err
          })
      })
  }

exports.user_patch = (req, res, next) => {
  const userId = req.params.userId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  User.update({ _id: userId }, { $set: updateOps })
    .exec()
    .then(result => {
      bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
          return res.status(500).json({
            error: err
          });
        } else {
          const user = new User({
            _id: new mongoose.Types.ObjectId(),
            email: req.body.email,
            password: hash
          });
          user
            .save()
            .then(result => {
              console.log(result);
              res.status(201).json({
                message: 'User created'
              });
            })
            .catch(err => {
              console.log(err);
              res.status(500).json({
                error: err
              });
            });
        }
    })
  })
}

exports.user_delete = (req, res, next) => {
    User.remove({ _id: req.params.userId })
      .exec()
      .then(result => {
        res.status(200).json({
          message: 'User deleted'
        })
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
}
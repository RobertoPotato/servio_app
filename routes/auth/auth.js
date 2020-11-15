const bcrypt = require('bcrypt');
const _ = require('lodash');
const express = require('express');
const { User } = require('../../models/index');
var jwt = require('jsonwebtoken');

//TODO Save key in env variable
const KEY = 'SaveInsideEnvironmentVariableForProduction';
const router = express.Router();

router.post('/register', async (req, res) => {
  //Check if user already exists
  const checkForUser = await User.findAll({
    where: {
      email: req.body.email,
    },
  });

  //Stop registration if user exists
  if (checkForUser.length != 0) {
    return res.status(400).send({
      error: 'User exists, please log in instead',
    });
  }

  const salt = await bcrypt.genSalt(10);
  const user = await User.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: await bcrypt.hash(req.body.password, salt),
  });

  res.status(200).send(_.pick(user, ['firstName', 'lastName', 'email']));
});

router.post('/login', async (req, res) => {
  //See if user exists
  const user = await User.findOne({
    where: {
      email: req.body.email,
    },
  });

  if (user == null) {
    return res.status(404).send({ error: 'Account not found.' });
  } else {
    //If user does exist...
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    //Check if credentials provided are valid. If not send ba request error code
    if (!validPassword) {
      return res.status(400).send({ error: 'Invalid email or password' });
    } else {
      //Create payload for the jwt
      var payload = {
        firstName: user.firstName,
        lastName: user.lastName,
        userId: user.id,
      };
      //Sign the jwt
      var token = jwt.sign(payload, KEY, {
        algorithm: 'HS256',
        expiresIn: '30d', //Expire token after a month
      });
      //send the jwt
      res.status(200).send(token);
    }
  }
});

module.exports = router;

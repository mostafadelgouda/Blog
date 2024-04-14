const jwt = require('jsonwebtoken');
const User = require("../models/User");

const requireAuth = (req, res, next) => {
  console.log(req.cookies)
  const token = req.cookies.jwt;
  
  // check json web token exists & is verified
  if (token) {
    jwt.verify(token, process.env.USER_SECRET, (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.redirect('/login');
      } else {
        console.log(decodedToken);
        next();
      }
    });
  } else {
    res.redirect('/login');
  }
};
const checkUser = (req, res, next) => {
  //console.log('ana datalt hna')
  const token = req.cookies.jwt;
  res.locals.user = null;
  if (token) {
    jwt.verify(token, process.env.USER_SECRET, async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        next();
      } else {
        let user = await User.findById(decodedToken.id);
        res.locals.user = user;

        //console.log('zzzzzzzzzzzz', res.locals.user);
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};
module.exports = { requireAuth, checkUser };
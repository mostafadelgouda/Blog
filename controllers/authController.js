const User = require("../models/User");
const jwt = require('jsonwebtoken');

const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = { email: '', password: '' };
  
    // duplicate email error
    if (err.code === 11000) {
      errors.email = 'that email is already registered';
      return errors;
    }
    if (err.message === 'incorrect email') {
      errors.email = 'That email is not registered';
    }
  
    // incorrect password
    if (err.message === 'incorrect password') {
      errors.password = 'That password is incorrect';
    }
  
    // validation errors
    if (err.message.includes('user validation failed')) {
      // console.log(err);
      Object.values(err.errors).forEach(({ properties }) => {
        // console.log(val);
        // console.log(properties);
        errors[properties.path] = properties.message;
      });
    }
  
    return errors;
  }

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, process.env.USER_SECRET, {
    expiresIn: maxAge
  });
};
const signup_get = (req, res) => {
  //console.log("zzzzzzzzzzzzzzzzzzzzzzz")
  res.render("signup");
};


const signup_post = async (req, res) => {
  
  try {
    const { email, password } = req.body;
    const newUser = await User.create({ email, password });
    const token = createToken(newUser._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({user: newUser._id})
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
    console.log(err);
  }
  //res.render("signup");
};
const login_post = async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body)
  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ user: user._id });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }

}
const logout_get = (req, res) => {
  console.log("ana da5alt hna")
  res.cookie('jwt', '', { maxAge: 1 });
  res.redirect('/');
}

const login_get = (req, res) => {
  res.render("login");
};


module.exports = {
  signup_get,
  signup_post,
  login_get,
  login_post,
  logout_get,
};

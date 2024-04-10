const User = require("../models/User");

const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = { email: '', password: '' };
  
    // duplicate email error
    if (err.code === 11000) {
      errors.email = 'that email is already registered';
      return errors;
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

const signup_get = (req, res) => {
  //console.log("zzzzzzzzzzzzzzzzzzzzzzz")
  res.render("signup");
};


const signup_post = async (req, res) => {
  
  try {
    const { email, password } = req.body;
    const newUser = await User.create({ email, password });
    res.status(201).json(newUser)
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
    console.log(err);
  }
  //res.render("signup");
};

const login_get = (req, res) => {
  res.render("login");
};

const login_post = (req, res) => {
  res.render("login");
};

module.exports = {
  signup_get,
  signup_post,
  login_get,
  login_post,
};

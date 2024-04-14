const express = require('express');
const { requireAuth, checkUser } = require('./middlewares/authMiddleware');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routers/authRoutes.js')
const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config({ path: ".env" });






const app = express()
app.use(express.json())
app.use(express.static('public'));

const port = process.env.PORT;
app.set('view engine', 'ejs');
app.use("/", authRoutes);


app.use(cookieParser());
const dbURI = process.env.DB_URI
mongoose.connect(dbURI)
  .then((result) => app.listen(port, () => console.log(`App running on port ${port}`)))
  .catch((err) => console.log(err));
  

app.get('*', checkUser);
app.get('/', (req, res) => res.render('home'));
app.get('/blogs', requireAuth, (req, res) => res.render('blogs'));




// app.get('/set-cookies', (req, res) => {

//   // res.setHeader('Set-Cookie', 'newUser=true');
  
//   res.cookie('newUser', false);
//   res.cookie('isEmployee', true, { maxAge: 1000 * 60 * 60 * 24, httpOnly: true });

//   res.send('you got the cookies!');

// });

// app.get('/read-cookies', (req, res) => {

//   const cookies = req.cookies;
//   console.log(cookies.newUser);

//   res.json(cookies);

// });


//app.listen(port, () => console.log(`App running on port ${port}`));
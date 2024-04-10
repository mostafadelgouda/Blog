const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config({ path: ".env" });


const authRoutes = require('./routers/authRoutes.js')

const express = require('express');

const app = express()
app.use(express.json())
app.use(express.static('public'));

const port = process.env.PORT;
app.set('view engine', 'ejs');
app.use("/", authRoutes);



const dbURI = process.env.DB_URI
mongoose.connect(dbURI)
  .then((result) => app.listen(port, () => console.log(`App running on port ${port}`)))
  .catch((err) => console.log(err));
  
app.get('/', (req, res) => res.render('home'));
app.get('/blogs', (req, res) => res.render('blogs'));
//app.listen(port, () => console.log(`App running on port ${port}`));
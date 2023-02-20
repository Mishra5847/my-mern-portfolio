const express = require('express');
const app = express();

// __________________ENV_______________________________________
const dotenv = require('dotenv');
dotenv.config({path:'./config.env'});

// __________________connection________________________________
require('./Connection/Connection');


// ___________________COOKIE-PARSER____________________________
const cookieParser = require('cookie-parser');
app.use(cookieParser());


// _______________________ROUTES_______________________________
app.use(express.json());
app.use(require("./Routes/Routes.js"));


//_______________________serving the frontend_______________________________ 
const path = require('path');
app.use(express.static(path.join(__dirname, "./client/build")));

app.use("*", function(req, res){
    res.sendFile(path.join(__dirname, "./client/build/index.html"));
});


// __________________________________________________________________
app.listen(process.env.PORT || 5000)
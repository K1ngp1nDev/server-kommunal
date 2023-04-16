require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const compression = require('compression');
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');
const router = require('./router/index.js')
const cors = require('cors');
const errorMiddleware = require('./middleware/errorMiddleware');
const app = express();

const PORT = process.env.PORT || 5000;

app.use(compression({
    threshold: 1,
    filter: function() {return true;}
})); 

mongoose.set('strictQuery', true);
app.use('/public', express.static(__dirname + "/public"))
app.use(bodyParser.json({limit:1024*1024*20, type:'application/json'}));
app.use(bodyParser.urlencoded({extended:true,limit:1024*1024*20,type:'application/x-www-form-urlencoding' }));
app.use(express.json({limit: '50mb'}));
app.use(cookieParser());

const allowedOrigins = [process.env.CLIENT_URL,
                        process.env.CLIENT_URL2,
                        process.env.CLIENT_LOCAL_URL,
                        process.env.CLIENT_LOCAL_URL2];

app.use(cors({
    origin: function(origin, callback){
        if(!origin) return callback(null, true);
        if(allowedOrigins.indexOf(origin) === -1){
        var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
        return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    optionsSuccessStatus: 200,
    credentials: true
    }));

app.use('/api', router);
app.use(errorMiddleware);

const connectDB = async () => {
    try {
        const conn = await mongoose.connect('mongodb+srv://server_whv:Wilhelmshaven2023_@cluster0.leapsyp.mongodb.net/whv?retryWrites=true&w=majority',{useNewUrlParser: true, useUnifiedTopology: true })
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (e) {
        console.log(e)
        process.exit(1)
    }
}

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("listening for requests");
    })
})
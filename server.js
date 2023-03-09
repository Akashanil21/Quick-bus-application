const express = require('express');
const app = express();
const bodyParser = require('body-parser');
require('dotenv').config()
const dbConfig = require('./config/dbConfig')
const path = require('path')

const port = process.env.PORT || 5000;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json())

const usersRoute = require('./routes/usersRoute')
const adminRoute = require('./routes/adminRoute')
const busRoute = require('./routes/busesRoute')
const bookingRoute = require('./routes/bookingsRoute')

app.use('/api/users',usersRoute)
app.use('/api/admin',adminRoute)
app.use('/api/buses',busRoute)
app.use('/api/bookings',bookingRoute)

// static files

app.use(express.static(path.join(__dirname,'./client/build')))

app.get('*',(req,res)=>{
    res.sendFile(path.join(__dirname,'./client/build/index.html'))
})

app.listen(port, () => console.log(`Server running on port ${port}`))
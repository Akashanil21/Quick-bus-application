mongoose = require('mongoose');
mongoose.set('strictQuery', false);
mongoose.connect(process.env.mongo_url)

const db = mongoose.connection;

db.on("connected",()=>{
    console.log("Mongo DB connection successful");
})

db.on("error",()=>{
    console.log("Mongo DB connection failed");
})


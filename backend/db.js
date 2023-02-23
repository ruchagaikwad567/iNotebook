const mongoose = require('mongoose');
const mongoURI="mongodb://localhost:27017/inotebookdb?directConnection=true&tls=false&readPreference=primary"


//this is used to connect to database
const connectToMongo=()=>{
    mongoose.connect(mongoURI,()=>{
        console.log("Connected to Mongo successfully")
    })
}


module.exports=connectToMongo;

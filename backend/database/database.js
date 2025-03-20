const { default: mongoose } = require("mongoose")

const {MONGO_URI} = process.env

exports.connect = () => {

    mongoose.connect(MONGO_URI)
    .then(()=> {
        console.log(`connected to database successfully...`)
    })
    .catch((err)=> {

        console.log('failed to connect to mongodb')
        console.error(err);
        process.exit(1);
    })
}
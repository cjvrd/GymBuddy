const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = "mongodb+srv://admin:admin@cluster0.lfl9odj.mongodb.net/?retryWrites=true&w=majority";
const uri = "mongodb+srv://admin:admin@cluster0.xq9spst.mongodb.net/?retryWrites=true&w=majority";
// const uri = "mongodb+srv://admin:admin@cluster0.btwcixe.mongodb.net/?retryWrites=true&w=majority";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

client.connect();

module.exports = { client };
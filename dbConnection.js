const { MongoClient, ServerApiVersion } = require('mongodb');
//const uri = "mongodb+srv://admin:admin@cluster0.btwcixe.mongodb.net/?retryWrites=true&w=majority"; //avinash
const uri = "mongodb+srv://admin:admin@cluster0.xq9spst.mongodb.net/?retryWrites=true&w=majority"; //Majeed

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

client.connect();

module.exports = client;
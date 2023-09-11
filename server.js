var express = require("express")
var app = express()

const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = "mongodb+srv://admin:admin@cluster0.lfl9odj.mongodb.net/?retryWrites=true&w=majority";
const uri = "mongodb+srv://admin:admin@cluster0.xq9spst.mongodb.net/?retryWrites=true&w=majority";
var port = process.env.port || 3000;
let collection;

app.use(express.static(__dirname+'/public'))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
async function runDBConnection() {
    try {
        await client.connect();
        console.log("successfully connected")
        collection = client.db().collection('User')
        console.log(collection)
    } catch(ex) {
        console.error(ex);
    }
    
}

// run().catch(console.dir);

app.get('/', function(req,res) {
    res.render('index.html')
})

// GET users handler
app.get('/api/users', (req, res) => {
    getAllUsers((err,result)=>{
        if(!err){
            res.json({statusCode:200, data:result, message:'got all users successfully'})
        }
    });
})

// POST user handler
app.post('/api/user', function(req,res){
    let user = req.body;
    postUser(user, (err, result) =>{
        if(!err){
            res.json({
                statusCode:201, 
                data:result, 
                message:'success'
            })
        }
    })
})

function postUser(user, callback){
    collection.insertOne(user, callback);
}

function getAllUsers(callback){
    collection.find({}).toArray(callback)
}

app.listen(port,()=>{
    console.log("App listening to: "+port)
    runDBConnection();

})
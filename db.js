
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://fernandomsa22:Shehara2002@cluster0.683r8uc.mongodb.net/?appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function getClient(){
  try{
    await client.connect();
    console.log("Client Connected");
    return client;
  }catch(err){
    console.log(err);
  }
  
}

module.exports = getClient;
const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 6001;
require("dotenv").config();

//middleware
app.use(cors());
app.use(express.json());

//theepashreekumar
//Zu3anLpET59rxDyL

//mongodb sample code

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri =
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@demo-eatohunt-cluster.ckfibet.mongodb.net/?retryWrites=true&w=majority&appName=demo-EatOHunt-cluster`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    //database and collections
    const menuCollections = client.db("demo-EatOHunt-client").collection("menus");
    const cartCollections = client.db("demo-EatOHunt-client").collection("cartItems");

    // all menu items operations
    app.get('/menu', async(req,res)=>{
      const result = await menuCollections.find().toArray();
      res.send(result)
    })

    //all carts operations

    //posting cart to db
    app.post('/carts',async(req,res)=>{
      const cartItem = req.body;
      const result = await cartCollections.insertOne(cartItem);
      res.send(result)

    })


    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

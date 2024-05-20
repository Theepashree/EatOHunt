const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ObjectId, ServerApiVersion } = require("mongodb");
const mongoose = require('mongoose');

const port = process.env.PORT || 5000;
const uri =
"mongodb://theepashreekumar:Zu3anLpET59rxDyL@ac-gngsgsh-shard-00-00.ckfibet.mongodb.net:27017,ac-gngsgsh-shard-00-01.ckfibet.mongodb.net:27017,ac-gngsgsh-shard-00-02.ckfibet.mongodb.net:27017/?ssl=true&replicaSet=atlas-xpv343-shard-0&authSource=admin&retryWrites=true&w=majority&appName=demo-EatOHunt-cluster";

//middleware
app.use(cors());
app.use(express.json());

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});


async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("Connected successfully to MongoDB!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

connectToMongoDB();

//database and collections
const menuCollections = client.db("demo-EatOHunt-client").collection("menus");
const cartCollections = client
  .db("demo-EatOHunt-client")
  .collection("cartItems");

// all menu items operations
app.get("/menu", async (req, res) => {
  const result = await menuCollections.find().toArray();
  res.send(result);
});

//all carts operations

//posting cart to db
app.post("/carts", async (req, res) => {
  const cartItem = req.body;
  const result = await cartCollections.insertOne(cartItem);
  res.send(result);
});

//get carts using email
app.get('/carts',async(req,res)=>{
  const email = req.query.email;
  const filter = {email: email};
  const result = await cartCollections.find(filter).toArray();
  res.send(result)
})

//get specific carts
app.get('/carts/:id',async(req,res)=>{
  const id = req.params.id;
  const filter = {_id: new ObjectId(id)};
  const result = await cartCollections.findOne(filter);
  res.send(result);
})

//delete items from cart
app.delete('/carts/:id',async(req,res)=>{
  const id = req.params.id;
  const filter = {_id: new ObjectId(id)};
  const result = await cartCollections.deleteOne(filter);
  res.send(result);
})

//update carts quantity
app.put("/carts/:id",async(req,res)=>{
  const id = req.params.id;
  const {quantity} = req.body
  const filter = {_id: new ObjectId(id)};
  const options = {upsert:true};
  const updateDoc = {
    $set: {
        quantity: parseInt(quantity,10),
    },
  };

  const result = await cartCollections.updateOne(filter,updateDoc,options);
});

app.post("/new-class", async (req, res) => {
  const newClass = req.body;
  const database = client.db("demo-EatOHunt-client");
  const classesCollection = database.collection("classes");
  try {
    const result = await classesCollection.insertOne(newClass);
    res.json(result);
  } catch (error) {
    console.error("Error inserting document:", error);
    res.status(500).json({ error: "Failed to insert document" });
  }
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});





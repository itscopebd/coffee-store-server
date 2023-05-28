const express = require("express");
const app = express();
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require("cors")
const port = process.env.PORT || 5000;


// middleware 

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Rofiq")
})


// 
// 


const uri = `mongodb+srv://${process.env.DB_Users}:${process.env.DB_PASS}@cluster0.loltiyt.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const database = client.db("coffeeDb");
    const Collections = database.collection("coffee");

    app.get("/coffee", async (req, res) => {
      const cursor = Collections.find();
      const result = await cursor.toArray();
      res.send(result)
    })

    app.get("/coffee/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await Collections.findOne(query);
      res.send(result)
    })

    app.post("/addcoffee", async (req, res) => {

      const addCoffee = req.body;

      const result = await Collections.insertOne(addCoffee);
      res.send(result)
    })



    app.delete("/coffee/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await Collections.deleteOne(query);
      res.send(result)
    })

    app.put("/coffee/:id", async (req, res) => {
      const id = req.params.id;
      const data=req.body;
      const query = { _id: new ObjectId(id) }
      const options = { upsert: true };

      const updateInfo= {
        $set: {
          name:data.name,
          chef:data.chef,
          supplier:data.supplier,
          category:data.category,
          details:data.datails,
          url:data.url

        },
      };

      const result = await Collections.updateOne(query, updateInfo, options);
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {

  }
}
run().catch(console.dir);



app.listen(port, () => {
  console.log("server is Running...")
})
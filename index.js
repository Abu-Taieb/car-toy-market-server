const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());


// Middleware
// const corsConfig = {
//   origin: "*",
//   credentials: true,
//   methods: ["GET", "POST", "PUT", "DELETE"],
// };
// app.use(cors(corsConfig));
// app.options("", cors(corsConfig));

// app.use(express.json());


app.get("/", (req, res) => {
  res.send("Car toy market server is Running");
});


// MongoDB

const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASS}@cluster0.gkyk9vk.mongodb.net/?retryWrites=true&w=majority`;



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

    const serviceCollection = client.db("carToys").collection("toys");
    const toyNewCollection = client.db("carToys").collection("addNewToy");

    app.get("/toys", async (req, res) => {
      const cursor = serviceCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/toys/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };

      const options = {
        projection: {
          title: 1,
          price: 1,
          picture_url: 1,
          toy_name: 1,
          seller_name: 1,
          seller_email: 1,
          rating: 1,
          available_quantity: 1,
          description: 1,
          category: 1,
        },
      };

      const result = await serviceCollection.findOne(query, options);
      res.send(result);
    });

    // Get new added toy data
    app.get("/addNewToy", async (req, res) => {
      // console.log(req.query.email);
      let query = {};
      if (req.query?.email) {
        query = { email: req.query.email };
      }
      const result = await toyNewCollection.find(query).toArray();
      res.send(result);
    });

    // Add New Toy
    app.post("/addNewToy", async (req, res) => {
      const addNewToy = req.body;
      // console.log(addNewToy);
      const result = await toyNewCollection.insertOne(addNewToy);
      res.send(result);
    });

    // Toy Update
    app.patch('/addNewToy/:id', async(req, res) => {
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const updateToy = req.body;
      console.log(updateToy);
      const updateData = {
        $set:{
          status:updateToy.status
        },
      }
      const result = await toyNewCollection.updateOne(filter, updateData);
      res.send(result);
    })



    // Toy Delete
    app.delete("/addNewToy/:id", async (req, res) => {
      const id = req.params?.id;
      const query = { _id: new ObjectId(id) };
      const result = await toyNewCollection.deleteOne(query);
      console.log(result);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
  }
}
run().catch(console.dir);


app.listen(port, () => {
  console.log(`Car toy server is running on port ${port}`);
});

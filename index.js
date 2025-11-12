const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5rkszyx.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

app.get("/", (req, res) => {
  res.send("Server is running");
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const jobify_DB = client.db("jobify_DB");
    const usersCollection = jobify_DB.collection("users");
    const jobsCollection = jobify_DB.collection("jobs");

    // users
    app.post("/users", async (req, res) => {
      const newUser = req.body;

      const email = req.body.email;
      const query = { email: email };
      const alreadyUser = await usersCollection.findOne(query);

      if (alreadyUser) {
        res.send({ message: "User already exits" });
      } else {
        const result = await usersCollection.insertOne(newUser);
        res.send(result);
      }
    });


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const port = process.env.PORT | 5000;

app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, Db, ObjectId } = require("mongodb");
const uri = process.env.DB_URI;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
const run = async () => {
  try {
    const usersCollection = client.db("social_db").collection("users");
    const postsCollection = client.db("social_db").collection("posts");

    app.put("/users", async (req, res) => {
      const userData = req.body;
      const { name, image, email, dob } = userData;
      const filter = { name, image, email, dob };
      const updateDoc = {
        $set: {
          name,
          image,
          email,
          dob,
        },
      };
      const options = { upsert: true };
      const result = await usersCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });
    app.put("/posts", async (req, res) => {
      const post = req.body;
      const { title, name, info, email, image, time } = post;
      const filter = { title, name, info, email, image, time };
      const updateDoc = {
        $set: {
          title,
          name,
          info,
          email,
          image,
          time,
        },
      };
      const options = { upsert: true };
      const result = await postsCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });
    app.get("/allpost", async (req, res) => {
      const result = await postsCollection.find({}).toArray();
      res.send(result);
    });
    app.get("/posts/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const result = await postsCollection.findOne(filter);
      res.send(result);
    });
    app.get("/users/:username", async (req, res) => {
      const username = req.params.username;
      const filter = { name: username };
      const result = await usersCollection.findOne(filter);
      res.send(result);
    });
    app.get("/allpost/:email", async (req, res) => {
      const email = req.params.email;
      const filter = { email: email };
      const result = await postsCollection.find(filter).toArray();
      res.send(result);
    });
  } catch {
  } finally {
  }
};
run().catch((err) => console.error(err.message));

app.get("/", (req, res) => {
  res.send("Social Media server is running");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// Middleware__
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.g4yea9q.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // await client.connect();
    // Send a ping to confirm a successful connection

    const roomsCollection = client.db("innspot").collection("rooms");
    const bookingCollection = client.db("innspot").collection("bookings");




    // Get operation for available room data__

    app.get("/rooms", async (req, res) => {
      try{
        const query = {status: "Available"};
        const result = await roomsCollection.find(query).toArray();
        res.send(result);
      }
      catch(error) {
        console.log(error)
        res.status(500).send({massage: "Error fetching data"})
      }
    })

    // Get operation for specific room__  

    app.get("/rooms/:id", async (req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await roomsCollection.findOne(query)
      res.send(result);
    })

    // Post operation for add booking__

    app.post("/bookings", async (req, res) => {
      const booking = req.body;
      console.log(booking);
      const result = await bookingCollection.insertOne(booking);
      res.send(result);
    })

    // Get operation for find booking__

    app.get("/bookings/:email", async (req, res) => {
      const email = req.params.email;
      const query = {userEmail: email}
      const cursur = bookingCollection.find(query);
      const result = await cursur.toArray();
      res.send(result);
    })

    // Delete operation for booking__

    app.delete("/bookings/:id", async (req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await bookingCollection.deleteOne(query);
      res.send(result);
    })

    // Patch operation for booking__

    app.patch("/bookings/:id", async (req, res) => {
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const updateBooking = req.body;
      console.log(updateBooking);
      const updateDoc = {
        $set: {
          userName: updateBooking.userName,
          contactUserEmail: updateBooking.contactUserEmail,
          checkInDate: updateBooking.checkInDate,
          checkOutDate: updateBooking.checkOutDate,
          totalDays: updateBooking.totalDays,
          totalPrice: updateBooking.totalPrice
        }
      }
      const result = await bookingCollection.updateOne(filter, updateDoc);
      res.send(result);
    })





    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that th  e client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);





app.get("/", (req, res) => {
  res.send("The Innsopt server is running")
})

app.listen(port, () => {
  console.log(`The InnSpot server is running on ${port} PORT`)
}) 
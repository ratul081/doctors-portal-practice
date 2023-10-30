const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
app.use(cors())
app.use(express.json())
require('dotenv').config()
require('colors')

//mongodb connect

const uri = process.env.DB_URI

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


async function dbConnection() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    console.log("Database connected".yellow);
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
dbConnection()

//database
const database = client.db("doctors_portal");
const appointmentOptions = database.collection("doctors_portal_appointmentOptions")
const allUsers = database.collection("doctors_portal_AllUsers")
const bookings = database.collection("doctors_portal_bookings")
const payment = database.collection("doctors_portal_payment")



//endpoints

app.get('/appointmentOptions', async (req, res) => {
  try {
    const date = req.query.date;
    const query = {};
    const options = await appointmentOptions.find(query).toArray();

    // get the bookings of the provided date
    const bookingQuery = { appointmentDate: date }
    const alreadyBooked = await bookings.find(bookingQuery).toArray();

    // code carefully :D
    options.forEach(option => {
      const optionBooked = alreadyBooked.filter(book => book.bookedTreatment === option.name)
      const bookedSlots = optionBooked.map(book => book.bookedSlot);
      const remainingSlots = option.slots.filter(slot => !bookedSlots.includes(slot))
      option.slots = remainingSlots
    })
    res.send({
      status: true,
      massage: "Successfully got the data",
      data: options,
    });
  }
  catch (error) {
    console.log(error.name.bgRed, error.message.bold);
    res.send({
      success: false,
      error: error.message,
    })
  }
})


app.get("/bookings", async (req, res) => {
  try {
    const email = req.query.email
    const query = { patientEmail: email }
    const result = await bookings.find(query).toArray()
    res.send({
      status: true,
      massage: "Successfully got the data",
      data: result,
    });
  } catch (error) {
    console.log(error.name.bgRed, error.message.bold);
    res.send({
      success: false,
      error: error.message,
    });
  }
})


app.post("/bookings", async (req, res) => {
  try {
    const bookingDetails = req.body
    const query = {
      appointmentDate: bookingDetails.appointmentDate,
      patientEmail: bookingDetails.patientEmail,
      bookedTreatment: bookingDetails.bookedTreatment,
    }
    const alreadyBooked = await bookings.find(query).toArray()
    console.log("🚀 ~ file: index.js:113 ~ app.post ~ alreadyBooked:", alreadyBooked)
    const bookedSlots = {
      patientEmail: bookingDetails.patientEmail,
      appointmentDate: bookingDetails.appointmentDate,
      bookedSlot: bookingDetails.bookedSlot
    }
    const alreadyBookedSlot = await bookings.find(bookedSlots).toArray()
    if (alreadyBooked.length || alreadyBookedSlot.length) {
      const message = `You already have a booking on ${bookingDetails?.appointmentDate} ${alreadyBookedSlot[0]?.bookedSlot ? `and ${alreadyBookedSlot[0]?.bookedSlot}` : " "}`
      return res.send({ data: { acknowledged: false, message } })
    }

    const result = await bookings.insertOne(bookingDetails);
    res.send({
      status: true,
      massage: "Successfully got the data",
      data: result,
    });
  } catch (error) {
    console.log(error.name.bgRed, error.message.bold);
    res.send({
      success: false,
      error: error.message,
    });
  }
})
app.delete("/bookings/:id", async (req, res) => {
  try {
    const id = req.params.id
    const email = req.body.email
    // console.log("🚀 ~ file: index.js:144 ~ app.delete ~ email:", email)
    const query = { _id: new ObjectId(id), patientEmail: email }
    const result = await bookings.deleteOne(query);
    res.send(result);
  } catch (error) {
    console.log(error.name.bgRed, error.message.bold);
    res.send({
      success: false,
      error: error.message,
    });
  }

})
app.post("/users", async (req, res) => {
  try {
    const user = req.body
    const result = await allUsers.insertOne(user)
    res.send({
      status: true,
      massage: "Successfully got the data",
      data: result,
    });
  }
  catch (error) {
    console.log(error.name.bgRed, error.message.bold);
    res.send({
      success: false,
      error: error.message,
    });
  }
})


app.get('/', (req, res) => {
  res.send('Doctors Portal server is running')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
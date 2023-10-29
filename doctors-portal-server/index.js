const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');
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
// app.get("/appointmentOptions", async (req, res) => {
//   try {
//     const date = req.query.date
//     // console.log("🚀 ~ file: index.js:53 ~ app.get ~ date:", date)
//     const query = {}
//     const options = await appointmentOptions.find(query).toArray()
//     //get booking options
//     // console.log("🚀 ~ file: index.js:57 ~ app.get ~ options:", options)
//     const bookingQuery = { AppointmentDate: date }
//     const alreadyBooked = await bookings.find(bookingQuery).toArray()
//     //filtering from two collections of booking options
//     options.forEach(option => {
//       const optionBooked = alreadyBooked.filter(book => book.bookedTreatment === option.name);
//       console.log("🚀 ~ file: index.js:63 ~ app.get ~ optionBooked:", optionBooked)
//       const bookedSlots = optionBooked.map(book => book.slot);
//       const remainingSlots = option.slots.filter(slot => !bookedSlots.includes(slot))
//       option.slots = remainingSlots;
//     })
//     // console.log(options);
//     res.send({
//       status: true,
//       massage: "Successfully got the data",
//       data: options,
//     });
//   } catch (error) {
//     console.log(error.name.bgRed, error.message.bold);
//     res.send({
//       success: false,
//       error: error.message,
//     });
//   }
// })


app.get('/appointmentOptions', async (req, res) => {
  try {
    const date = req.query.date;
    const query = {};
    const options = await appointmentOptions.find(query).toArray();

    // get the bookings of the provided date
    const bookingQuery = { AppointmentDate: date }
    const alreadyBooked = await bookings.find(bookingQuery).toArray();
    console.log("🚀 ~ file: index.js:93 ~ app.get ~ alreadyBooked:", alreadyBooked)

    // code carefully :D
    options.forEach(option => {
      const optionBooked = alreadyBooked.filter(book => book.bookedTreatment === option.name);
      const bookedSlots = optionBooked.map(book => book.slot);
      console.log("🚀 ~ file: index.js:99 ~ app.get ~ bookedSlots:", bookedSlots)
      const remainingSlots = option.slots.filter(slot => !bookedSlots.includes(slot))
      // console.log("🚀 ~ file: index.js:99 ~ app.get ~ remainingSlots:", remainingSlots)
      option.slots = remainingSlots;
      // console.log("🚀 ~ file: index.js:102 ~ app.get ~ option:", option)
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




app.post("/bookings", async (req, res) => {
  try {
    const bookingDetails = req.body
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


app.get('/', (req, res) => {
  res.send('Doctors Portal server is running')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
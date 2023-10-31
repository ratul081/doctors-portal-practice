const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
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


//middleware

const verifyJWT = (req, res, next) => {
  const authorization = req.headers.authorization
  // console.log("🚀 ~ file: index.js:53 ~ verifyJWT ~ authorization:", authorization)
  if (!authorization) {
    return res.status(401).send({
      error: true,
      message: "Invalid authorization"
    })
  }
  const token = authorization.split(" ")[1]
  // console.log("🚀 ~ file: index.js:61 ~ verifyJWT ~ token:", token)

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY, (err, decoded) => {
    // console.log("🚀 ~ file: index.js:63 ~ jwt.verify ~ token:", token)
    if (err) {
      return res.status(401).send({
        error: true,
        message: "Invalid authorization"
      })
    }
    req.decoded = decoded
    next()
  })

}

const verifyAdmin = async (req, res, next) => {
  const email = req.decoded.email
  const query = { email: email }
  const user = await allUsers.findOne(query)
  // console.log("🚀 ~ file: index.js:82 ~ verifyAdmin ~ user:", user)
  if (user?.role !== "admin") {
    return res.status(401).send({
      error: true,
      message: "Invalid authorization"
    })
  }
  next()
}
//endpoints

app.post("/jwt", (req, res) => {
  const user = req.body
  const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET_KEY, { expiresIn: '1h' })
  res.send({ token })
})

//users endpoints
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


app.get("/bookings", verifyJWT, async (req, res) => {
  try {
    const email = req.query.email
    const decodedEmail = req.decoded.email
    if (email !== decodedEmail) {
      return res.status(401).send({
        error: true,
        message: "Forbidden access"
      })
    }
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

app.post("/bookings", verifyJWT, async (req, res) => {
  try {
    const bookingDetails = req.body
    const query = {
      appointmentDate: bookingDetails.appointmentDate,
      patientEmail: bookingDetails.patientEmail,
      bookedTreatment: bookingDetails.bookedTreatment,
    }
    const alreadyBooked = await bookings.find(query).toArray()
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
app.delete("/bookings/:id", verifyJWT, async (req, res) => {
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

app.get("/allUsers", verifyJWT, verifyAdmin, async (req, res) => {
  try {
    const query = {}
    const result = await allUsers.find(query).toArray();
    // console.log("🚀 ~ file: index.js:203 ~ app.get ~ result:", result)
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

app.post("/users", verifyJWT, async (req, res) => {
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

app.patch("/users/:id", verifyJWT, verifyAdmin, async (req, res) => {
  try {
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) }
    const updateDoc = {
      $set: {
        role: "admin",
      }
    }
    const upsert = true
    const result = await allUsers.updateOne(filter, updateDoc, upsert)
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
app.delete("/users/:id", verifyJWT, verifyAdmin, async (req, res) => {
  try {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) }
    const result = await allUsers.deleteOne(query)
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
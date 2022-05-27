import express from "express"
import cors from "cors"
import mongoose from "mongoose"

import listEndpoints from "express-list-endpoints"
import destinations from "./data/destinations.json"

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/sup-api"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())

// Start defining your routes here
app.get("/", (req, res) => {
  res.send(listEndpoints(app))
});

///////////////////////Destination section/////////////////////
app.get("/destinations", (req, res) => {

  res.status(200).json({
    data: destinations,
    success: true,
  })
})

app.get("/destinations/destination/:category", (req, res) => {

  const { category } = req.params

   const destinationByCategory = destinations.filter((destination) =>
   destination.category.toLowerCase() === category)

  if (destinationByCategory) {
    res.status(200).json({
      data: destinationByCategory,
      success: true,
    })
  } else {
    res.status(404).json({
      data: "Destination not found.",
      success: false,
    })
  }
})

///////////////////////User section/////////////////////
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    minlength: 8,
    maxlength: 30,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    match: /.+\@.+\..+/,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  accessToken: {
    type: String,
    default: () => crypto.randomBytes(128).toString("hex")
  }
})



// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})

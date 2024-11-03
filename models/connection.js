const mongoose = require('mongoose');

const connectionString= process.env.CONNECTION_STRING
const API_KEY=process.env.API_KEY
const CONSUMER_KEY=process.env.CONSUMER_KEY
const CONSUMER_SECRET=process.env.CONSUMER_SECRET
const BACKEND = process.env.NEXT_PUBLIC_BACKEND

mongoose.connect(connectionString, { connectTimeoutMS: 2000 })
  .then(() => console.log('Database connected'))
  .catch(error => console.error(error));

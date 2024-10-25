const mongoose = require('mongoose');

const connectionString= process.env.CONNECTION_STRING
const API_KEY=process.env.API_KEY

mongoose.connect(connectionString, { connectTimeoutMS: 2000 })
  .then(() => console.log('Database connected'))
  .catch(error => console.error(error));

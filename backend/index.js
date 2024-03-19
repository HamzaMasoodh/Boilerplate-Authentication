require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const app = express();
const logger = require('./src/utils/logger')
const { bingetterSocket } = require('./src/utils/socket');
const http = require("http");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

var corsOptions = {
  origin: '*',
};

app.use(cors(corsOptions));

const serverSocket = http.createServer(app);
bingetterSocket(serverSocket)


mongoose
  .connect(process.env.MONGO_URL, {
    dbName: process.env.DBNAME,
  })
  .then(() => {
    logger.info("Connected to the database")
  })
  .catch((error) => {
    logger.info( `Connected to the database ${error.message}`)
  });

app.use('/api',require('./src/routes/user/user'))
app.use('/api',require('./src/routes/admin/admin'))
app.use('/api',require('./src/routes/notifications/notification'))

let port = process.env.PORT || 3006;

const server=serverSocket.listen(port, () => {
  logger.info(`Server is running on port ${port}`)
});

module.exports = { app, server };
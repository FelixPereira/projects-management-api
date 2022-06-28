const express = require('express');
const mongoose = require('mongoose');
const app = express();

mongoose
  .connect('mongodb://localhost/projectsmanagement')
  .then(() => console.log('Connected to mongoDB...'))
  .catch(error => console.log(error.message));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Listen on port ${PORT}`);
});
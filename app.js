const express = require('express');
const mongoose = require('mongoose');
const app = express();

mongoose
  .connect('mongoose://localhost/projectsmanagement')
  .then(() => console.log('Connected to mongoDB...'))
  .catch(error => console.log('Failed to connect...'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Listen on port ${PORT}`);
});
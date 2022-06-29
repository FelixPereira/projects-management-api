const express = require('express');
const mongoose = require('mongoose');
const projectRoutes = require('./routes/projects');
const app = express();

mongoose
  .connect('mongodb://localhost/projectsmanagement')
  .then(() => console.log('Connected to mongoDB...'))
  .catch(error => console.log(error.message));

app.use(express.json());
app.use('/api/projectos', projectRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Listen on port ${PORT}`);
});
const express = require('express');
const mongoose = require('mongoose');
const projectRoutes = require('./routes/project');
const userRoutes = require('./routes/user');
const auth = require('./routes/auth');
const app = express();

mongoose
  .connect('mongodb://localhost/projectsmanagement')
  .then(() => console.log('Connected to mongoDB...'))
  .catch(error => console.log(error.message));

app.use(express.json());
app.use('/api/projectos', projectRoutes);
app.use('/api/usuarios', userRoutes);
app.use('/api/auth', auth);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Listen on port ${PORT}`);
});
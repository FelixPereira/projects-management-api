const express = require('express');
const mongoose = require('mongoose');
const projectRoutes = require('./routes/project');
const userRoutes = require('./routes/user');
const cors = require('cors');
const app = express();


mongoose
  .connect('mongodb://0.0.0.0:27017/projectsmanagement')
  .then((res) => console.log('Connected to mongoDB...'))
  .catch(error => console.log(error.message));

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true
  })
)

app.use('/api/projectos', projectRoutes);
app.use('/api/usuarios', userRoutes);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Listen on port ${PORT}`);
});
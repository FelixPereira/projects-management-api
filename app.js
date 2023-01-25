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

// Allow cors
// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
//   res.setHeader("Access-Control-Allow-Credentials", "true");
//   res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,POST,PUT");
//   res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
//   if (req.method == "OPTIONS") {
//     return res.sendStatus(200);
//   }
//   next();
// });
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
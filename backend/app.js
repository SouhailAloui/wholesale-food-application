const express = require('express')
const app = express()
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const { registerUser, loginUser } = require('./src/controllers/AuthController');


dotenv.config();

app.use(express.json());

app.use(cors());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));


// Routes


app.use('/api', require('./src/routes/ProtectedRoute')); 
app.use('/api', require ('./src/routes/clientSide.js'))
app.use('/api', require ('./src/routes/wholesaleSide.js'))


app.post('/api/register', registerUser);
app.post('/api/login', loginUser);



const PORT = process.env.PORT || 8000;
app.listen(PORT,'0.0.0.0', () => console.log(`Server running on port ${PORT}`));
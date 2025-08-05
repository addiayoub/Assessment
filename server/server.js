const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connexion MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/monapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'API MERN fonctionne!' });
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
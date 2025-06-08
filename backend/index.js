import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import collectionRoutes from './routes/collections.js';
import cardsRoutes from './routes/cards.js';

const app = express();
const PORT = 3000;

// Middleware
const corsOptions = {
  origin: `http://${process.env.DOCKER_HOST_IP_ADDRESS}:8080`, // Temporarily use '*'
  methods: 'GET, POST, PUT, DELETE',
  allowedHeaders: 'Content-Type, Authorization',
};
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use('/api/collections', collectionRoutes);
app.use('/api/cards', cardsRoutes);

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/flashcards';

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB db');
  app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});
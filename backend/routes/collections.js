import express from 'express';
import Collection from '../models/Collection.js';

const router = express.Router();

// Get all collections
router.get('/', async (req, res) => {
  try {
    const collections = await Collection.find().sort({ createdAt: -1 });
    res.json(collections);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Get collection by ID
router.get('/:id', async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id);
    if (!collection) return res.status(404).json({ error: 'Not found' });
    res.json(collection);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// Create a new collection
router.post('/', async (req, res) => {
  const { name, description } = req.body;

  try {
    const newCollection = await Collection.create({ name, description });
    res.status(201).json(newCollection);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// Delete a collection by ID
router.delete('/:id', async (req, res) => {
  try {
    await Collection.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
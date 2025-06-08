import express from 'express';
import mongoose from 'mongoose';
import Card from '../models/Card.js';
import Collection from '../models/Collection.js';

const router = express.Router();

// Get all cards filterable by collectionId
router.get('/', async (req, res) => {
  const { collectionId } = req.query;

  let query = {};
  if (collectionId) {
    if (!mongoose.Types.ObjectId.isValid(collectionId)) {
      return res.status(400).json({ error: 'Invalid collectionId' });
    }
    query = { collectionId };
  }

  try {
    const cards = await Card.find(query).populate('collectionId');
    res.json(cards);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Create card
router.post('/', async (req, res) => {
  const { question, answer, collectionId } = req.body;

  try {
    let collection;

    if (collectionId) {
      collection = await Collection.findById(collectionId);
      if (!collection) {
        return res.status(400).json({ error: 'Collection not found' });
      }
    } else {
      return res.status(400).json({ error: 'Issue accessing collection' });
    }

    const newCard = await Card.create({
      question,
      answer,
      collectionId: collection._id
    });

    res.status(201).json(newCard);

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// Update card
router.put('/:id', async (req, res) => {
  const { id } = req.params
  const { question, answer, collectionId } = req.body

  try {
    const updatedCard = await Card.findByIdAndUpdate(
      id,
      { question, answer, collectionId },
      { new: true }
    )
    res.json(updatedCard)
  } catch (err) {
    res.status(500).json({ message: 'Could not update card' })
  }
})


// Delete card
router.delete('/:id', async (req, res) => {
  try {
    await Card.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
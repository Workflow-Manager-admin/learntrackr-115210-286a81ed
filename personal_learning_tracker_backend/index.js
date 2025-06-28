//
// Backend API for Personal Learning Tracker App
// Provides CRUD operations and filtering for learning topics (in-memory storage).
//
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 4000;

// Use middlewares
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

// Allowed status values for topics
const ALLOWED_STATUS = ['Not Started', 'In Progress', 'Completed'];

// In-memory data storage
/** @type {Array<{id: string, topic: string, status: string, targetDate?: string, notes?: string, category?: string, createdAt: string, updatedAt: string}>} */
let topics = [];

// PUBLIC_INTERFACE
/**
 * GET /topics
 * Fetch all topics, filterable by status and category.
 * Query params:
 *  - status (optional): Filter by status ('Not Started', 'In Progress', 'Completed')
 *  - category (optional): Filter by category (string)
 * Returns: Array of learning topics
 */
app.get('/topics', (req, res) => {
  let filtered = topics;
  const { status, category } = req.query;

  if (status && ALLOWED_STATUS.includes(status)) {
    filtered = filtered.filter(t => t.status === status);
  }
  if (category) {
    filtered = filtered.filter(t => (t.category || '').toLowerCase() === category.toLowerCase());
  }
  res.json(filtered);
});

// PUBLIC_INTERFACE
/**
 * GET /topics/:id
 * Fetch a single topic by ID.
 */
app.get('/topics/:id', (req, res) => {
  const topic = topics.find(t => t.id === req.params.id);
  if (!topic) {
    return res.status(404).json({ error: 'Topic not found' });
  }
  res.json(topic);
});

// PUBLIC_INTERFACE
/**
 * POST /topics
 * Create a new learning topic.
 * Required: topic, status
 * Optional: targetDate, notes, category
 * Returns: The created topic object.
 */
app.post('/topics', (req, res) => {
  const { topic, status, targetDate, notes, category } = req.body;
  if (!topic || !ALLOWED_STATUS.includes(status)) {
    return res.status(400).json({ error: 'Invalid topic name or status.' });
  }
  const now = new Date().toISOString();
  const newTopic = {
    id: uuidv4(),
    topic: topic.trim(),
    status,
    targetDate: targetDate || '',
    notes: notes || '',
    category: category || '',
    createdAt: now,
    updatedAt: now
  };
  topics.unshift(newTopic); // Add to the front for recent-first ordering
  res.status(201).json(newTopic);
});

// PUBLIC_INTERFACE
/**
 * PUT /topics/:id
 * Update an existing topic.
 * Accepts: topic, status, targetDate, notes, category (optional fields).
 * Returns: The updated topic object.
 */
app.put('/topics/:id', (req, res) => {
  const index = topics.findIndex(t => t.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Topic not found' });
  }
  const { topic, status, targetDate, notes, category } = req.body;
  if (status && !ALLOWED_STATUS.includes(status)) {
    return res.status(400).json({ error: 'Invalid status value.' });
  }
  const topicObj = topics[index];
  topics[index] = {
    ...topicObj,
    topic: typeof topic === 'string' ? topic : topicObj.topic,
    status: typeof status === 'string' ? status : topicObj.status,
    targetDate: typeof targetDate === 'string' ? targetDate : topicObj.targetDate,
    notes: typeof notes === 'string' ? notes : topicObj.notes,
    category: typeof category === 'string' ? category : topicObj.category,
    updatedAt: new Date().toISOString()
  };
  res.json(topics[index]);
});

// PUBLIC_INTERFACE
/**
 * PATCH /topics/:id/status
 * Update the status only (for quick status updates from dashboard/filter view).
 * Body: { status: string }
 * Returns: The updated topic object.
 */
app.patch('/topics/:id/status', (req, res) => {
  const index = topics.findIndex(t => t.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Topic not found' });
  }
  const { status } = req.body;
  if (!ALLOWED_STATUS.includes(status)) {
    return res.status(400).json({ error: 'Invalid status value.' });
  }
  topics[index].status = status;
  topics[index].updatedAt = new Date().toISOString();
  res.json(topics[index]);
});

// PUBLIC_INTERFACE
/**
 * DELETE /topics/:id
 * Delete a topic by ID.
 * Returns: { success: true }
 */
app.delete('/topics/:id', (req, res) => {
  const index = topics.findIndex(t => t.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Topic not found' });
  }
  topics.splice(index, 1);
  res.json({ success: true });
});

// PUBLIC_INTERFACE
/**
 * GET /status-options
 * Returns allowed status values for frontend dropdowns.
 */
app.get('/status-options', (req, res) => {
  res.json(ALLOWED_STATUS);
});

// PUBLIC_INTERFACE
/**
 * GET /progress
 * Returns: { total: number, notStarted: number, inProgress: number, completed: number }
 * For dashboard stats
 */
app.get('/progress', (req, res) => {
  const total = topics.length;
  const notStarted = topics.filter(t => t.status === 'Not Started').length;
  const inProgress = topics.filter(t => t.status === 'In Progress').length;
  const completed = topics.filter(t => t.status === 'Completed').length;
  res.json({ total, notStarted, inProgress, completed });
});

// Default root endpoint
app.get('/', (req, res) => {
  res.json({ message: "Personal Learning Tracker Backend API" });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Personal Learning Tracker backend running on port ${PORT}`);
});

import express from 'express';
import jwt from 'jsonwebtoken';
import Job from '../models/job.js';

const router = express.Router();

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, student) => {
    if (err) return res.sendStatus(403);
    req.student = student;
    next();
  });
}

router.get('/', authenticateToken, async (req, res) => {
  const { status, date } = req.query;
  let filter = { student: req.student.id };
  if (status) filter.status = status;
  if (date) filter.dateOfApplication = date;

  const jobs = await Job.find(filter).sort({ dateOfApplication: -1 });
  res.json(jobs);
});

router.post('/', authenticateToken, async (req, res) => {
  const job = new Job({ ...req.body, student: req.student.id });
  await job.save();
  res.status(201).json(job);
});

router.put('/:id', authenticateToken, async (req, res) => {
  const job = await Job.findOneAndUpdate(
    { _id: req.params.id, student: req.student.id },
    req.body,
    { new: true }
  );
  if (!job) return res.status(404).json({ message: 'Job not found' });
  res.json(job);
});

router.delete('/:id', authenticateToken, async (req, res) => {
  const job = await Job.findOneAndDelete({ _id: req.params.id, student: req.student.id });
  if (!job) return res.status(404).json({ message: 'Job not found' });
  res.status(204).send();
});

export default router;

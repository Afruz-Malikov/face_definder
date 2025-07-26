const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { detectFace } = require('./helpers/faceDetector');

const app = express();
const PORT = process.env.PORT || 4001;

const upload = multer({
  dest: path.join(__dirname, 'tmp'),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only images allowed'), false);
    }
    cb(null, true);
  },
});

app.get('/ping', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/detect', upload.single('photo'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  try {
    const result = await detectFace(req.file.path);
    fs.unlinkSync(req.file.path);
    res.status(200).send({ faceDetected: result });
  } catch (err) {
    console.error('Face detection error:', err);
    res.status(500).json({ error: 'Internal error' });
  }
});

app.listen(PORT, () => {
  console.log(`Face service running on port ${PORT}`);
});

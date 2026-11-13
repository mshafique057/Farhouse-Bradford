// Express Backend Server
import express from 'express';
import fs from 'fs';

const app = express();
app.use(express.json());
const DB_FILE = './cms_database.json';

app.get('/api/site', (req, res) => {
  if (fs.existsSync(DB_FILE)) return res.json(JSON.parse(fs.readFileSync(DB_FILE, 'utf-8')));
  return res.json({ brandName: 'BAO:G The Dining Residence', status: 'default' });
});

app.post('/api/site', (req, res) => {
  fs.writeFileSync(DB_FILE, JSON.stringify(req.body, null, 2));
  return res.json({ success: true, message: 'Saved to backend database!' });
});

app.listen(5000, () => console.log('Backend Server running on port 5000'));

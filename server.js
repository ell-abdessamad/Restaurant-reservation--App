const express = require('express');
const fs = require('fs');
const app = express();

app.use(express.json());
app.use(express.static('public'));

app.get('/api/reservations', (req, res) => {
  const data = JSON.parse(fs.readFileSync('reservations.json', 'utf8'));
  res.json(data);
});

app.post('/api/reservations', (req, res) => {
  const data = JSON.parse(fs.readFileSync('reservations.json', 'utf8'));
  // نتأكد أننا نستقبل نفس الأسماء المرسلة من الـ script.js
  data.push(req.body);
  fs.writeFileSync('reservations.json', JSON.stringify(data, null, 2));
  res.status(201).json({ message: 'Succès' });
});

app.listen(3000, () => console.log('Serveur lancé: http://localhost:3000'));

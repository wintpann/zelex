const express = require('express');
const cors = require('cors');

const PORT = 3000;

const app = express();
app.use(cors());

app.get('/tests', async (req, res) => {
  res.status(200).send('success\n');
});

app.listen(PORT, () => console.log('Test app is listening'));

const express = require('express');

const app = express();

app.get('/', (req, res) => {
  console.log('Request received');
  res.send('Hello World!!');
});

app.listen(5000, () => {
  console.log('Server is running on port ');
});
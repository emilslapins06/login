const express = require('express');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;
const DATA_FILE = './users.json';

app.use(cors());
app.use(bodyParser.json());

// nolasa lietotāju datus
const readUsers = () => {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE));
  } catch (err) {
    return [];
  }
};

// lasa lietotāju datus
const writeUsers = (users) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2));
};

// reģistrē jaunu lietotāju
app.post('/register', (req, res) => {
  const { username, password } = req.body;
  let users = readUsers();

  if (users.some(user => user.username === username)) {
    return res.status(400).json({ error: 'Username already exists' });
  }

  users.push({ username, password });
  writeUsers(users);
  res.json({ message: 'Registration successful!' });
});

// logino jaunu lietotāju
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  let users = readUsers();

  const user = users.find(user => user.username === username && user.password === password);
  if (user) {
    res.json({ message: 'Login successful!', user });
  } else {
    res.status(400).json({ error: 'Invalid username or password' });
  }
});

// sāk programmu
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

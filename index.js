const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

const fs = require('fs').promises;

app.get('/talker', async (req, res) => {
  fs.readFile('./talker.json', 'utf8')
    .then((data) => {
      const response = JSON.parse(data);
      if (!response || response.length === 0) {
        return res.status(200).send([]);
      }
      return res.status(200).json(response);
    })
    .catch((err) => res.status(500).json(err));
});

app.get('/talker/:id', async (req, res) => {
  fs.readFile('./talker.json', 'utf8')
    .then((data) => {
      const { id } = req.params;
      const talkerList = JSON.parse(data);
      const selectedtalker = talkerList.find((talker) => talker.id === Number(id));

      if (!selectedtalker) {
        return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
      }

      return res.status(200).json(selectedtalker);
    })
    .catch((err) => res.status(500).json(err));
});

const validateEmail = require('./middleware/validateEmail');
const validatePassword = require('./middleware/validatePassword');

function generateToken() {
  const token = Math.random().toString(16).slice(2) + Math.random().toString(16).slice(2);
  return token.substring(0, 16);
}

app.post(
  '/login',
  validateEmail,
  validatePassword,
  (_req, res) => {
    // solução adaptada do site:
    // https://stackoverflow.com/questions/10726909/random-alpha-numeric-string-in-javascript
    const token = generateToken();
    return res.status(200).json({ token });
  },
);

app.listen(PORT, () => {
  console.log('Online');
});

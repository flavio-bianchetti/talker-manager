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

const talkerFilePath = './talker.json';

const validateUserToken = require('./middleware/validateUserToken');
const validateName = require('./middleware/validateName');
const validateAge = require('./middleware/validateAge');
const validateTalk = require('./middleware/validateTalk');
const validateWatchedAtAndRate = require('./middleware/validateWatchedAtAndRate');
const validateEmail = require('./middleware/validateEmail');
const validatePassword = require('./middleware/validatePassword');
const verifyFileTalker = require('./middleware/verifyFileTalker');

let token = '';

// solução adaptada do site:
// https://stackoverflow.com/questions/10726909/random-alpha-numeric-string-in-javascript
function generateToken() {
  const newToken = Math.random().toString(16).slice(2) + Math.random().toString(16).slice(2);
  return newToken.substring(0, 16);
}

app.get('/talker', async (req, res) => {
  fs.readFile(talkerFilePath, 'utf8')
    .then((data) => {
      const response = JSON.parse(data);
      if (!response || response.length === 0) {
        return res.status(200).send([]);
      }
      return res.status(200).json(response);
    })
    .catch((err) => res.status(500).json(err));
});

app.get(
  '/talker/search',
  validateUserToken,
  verifyFileTalker,
  async (req, res) => {
    const { q } = req.query;
    fs.readFile(talkerFilePath, 'utf8')
      .then((data) => {
        const response = JSON.parse(data);
        if (!q || q.length === 0) {
            return res.status(200).send(response);
        }
        const filteredTalkerList = response.filter((talker) => 
          talker.name.toLowerCase().includes(q.toLowerCase()));
        if (filteredTalkerList.length === 0) {
          return res.status(200).send([]);
        }
        return res.status(200).json(filteredTalkerList);
      })
      .catch((err) => res.status(500).json(err));
  },
);

app.get('/talker/:id', async (req, res) => {
  fs.readFile(talkerFilePath, 'utf8')
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

app.post(
  '/login',
  validateEmail,
  validatePassword,
  (_req, res) => {
    token = generateToken();
    return res.status(200).json({ token: `${token}` });
  },
);

app.post(
  '/talker',
  validateUserToken,
  validateName,
  validateAge,
  validateTalk,
  validateWatchedAtAndRate,
  async (req, res) => {
    fs.readFile(talkerFilePath, 'utf8')
      .then((data) => {
        const talkerList = JSON.parse(data);
        const { name, age, talk } = req.body;
        const { watchedAt, rate } = talk;
        const newTalker = {
          id: talkerList.length + 1,
          name,
          age,
          talk: { watchedAt, rate },
        };
        talkerList.push(newTalker);
        fs.writeFile(talkerFilePath, JSON.stringify(talkerList), 'utf8');
        return res.status(201).send(newTalker);
      })
      .catch((err) => res.status(500).json(err));
  },
);

app.put(
  '/talker/:id',
  validateUserToken,
  validateName,
  validateAge,
  validateTalk,
  validateWatchedAtAndRate,
  async (req, res) => {
    fs.readFile(talkerFilePath, 'utf8')
      .then((data) => {
        const talkerList = JSON.parse(data);
        const { name, age, talk } = req.body;
        const { watchedAt, rate } = talk;
        const { id } = req.params;
        const talkerChange = {
          id: Number(id),
          name,
          age,
          talk: { watchedAt, rate },
        };
        const talkers = talkerList.filter((talker) => talker.id !== Number(id));
        fs.writeFile(talkerFilePath, JSON.stringify([...talkers, talkerChange]), 'utf8');
        return res.status(200).send(talkerChange);
      })
      .catch((err) => res.status(500).json(err));
  },
);

app.delete(
  '/talker/:id',
  validateUserToken,
  async (req, res) => {
    fs.readFile(talkerFilePath, 'utf8')
      .then((data) => {
        const talkerList = JSON.parse(data);
        const { id } = req.params;
        const talkers = talkerList.filter((talker) => talker.id !== Number(id));
        fs.writeFile(talkerFilePath, JSON.stringify(talkers), 'utf8');
        return res.status(204).end();
      })
      .catch((err) => res.status(500).json(err));
  },
);

app.listen(PORT, () => {
  console.log('Online');
});

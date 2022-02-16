const fs = require('fs').promises;

const talkerFilePath = './talker.json';

const verifyFileTalker = (_req, res, next) => {
  fs.readFile(talkerFilePath, 'utf8')
    .then((data) => {
      const response = JSON.parse(data);
      if (!response || response.length === 0) {
        return res.status(200).send([]);
      }
      next();
    })
    .catch((err) => res.status(500).json(err));
};

module.exports = verifyFileTalker;
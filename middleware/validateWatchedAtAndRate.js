const validateDateFormat = require('./validateDateFormat');

const validateWatchedAtAndRate = (req, res, next) => {
  const { talk } = req.body;
  const { watchedAt, rate } = talk;

  if (!validateDateFormat(watchedAt)) {
    return res.status(400).json({ message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"' });
  }

  if (rate < 1 || rate > 5) {
    return res.status(400).json({ message: 'O campo "rate" deve ser um inteiro de 1 à 5' });
  }

  next();
};

module.exports = validateWatchedAtAndRate;

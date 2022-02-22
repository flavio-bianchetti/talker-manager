// solução adaptada do site:
// https://stackoverflow.com/questions/10194464/javascript-dd-mm-yyyy-date-check
const validateDateFormat = (date) => {
  const dateFormat = /(0[1-9]|[12][0-9]|3[01])[/](0[1-9]|1[012])[/](19|20)\d\d/;
  if (!date.match(dateFormat)) {
    return false;
  }
  return true;
};

module.exports = validateDateFormat;

// solução adaptada do site:
// https://stackoverflow.com/questions/6177975/how-to-validate-date-with-format-mm-dd-yyyy-in-javascript
const validateDateFormat = (date) => {
  const dateFormat = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
  if (!date.match(dateFormat)) {
    return false;
  }
  return true;
};

module.exports = validateDateFormat;
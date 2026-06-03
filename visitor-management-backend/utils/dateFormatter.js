const formatDate = (date) => {
  return new Date(date).toISOString().replace('T', ' ').substring(0, 16);
};
module.exports = formatDate;

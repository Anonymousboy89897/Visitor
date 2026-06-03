const generateVisitorId = () => {
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  return `VIS-${randomPart}`;
};
module.exports = generateVisitorId;

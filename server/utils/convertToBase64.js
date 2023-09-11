const convertToBase64 = (file) => {
  // return une chaîne de caractère
  return `data:${file.mimetype};base64,${file.data.toString("base64")}`;
};

module.exports = convertToBase64;

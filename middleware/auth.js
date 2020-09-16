const jwt = require("jsonwebtoken");

//TODO Save key in env variable
const KEY = "SaveInsideEnvironmentVariableForProduction";

module.exports = function (req, res, next) {
  const token = req.header("x-auth-token");
  console.log("Running auth middleware"); //TODO Remove unnecessary log after testing
  if (!token) {
    console.log("access denied");
    return res.status(401).send("Access denied. No token provided.");
  }

  try {
    const decoded = jwt.verify(token, KEY);
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).send("Invalid token.");
  }
};

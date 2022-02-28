const jwt = require("jsonwebtoken")

require("dotenv").config()

const validateTokenFromHeader = (req, res, next) => {
  const token = req.params.token
  
  if (token == null) res.sendStatus(400).send("Token not present")

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) { 
      res.status(401).send("Token invalid")
    }
    else {
      req.user = user
      next()
    }
  })
}

module.exports = validateTokenFromHeader
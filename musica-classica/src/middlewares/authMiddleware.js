const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      erro: "Token não enviado"
    });
  }

  const token = authHeader.split(" ")[1];

  try {

    jwt.verify(token, process.env.JWT_SECRET);

    next();

  } catch {

    return res.status(401).json({
      erro: "Token inválido"
    });
  }
}

module.exports = authMiddleware;
require("dotenv").config();

console.log("JWT:");
console.log(process.env.JWT_SECRET);

const app = require("./app");

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
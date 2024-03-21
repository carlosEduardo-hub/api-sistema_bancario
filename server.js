// server.js

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken"); // Importe o módulo jsonwebtoken

const app = express();
const port = process.env.PORT || 5000;

// Middleware para analisar corpos de requisições JSON
app.use(bodyParser.json());

// Middleware para habilitar o CORS
app.use(cors());

// Simulação de usuários
const users = [
  { id: 1, name: "Usuário 1", email: "usuario1@example.com", password: "senha123" },
  { id: 2, name: "Usuário 2", email: "usuario2@example.com", password: "senha456" }
];

// Endpoint para autenticação
app.post("/api/sessions", (req, res) => {
  const { email, password } = req.body;

  // Verifica se existe um usuário com o email e senha fornecidos
  const user = users.find(user => user.email === email && user.password === password);

  if (!user) {
    return res.status(401).json({ error: "Credenciais inválidas" });
  }

  // Crie um token JWT válido
  const token = jwt.sign({ userId: user.id }, "seuSegredoJWT", { expiresIn: "1h" });

  // Retorna informações do usuário e o token JWT
  res.json({ user: { id: user.id, name: user.name, email: user.email }, token });
});

// Rota para registrar um novo usuário
app.post("/api/register", (req, res) => {
  const { name, email, password } = req.body;

  // Verifica se já existe um usuário com o mesmo email
  const existingUser = users.find(user => user.email === email);
  if (existingUser) {
    return res.status(400).json({ error: "Email já registrado" });
  }

  // Gera um novo ID para o usuário
  const id = users.length + 1;

  // Cria um novo usuário e o adiciona à lista de usuários
  const newUser = { id, name, email, password };
  users.push(newUser);

  // Retorna o novo usuário e um token JWT válido
  const token = jwt.sign({ userId: newUser.id }, "seuSegredoJWT", { expiresIn: "1h" });
  res.json({ user: { id: newUser.id, name: newUser.name, email: newUser.email }, token });
});

// Endpoint para obter usuários (simulação)
app.get("/api/users", (req, res) => {
  // Retorna todos os usuários (simulação)
  res.json(users.map(user => ({ id: user.id, name: user.name, email: user.email })));
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});

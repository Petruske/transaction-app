const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

let transactions = [];
let nextId = 1;

app.get("/api/transactions", (req, res) => {
  res.status(200).json(transactions);
});

app.post("/api/transactions", (req, res) => {
  const { amount, description } = req.body;

  if (
    typeof amount !== "number" ||
    !Number.isFinite(amount) ||
    amount <= 0 ||
    typeof description !== "string" ||
    description.trim() === ""
  ) {
    return res.status(400).json({
      error: "El monto debe ser positivo y la descripción es obligatoria.",
    });
  }

  const transaction = {
    id: nextId++,
    amount,
    description: description.trim(),
  };

  transactions.push(transaction);
  res.status(201).json(transaction);
});

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});

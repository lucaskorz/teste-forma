import express from "express";
import { makeCalculateInstallmentsController } from "./presentation/factories/installment/makeCalculateInstallmentsController.js";

const app = express();

app.use(express.json());

app.post("/parcelas", (req, res) => {
  makeCalculateInstallmentsController().handler(req, res);
});

app.listen(5000, () => {
  console.log("Servidor rodando em http://localhost:5000");
});
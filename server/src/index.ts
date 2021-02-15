import express from "express";
import bodyParser from "body-parser";
import router from "./router";
var cors = require('cors')
require('dotenv').config()

const app = express();

const PORT = process.env.PORT || 4000;
app.use(cors());
app.use(bodyParser.json());

app.use("/api/", router);

app.get("/health", (req, res) => res.send({ status: "alive!" }));

app.use((err, req, res, next) => {
  res.status(404).json({
    error: {
      message: err.message,
    },
  });
});

app.listen(PORT, () =>
  console.log(`⚡Server is running 👉 https://localhost:${PORT}`)
);

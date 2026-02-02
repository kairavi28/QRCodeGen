const express = require("express");
const path = require("path");
const { initDb } = require("./db");
const productsRouter = require("./routes/products");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use("/api/products", productsRouter);

app.use(express.static(path.join(__dirname, "../qrcode-generator/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../qrcode-generator/build", "index.html"));
});

initDb()
  .then(() => {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to initialize database:", err);
    process.exit(1);
  });

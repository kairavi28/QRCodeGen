const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const productsRouter = require("./routes/products");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use("/api/products", productsRouter);

app.use(express.static(path.join(__dirname, "../qrcode-generator/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../qrcode-generator/build", "index.html"));
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);
  });

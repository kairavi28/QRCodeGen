const express = require("express");
const { pool } = require("../db");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { productName, productLink, location, serviceHistory } = req.body;

    const result = await pool.query(
      `INSERT INTO products (product_name, product_link, location_address, location_lat, location_lng)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [
        productName,
        productLink || null,
        location?.address || null,
        location?.lat || null,
        location?.lng || null,
      ]
    );

    const product = result.rows[0];

    if (serviceHistory && serviceHistory.length > 0) {
      for (const service of serviceHistory) {
        await pool.query(
          `INSERT INTO service_history (product_id, serviced_by, serviced_on, notes)
           VALUES ($1, $2, $3, $4)`,
          [product.id, service.servicedBy, service.servicedOn || null, service.notes || null]
        );
      }
    }

    const fullProduct = await getProductWithHistory(product.id);
    res.json(fullProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Failed to create product" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const product = await getProductWithHistory(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Failed to fetch product" });
  }
});

router.post("/:id/service", async (req, res) => {
  try {
    const { servicedBy, servicedOn, notes } = req.body;

    const productCheck = await pool.query("SELECT id FROM products WHERE id = $1", [req.params.id]);
    if (productCheck.rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    await pool.query(
      `INSERT INTO service_history (product_id, serviced_by, serviced_on, notes)
       VALUES ($1, $2, $3, $4)`,
      [req.params.id, servicedBy, servicedOn || null, notes || null]
    );

    const product = await getProductWithHistory(req.params.id);
    res.json(product);
  } catch (error) {
    console.error("Error adding service record:", error);
    res.status(500).json({ message: "Failed to add service record" });
  }
});

async function getProductWithHistory(id) {
  const productResult = await pool.query("SELECT * FROM products WHERE id = $1", [id]);
  if (productResult.rows.length === 0) return null;

  const product = productResult.rows[0];

  const historyResult = await pool.query(
    "SELECT * FROM service_history WHERE product_id = $1 ORDER BY created_at ASC",
    [id]
  );

  return {
    _id: product.id.toString(),
    id: product.id,
    productName: product.product_name,
    productLink: product.product_link,
    location: {
      address: product.location_address,
      lat: product.location_lat ? parseFloat(product.location_lat) : null,
      lng: product.location_lng ? parseFloat(product.location_lng) : null,
    },
    serviceHistory: historyResult.rows.map((row) => ({
      id: row.id,
      servicedBy: row.serviced_by,
      servicedOn: row.serviced_on,
      notes: row.notes,
    })),
    createdAt: product.created_at,
  };
}

module.exports = router;

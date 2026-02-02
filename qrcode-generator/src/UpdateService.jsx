import React, { useState } from "react";
import { Box, TextField, Typography, Paper, Button, Alert, CircularProgress } from "@mui/material";
import { addServiceRecord, getProductById } from "./api/products";

export default function UpdateService() {
  const [productId, setProductId] = useState("");
  const [productInfo, setProductInfo] = useState(null);
  const [servicedBy, setServicedBy] = useState("");
  const [servicedOn, setServicedOn] = useState("");
  const [loading, setLoading] = useState(false);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleLookup = async () => {
    if (!productId.trim()) {
      setMessage({ type: "error", text: "Please enter a product ID" });
      return;
    }

    setLookupLoading(true);
    setMessage({ type: "", text: "" });
    setProductInfo(null);

    try {
      const product = await getProductById(productId.trim());
      if (product && product._id) {
        setProductInfo(product);
        setMessage({ type: "success", text: `Found product: ${product.productName}` });
      } else {
        setMessage({ type: "error", text: "Product not found" });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Failed to lookup product" });
    } finally {
      setLookupLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!productInfo) {
      setMessage({ type: "error", text: "Please lookup a product first" });
      return;
    }

    if (!servicedBy.trim() || !servicedOn.trim()) {
      setMessage({ type: "error", text: "Please fill in all service details" });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      await addServiceRecord(productInfo._id, {
        servicedBy: servicedBy.trim(),
        servicedOn: servicedOn.trim(),
      });

      setMessage({ type: "success", text: "Service record added successfully!" });
      setServicedBy("");
      setServicedOn("");
      
      const updatedProduct = await getProductById(productInfo._id);
      setProductInfo(updatedProduct);
    } catch (err) {
      setMessage({ type: "error", text: "Failed to add service record" });
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setProductId("");
    setProductInfo(null);
    setServicedBy("");
    setServicedOn("");
    setMessage({ type: "", text: "" });
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f4f6f8",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 2,
      }}
    >
      <Paper sx={{ p: 4, maxWidth: 500, width: "100%" }}>
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <img
            src="/biomed-logo.png"
            alt="Biomed Logo"
            style={{ height: 60, marginBottom: 8 }}
          />
          <Typography variant="h5">Update Service History</Typography>
        </Box>

        {message.text && (
          <Alert severity={message.type} sx={{ mb: 2 }}>
            {message.text}
          </Alert>
        )}

        <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
          <TextField
            label="Product ID"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            fullWidth
            placeholder="Enter product ID from QR code"
          />
          <Button
            variant="outlined"
            onClick={handleLookup}
            disabled={lookupLoading}
            sx={{ minWidth: 100 }}
          >
            {lookupLoading ? <CircularProgress size={24} /> : "Lookup"}
          </Button>
        </Box>

        {productInfo && (
          <Box sx={{ mb: 3, p: 2, bgcolor: "#e8f5e9", borderRadius: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              {productInfo.productName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Location: {productInfo.location?.address || "N/A"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Services: {productInfo.serviceHistory?.length || 0}
            </Typography>
          </Box>
        )}

        <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
          New Service Record
        </Typography>

        <TextField
          label="Service Date"
          type="date"
          value={servicedOn}
          onChange={(e) => setServicedOn(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
          InputLabelProps={{ shrink: true }}
          disabled={!productInfo}
        />

        <TextField
          label="Technician Name"
          value={servicedBy}
          onChange={(e) => setServicedBy(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
          placeholder="Name of service technician"
          disabled={!productInfo}
        />

        <Button
          variant="contained"
          fullWidth
          onClick={handleSubmit}
          disabled={!productInfo || loading}
          sx={{ mb: 1 }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Add Service Record"}
        </Button>

        <Button
          variant="text"
          fullWidth
          onClick={handleClear}
          color="secondary"
        >
          Clear & Start Over
        </Button>
      </Paper>
    </Box>
  );
}

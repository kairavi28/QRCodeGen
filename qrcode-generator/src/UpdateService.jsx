import React, { useState } from "react";
import { Box, TextField, Typography, Paper, Button, Alert, CircularProgress, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { addServiceRecord, getProductById, searchProductsByName } from "./api/products";

export default function UpdateService() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [productInfo, setProductInfo] = useState(null);
  const [servicedBy, setServicedBy] = useState("");
  const [servicedOn, setServicedOn] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setMessage({ type: "error", text: "Please enter a product name" });
      return;
    }

    setSearchLoading(true);
    setMessage({ type: "", text: "" });
    setSearchResults([]);
    setProductInfo(null);

    try {
      const results = await searchProductsByName(searchQuery.trim());
      if (results.length === 0) {
        setMessage({ type: "warning", text: "No products found" });
      } else {
        setSearchResults(results);
      }
    } catch (err) {
      setMessage({ type: "error", text: "Failed to search products" });
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSelectProduct = (product) => {
    setProductInfo(product);
    setSearchResults([]);
    setMessage({ type: "success", text: `Selected: ${product.productName}` });
  };

  const handleSubmit = async () => {
    if (!productInfo) {
      setMessage({ type: "error", text: "Please select a product first" });
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
    setSearchQuery("");
    setSearchResults([]);
    setProductInfo(null);
    setServicedBy("");
    setServicedOn("");
    setMessage({ type: "", text: "" });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? dateString : date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
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

        {!productInfo && (
          <>
            <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
              <TextField
                label="Search by Product Name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                fullWidth
                placeholder="Type product name..."
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
              <Button
                variant="outlined"
                onClick={handleSearch}
                disabled={searchLoading}
                sx={{ minWidth: 100 }}
              >
                {searchLoading ? <CircularProgress size={24} /> : "Search"}
              </Button>
            </Box>

            {searchResults.length > 0 && (
              <Paper variant="outlined" sx={{ mb: 2, maxHeight: 200, overflow: "auto" }}>
                <List dense>
                  {searchResults.map((product) => (
                    <ListItem key={product._id} disablePadding>
                      <ListItemButton onClick={() => handleSelectProduct(product)}>
                        <ListItemText
                          primary={product.productName}
                          secondary={product.location?.address || "No location"}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Paper>
            )}
          </>
        )}

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
            {productInfo.serviceHistory?.length > 0 && (
              <Typography variant="body2" color="text.secondary">
                Last Service: {formatDate(productInfo.serviceHistory[productInfo.serviceHistory.length - 1]?.servicedOn)}
              </Typography>
            )}
            <Button
              size="small"
              onClick={() => {
                setProductInfo(null);
                setSearchQuery("");
              }}
              sx={{ mt: 1 }}
            >
              Change Product
            </Button>
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

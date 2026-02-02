import React, { useState, useRef, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Box, TextField, Typography, Paper, Button } from "@mui/material";
import { createProduct } from "./api/products";

export default function QRCodeGenerator() {
  const [productId, setProductId] = useState(null);
  const [productName, setProductName] = useState("");
  const [lastServiced, setLastServiced] = useState("");
  const [servicedBy, setServicedBy] = useState("");
  const [productLink, setProductLink] = useState("");
  const [location, setLocation] = useState({ address: "", lat: "", lng: "" });
  const autocompleteRef = useRef(null);

  // Save product to DB
  const handleSave = async () => {
    const saved = await createProduct({
      productName,
      productLink,
      location,
      serviceHistory: [
        {
          servicedBy,
          servicedOn: lastServiced,
        },
      ],
    });

    setProductId(saved._id);
  };

  // Google Places Autocomplete
  useEffect(() => {
    if (window.google && autocompleteRef.current) {
      const autocomplete = new window.google.maps.places.Autocomplete(
        autocompleteRef.current,
        { types: ["geocode"] }
      );

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (place.geometry) {
          setLocation({
            address: place.formatted_address,
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          });
        }
      });
    }
  }, []);

  const generateQRCodeValue = () => {
    if (!productId) return "";
    return `https://service.biomedwaste.net/service-info/${productId}`;
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
        <Box sx={{ textAlign: "center", mb: 2 }}>
          <img
            src="/biomed-logo.png"
            alt="Biomed Logo"
            style={{ height: 60, marginBottom: 8 }}
          />
          <Typography variant="h4">QR Code Generator</Typography>
        </Box>

        <TextField
          label="Product Name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />

        <TextField
          label="Last Serviced"
          type="date"
          value={lastServiced}
          onChange={(e) => setLastServiced(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
          InputLabelProps={{ shrink: true }}
        />

        <TextField
          label="Serviced By"
          value={servicedBy}
          onChange={(e) => setServicedBy(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />

        <TextField
          inputRef={autocompleteRef}
          label="Location"
          placeholder="Start typing address..."
          fullWidth
          sx={{ mb: 2 }}
        />

        <TextField
          label="Product Link"
          value={productLink}
          onChange={(e) => setProductLink(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />

        <Button
          variant="contained"
          fullWidth
          onClick={handleSave}
          disabled={!productName || !location.address}
        >
          Save Product & Generate QR
        </Button>

        {productId && (
          <Box sx={{ textAlign: "center", mt: 3 }}>
            <QRCodeCanvas
              value={generateQRCodeValue()}
              size={220}
              includeMargin
            />
            <Typography sx={{ mt: 1 }}>
              Scan to view service info
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
}

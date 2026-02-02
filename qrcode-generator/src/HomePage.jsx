import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Paper, Button, Grid } from "@mui/material";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import BuildIcon from "@mui/icons-material/Build";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #003366 0%, #0066cc 50%, #004d99 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 3,
      }}
    >
      <Paper
        elevation={10}
        sx={{
          p: 5,
          maxWidth: 600,
          width: "100%",
          borderRadius: 4,
          textAlign: "center",
        }}
      >
        <Box sx={{ mb: 4 }}>
          <img
            src="/biomed-logo.png"
            alt="Biomed Logo"
            style={{ height: 80, marginBottom: 16 }}
          />
          <Typography variant="h4" fontWeight="bold" color="#003366" gutterBottom>
            Biomed QR Service Portal
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your biomedical waste products and service records
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Paper
              elevation={4}
              sx={{
                p: 3,
                borderRadius: 3,
                cursor: "pointer",
                transition: "all 0.3s ease",
                background: "linear-gradient(145deg, #ffffff, #f0f4f8)",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 12px 24px rgba(0,51,102,0.2)",
                },
              }}
              onClick={() => navigate("/generate")}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #0066cc, #003366)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mx: "auto",
                  mb: 2,
                }}
              >
                <QrCode2Icon sx={{ fontSize: 40, color: "white" }} />
              </Box>
              <Typography variant="h6" fontWeight="bold" color="#003366" gutterBottom>
                Generate QR Code
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Generate QR codes for tracking
              </Typography>
              <Button
                variant="contained"
                fullWidth
                sx={{
                  mt: 2,
                  bgcolor: "#003366",
                  "&:hover": { bgcolor: "#004d99" },
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/generate");
                }}
              >
                Create New
              </Button>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Paper
              elevation={4}
              sx={{
                p: 3,
                borderRadius: 3,
                cursor: "pointer",
                transition: "all 0.3s ease",
                background: "linear-gradient(145deg, #ffffff, #f0f4f8)",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 12px 24px rgba(0,102,51,0.2)",
                },
              }}
              onClick={() => navigate("/update-service")}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #28a745, #1e7e34)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mx: "auto",
                  mb: 2,
                }}
              >
                <BuildIcon sx={{ fontSize: 40, color: "white" }} />
              </Box>
              <Typography variant="h6" fontWeight="bold" color="#1e7e34" gutterBottom>
                Update Service
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Add service records to existing products
              </Typography>
              <Button
                variant="contained"
                fullWidth
                sx={{
                  mt: 2,
                  bgcolor: "#28a745",
                  "&:hover": { bgcolor: "#1e7e34" },
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/update-service");
                }}
              >
                Update Now
              </Button>
            </Paper>
          </Grid>
        </Grid>

        <Typography variant="caption" color="text.secondary" sx={{ mt: 4, display: "block" }}>
          © {new Date().getFullYear()} Biomed Recovery & Disposal Ltd.
        </Typography>
      </Paper>
    </Box>
  );
}

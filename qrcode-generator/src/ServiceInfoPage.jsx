import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, Button, Card, CardContent, Divider, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { getProductById } from "./api/products";

export default function ServiceInfoPage() {
  const { productId } = useParams();
  const [serviceData, setServiceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (productId) {
      setLoading(true);
      getProductById(productId)
        .then((data) => {
          setServiceData(data);
          setLoading(false);
        })
        .catch((err) => {
          setError("Failed to load product information");
          setLoading(false);
        });
    } else {
      setLoading(false);
      setError("No product ID provided");
    }
  }, [productId]);

  const handleDownloadPDF = () => {
    const input = document.getElementById("service-card");
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${serviceData?.productName || "service-info"}.pdf`);
    });
  };

  const mapSrc = serviceData?.location
    ? serviceData.location.lat && serviceData.location.lng
      ? `https://www.google.com/maps?q=${serviceData.location.lat},${serviceData.location.lng}&z=15&output=embed`
      : `https://www.google.com/maps?q=${encodeURIComponent(serviceData.location.address)}&z=15&output=embed`
    : null;

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? dateString : date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !serviceData) {
    return (
      <Box sx={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", p: 2 }}>
        <Card elevation={3} sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6" color="error">{error || "Product not found"}</Typography>
        </Card>
      </Box>
    );
  }

  const latestService = serviceData.serviceHistory && serviceData.serviceHistory.length > 0
    ? serviceData.serviceHistory[serviceData.serviceHistory.length - 1]
    : null;

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f9fafb", display: "flex", justifyContent: "center", alignItems: "center", p: 2 }}>
      <Card id="service-card" elevation={5} sx={{ maxWidth: 600, width: "100%", borderRadius: 4, overflow: "hidden" }}>
        <Box sx={{ bgcolor: "#003366", color: "white", textAlign: "center", py: 3 }}>
          <img src="/biomed-logo.png" alt="Biomed Logo" style={{ height: 60, marginBottom: 8 }} />
          <Typography variant="h6">Serviced by Biomed Recovery & Disposal Ltd.</Typography>
        </Box>

        <CardContent>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            {serviceData.productName || "Product Name"}
          </Typography>
          <Divider sx={{ mb: 2 }} />

          {latestService && (
            <Box sx={{ mb: 3, p: 2, bgcolor: "#e3f2fd", borderRadius: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold" color="primary">
                Latest Service
              </Typography>
              <Typography variant="body1">
                <strong>Serviced On:</strong> {formatDate(latestService.servicedOn)}
              </Typography>
              <Typography variant="body1">
                <strong>Technician:</strong> {latestService.servicedBy || "N/A"}
              </Typography>
            </Box>
          )}

          {serviceData.serviceHistory && serviceData.serviceHistory.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Service History
              </Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                      <TableCell><strong>#</strong></TableCell>
                      <TableCell><strong>Serviced On</strong></TableCell>
                      <TableCell><strong>Serviced By</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {serviceData.serviceHistory.slice().reverse().map((service, index) => (
                      <TableRow key={index} sx={{ "&:nth-of-type(odd)": { bgcolor: "#fafafa" } }}>
                        <TableCell>{serviceData.serviceHistory.length - index}</TableCell>
                        <TableCell>{formatDate(service.servicedOn)}</TableCell>
                        <TableCell>{service.servicedBy || "N/A"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {serviceData.location?.address && (
            <>
              <Typography variant="body1" sx={{ mt: 2, mb: 1 }}>
                <strong>Location:</strong> {serviceData.location.address}
              </Typography>

              {mapSrc && (
                <Box sx={{ position: "relative", pb: "56.25%", height: 0, overflow: "hidden", borderRadius: 2, mb: 2 }}>
                  <iframe
                    title="Google Map"
                    src={mapSrc}
                    style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: 0 }}
                    allowFullScreen
                    loading="lazy"
                  />
                </Box>
              )}
            </>
          )}

          {serviceData.productLink && (
            <Button variant="contained" color="primary" href={serviceData.productLink} target="_blank" fullWidth sx={{ mt: 2 }}>
              View Product
            </Button>
          )}

          <Button variant="outlined" color="secondary" fullWidth sx={{ mt: 2 }} onClick={handleDownloadPDF}>
            Download PDF
          </Button>
        </CardContent>

        <Box sx={{ bgcolor: "#f1f5f9", py: 1, textAlign: "center" }}>
          <Typography variant="caption" color="text.secondary">
            © {new Date().getFullYear()} Biomed Recovery & Disposal Ltd.
          </Typography>
        </Box>
      </Card>
    </Box>
  );
}

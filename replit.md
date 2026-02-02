# QRCodeGen-Biomed

## Overview

This is a React-based QR code generator application for biomedical waste management. The application has two operational modes controlled by an environment variable:

- **INTERNAL mode**: Provides access to a QR code generator interface and service information pages
- **EXTERNAL mode**: Only exposes service information pages for public/customer access

The primary purpose is to generate QR codes for products and track their service history through a connected backend API.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

- **Framework**: React 19.1 with Create React App (react-scripts 5.0.1)
- **Routing**: React Router DOM v7 for client-side navigation
- **UI Library**: Material UI (MUI) v7 with Emotion for styling
- **QR Code Generation**: qrcode.react library for rendering QR codes
- **PDF/Export**: jsPDF and html2canvas for document generation capabilities

### Application Structure

```
src/
├── App.js              # Main router with mode-based routing
├── QRCodeGenerator.js  # Internal QR code creation interface
├── ServiceInfoPage.js  # Product service information display
└── api/
    └── products.js     # API client for backend communication
```

### Mode-Based Routing

The application uses `REACT_APP_MODE` environment variable to determine available routes:
- Internal users get the QR generator at root path
- External users are directed to service info pages only

### Service History Feature

The application supports full service history tracking:
- **QR Code Stability**: QR codes are generated using the product ID (`/service-info/:productId`), so the code remains the same even when service details are updated
- **Service History Display**: The ServiceInfoPage fetches product data by ID from the API and displays:
  - Latest service details (highlighted at top)
  - Complete service history in a table format with service date and technician name
- **Dynamic Data**: Service history is fetched fresh from the API each time the QR code is scanned

### External API Integration

The frontend communicates with a backend API at `https://api.biomedwaste.net/api/products` for:
- Creating new products (`POST /api/products`)
- Fetching product details by ID (`GET /api/products/:id`)
- Adding service records (`POST /api/products/:id/service`)

## External Dependencies

### Third-Party Services

| Service | Purpose | Configuration |
|---------|---------|---------------|
| Google Maps API | Location/places functionality | API key embedded in public/index.html |
| Biomedwaste API | Product and service record management | Hardcoded base URL in api/products.js |

### Key NPM Packages

- **@mui/material + @emotion**: UI components and styling
- **qrcode.react**: QR code rendering
- **jspdf + html2canvas**: PDF generation and canvas capture
- **react-router-dom**: Client-side routing
- **dotenv**: Environment variable management

### Environment Variables

| Variable | Purpose | Default |
|----------|---------|---------|
| `REACT_APP_MODE` | Controls app mode (INTERNAL/EXTERNAL) | INTERNAL |

### Running the Application

```bash
cd qrcode-generator
npm install
npm start
```

The development server runs on port 5000 in the Replit environment.
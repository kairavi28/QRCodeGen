# QRCodeGen-Biomed

## Overview

This is a full-stack QR code generator application for biomedical waste management. The application has two operational modes controlled by an environment variable:

- **INTERNAL mode**: Provides access to a QR code generator interface, update service page, and service information pages
- **EXTERNAL mode**: Only exposes service information pages for public/customer access

The primary purpose is to generate QR codes for products and track their service history through the integrated backend.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Full Stack Architecture

- **Backend**: Node.js with Express server
- **Database**: PostgreSQL (Replit built-in)
- **Frontend**: React 19.1 with Create React App
- **UI Library**: Material UI (MUI) v7 with Emotion for styling
- **QR Code Generation**: qrcode.react library for rendering QR codes
- **PDF/Export**: jsPDF and html2canvas for document generation capabilities

### Project Structure

```
/
├── server/
│   ├── index.js         # Express server entry point
│   ├── db.js            # PostgreSQL database connection and init
│   └── routes/
│       └── products.js  # Product API routes
├── qrcode-generator/
│   ├── src/
│   │   ├── App.js              # Main router with mode-based routing
│   │   ├── QRCodeGenerator.jsx # Internal QR code creation interface
│   │   ├── ServiceInfoPage.jsx # Product service information display
│   │   ├── UpdateService.jsx   # Add new service records to existing products
│   │   └── api/
│   │       └── products.js     # API client for backend communication
│   └── build/                  # Production build served by Express
└── package.json                # Root package with server dependencies
```

### Internal Pages

| Route | Purpose |
|-------|---------|
| `/` | QR Code Generator - create new products and generate QR codes |
| `/update-service` | Update Service History - add new service records to existing products |
| `/service-info/:id` | Service Info Page - view product details and service history |

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

### API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/products` | Create new product |
| GET | `/api/products/:id` | Get product by ID (for QR scan) |
| POST | `/api/products/:id/service` | Add service record to product |

### Database Schema

**products table:**
- id (SERIAL PRIMARY KEY)
- product_name (VARCHAR)
- product_link (TEXT)
- location_address (TEXT)
- location_lat (DECIMAL)
- location_lng (DECIMAL)
- created_at (TIMESTAMP)

**service_history table:**
- id (SERIAL PRIMARY KEY)
- product_id (INTEGER, references products)
- serviced_by (VARCHAR)
- serviced_on (DATE)
- notes (TEXT)
- created_at (TIMESTAMP)

## External Dependencies

### Third-Party Services

| Service | Purpose | Configuration |
|---------|---------|---------------|
| Google Maps API | Location/places functionality | API key embedded in public/index.html |

### Key NPM Packages

**Backend:**
- **express**: Web framework
- **pg**: PostgreSQL client

**Frontend:**
- **@mui/material + @emotion**: UI components and styling
- **qrcode.react**: QR code rendering
- **jspdf + html2canvas**: PDF generation and canvas capture
- **react-router-dom**: Client-side routing

### Environment Variables

| Variable | Purpose | Default |
|----------|---------|---------|
| `REACT_APP_MODE` | Controls app mode (INTERNAL/EXTERNAL) | INTERNAL |
| `DATABASE_URL` | PostgreSQL connection string | Auto-configured by Replit |
| `PORT` | Server port | 5000 |

### Running the Application

The application runs as a single Express server that serves both the API and the built React frontend:

```bash
npm install           # Install backend dependencies
cd qrcode-generator && npm install  # Install frontend dependencies
cd qrcode-generator && npm run build  # Build frontend
node server/index.js  # Start server on port 5000
```

The server runs on port 5000 and serves the React build at the root path.

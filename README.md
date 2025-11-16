# 🔍 TrueCheck: Enterprise Product Verification & Supply Chain Platform

<div align="center">

![TrueCheck](https://img.shields.io/badge/TrueCheck-Enterprise_Platform-blue?style=for-the-badge&logo=shield-check)
![Architecture](https://img.shields.io/badge/Microservices--Ready-Scalable_Architecture-green?style=for-the-badge)
![Backend](https://img.shields.io/badge/Node.js_Express-MongoDB_Atlas-important?style=for-the-badge)

**Enterprise-Grade Supply Chain Verification with Real-Time Authentication & Blockchain-Ready Architecture**

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-Vercel_Deployed-8A2BE2?style=for-the-badge&logo=vercel)](https://product-verification-two.vercel.app)
[![API Docs](https://img.shields.io/badge/📚_API_Documentation-Swagger_OpenAPI-orange?style=for-the-badge)](#api-documentation)

</div>

## 🎯 Overview

TrueCheck is a comprehensive **enterprise-grade product verification system** that enables seamless product authentication through QR code scanning. This platform provides real-time supply chain tracking, multi-role access control, and blockchain-ready architecture for immutable verification records.

## ✨ Key Features

### 🔐 Multi-Role Authentication System
- **Company Users**: Add products, manage batches, and track supply chain movements
- **Retailer Users**: Verify products, update inventory status, and scan items  
- **Customer Users**: Authenticate products and view verification history

### 📱 Advanced QR Code Processing
- **Dual Scanning Modes**: Camera-based QR scanning + manual code entry
- **Real-time Verification**: Instant product authentication with detailed results
- **Batch Management**: Track multiple product batches with expiration dates

### 🌐 Supply Chain Transparency
- **Product Journey Tracking**: Visual timeline of product movement from manufacturer to customer
- **Geolocation Tagging**: Automatic location capture for transfer events
- **Real-time Updates**: Live synchronization across all user roles

### 📊 Dashboard Analytics
- **Role-specific Dashboards**: Customized interfaces for companies, retailers, and customers
- **Verification Statistics**: Track authentic vs. counterfeit detection rates
- **Scan History**: Comprehensive log of all verification activities

## 🏗️ System Architecture

### High-Level Architecture
```
Frontend Layer (React.js) → API Gateway → Microservices Core → Data Layer
```

### Core Components
- **React.js Frontend**: Responsive PWA with real-time updates
- **Node.js/Express Backend**: RESTful API with JWT authentication
- **MongoDB Atlas**: Scalable document database
- **Redis**: High-performance caching layer
- **Firebase**: Real-time database and file storage
- **Socket.io**: WebSocket connections for live updates

## 🛠️ Tech Stack

### Frontend
- **React.js 18+** with Hooks and Context API
- **Tailwind CSS** for responsive design
- **React Router** for navigation
- **Axios** for API communication
- **jsQR** for QR code processing

### Backend
- **Node.js** with Express.js framework
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Redis** for caching and sessions
- **Socket.io** for real-time features

### Infrastructure
- **Vercel** for frontend deployment
- **MongoDB Atlas** for database hosting
- **Redis Cloud** for caching service
- **Firebase** for authentication and storage

## 📸 Screenshots

| Company Dashboard | Product Management | QR Scanning |
|-------------------|-------------------|-------------|
| <img src="https://github.com/user-attachments/assets/8c4e2a60-3238-4bee-b8f0-3cd8dbc28c25" width="300" /> | <img src="https://github.com/user-attachments/assets/ccb9e6b6-b468-4835-9588-837b2b99d642" width="300" /> | <img src="https://github.com/user-attachments/assets/f5709f2e-0d20-416e-883c-6153ca9049a8" width="300" /> |

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Firebase project

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/hack-09/product-verification.git
   cd product-verification
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start development server**
   ```bash
   npm start
   ```

### Environment Configuration
```env
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_MONGODB_URI=your_mongodb_connection_string
```

## 📖 Usage Guide

### For Companies
1. Register/Login as a company user
2. Add products with details and specifications
3. Create batches with manufacturing dates
4. Track products through supply chain
5. Monitor verification analytics

### For Retailers
1. Scan product QR codes for verification
2. Update inventory status
3. Record product transfers
4. View scan history and reports

### For Customers
1. Verify product authenticity via QR scan
2. View product journey and details
3. Check verification history
4. Report suspicious products

## 🔌 API Documentation

### Authentication Endpoints
- `POST /api/auth/login` - User authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/refresh` - Refresh token

### Product Management
- `GET /api/products` - List products
- `POST /api/products` - Create product
- `GET /api/products/:id` - Product details
- `PUT /api/products/:id` - Update product

### Verification Services
- `POST /api/verify/scan` - QR code verification
- `POST /api/verify/manual` - Manual code verification
- `GET /api/verify/history` - Verification history

## 🗃️ Database Schema

### Core Collections
- **Users**: User accounts and profiles
- **Products**: Product information and specifications
- **Batches**: Manufacturing batches and expiry dates
- **VerificationEvents**: Scan history and verification records
- **SupplyChainEvents**: Product movement tracking

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email priyanshukumar9780@email.com or open an issue on GitHub.

## 🎯 Roadmap

### Phase 1 (Completed)
- [x] Multi-role authentication system
- [x] QR code scanning and verification
- [x] Supply chain tracking
- [x] Real-time dashboard

### Phase 2 (In Progress)
- [ ] Mobile app development
- [ ] Advanced analytics dashboard
- [ ] Bulk product upload
- [ ] API rate limiting

### Phase 3 (Planned)
- [ ] Blockchain integration
- [ ] Machine learning for counterfeit detection
- [ ] Multi-language support
- [ ] Third-party API integrations

---

<div align="center">

### ⭐ Star this repository if you find it helpful!

**Built with ❤️ using modern web technologies**

</div>


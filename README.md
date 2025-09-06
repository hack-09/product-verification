# 🏷️ Product Verification System (QR Code Scanner)

## 📌 Overview

The **Product Verification System** is a comprehensive web application built with **React.js** that enables seamless product authentication through QR code scanning. This enterprise-grade solution provides real-time product verification, supply chain tracking, and multi-role access control. Built with modern web technologies and deployed on **Vercel**, it demonstrates expertise in **frontend development, real-time camera integration, Firebase backend services, and responsive design**.

---

## ✨ Enhanced Features

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

### 🎨 Modern UI/UX Design
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Intuitive Navigation**: Role-based sidebar with quick access to key features
- **Visual Feedback**: Clear status indicators, loading states, and error handling

---

## 🛠️ Enhanced Tech Stack

### Frontend
- **React.js** with Hooks for state management
- **React Router** for navigation
- **Tailwind CSS** for responsive styling
- **Heroicons** for consistent iconography

### Backend Services
- **Firebase Firestore** for real-time database
- **Firebase Authentication** for secure user management
- **Firebase Storage** for product image uploads

### QR Code Processing
- **jsQR Library** for efficient QR code decoding
- **React Qr Reader** for camera integration

### Deployment & Infrastructure
- **Vercel** for seamless deployment and hosting
- **GitHub** for version control and collaboration

---

## 📂 Project Structure

```
product-verification/
├── public/                 # Static assets and icons
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── DashboardLayout.jsx
│   │   ├── QRScanner.jsx
│   │   ├── Timeline.jsx
│   │   ├── TransferForm.jsx
│   │   └── ManualVerificationForm.jsx
│   ├── context/            # React context for state management
│   │   └── AuthContext.jsx
│   ├── dashboards/         # Role-specific dashboard pages
│   │   ├── CompanyDashboard.jsx
│   │   ├── RetailerDashboard.jsx
│   │   └── CustomerDashboard.jsx
│   ├── hooks/              # Custom React hooks
│   ├── pages/              # Main application pages
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── VerifyProduct.jsx
│   │   └── ProductDetails.jsx
│   ├── services/           # Firebase and API services
│   │   ├── firebase.js
│   │   └── traceService.js
│   ├── App.js              # Main application component
│   └── index.js            # Application entry point
├── package.json            # Dependencies and scripts
├── vercel.json             # Vercel deployment configuration
└── README.md               # Project documentation
```

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager
- Firebase project with Firestore, Authentication, and Storage enabled

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/hack-09/product-verification.git
   cd product-verification
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Firestore, Authentication, and Storage
   - Copy your Firebase config and replace the values in `src/services/firebase.js`

4. **Set up Firestore Rules**
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Add your security rules here
     }
   }
   ```

5. **Start the development server**
   ```bash
   npm start
   ```
   The application will open at `http://localhost:3000`

6. **Build for production**
   ```bash
   npm run build
   ```

---

## 🌐 Deployment

### Vercel Deployment
This project is deployed on **Vercel** for optimal performance and scalability:

1. **Connect your GitHub repository to Vercel**
2. **Configure environment variables** for Firebase in Vercel dashboard
3. **Deploy automatically** with every git push to main branch

👉 [Live Demo](https://product-verification-two.vercel.app)

### Environment Variables
Create a `.env` file in the root directory:
```
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

---

## 📸 Application Screenshots

| Company Dashboard | Product Management | QR Scanning |
|-------------------|-------------------|-------------|
| <img src="https://github.com/user-attachments/assets/8c4e2a60-3238-4bee-b8f0-3cd8dbc28c25" width="300" /> | <img src="https://github.com/user-attachments/assets/ccb9e6b6-b468-4835-9588-837b2b99d642" width="300" /> | <img src="https://github.com/user-attachments/assets/f5709f2e-0d20-416e-883c-6153ca9049a8" width="300" /> |

| Product Details | Manual Code Verify | QR Code (Dummy Data) |
|-----------------|----------------------|-------------|
| <img src="https://github.com/user-attachments/assets/be259258-7cd1-4197-9c0f-3e4a3ec79b36" width="300" /> | <img src="https://github.com/user-attachments/assets/83473c70-ed75-4bc7-9f1b-28b2e223ebc6" width="300" /> | <img width="300" src="https://github.com/user-attachments/assets/56b1184e-6722-4b01-adc6-5b8a950065b4" />
 |

---

## 🚀 Usage Guide

### For Companies
1. **Register/Login** as a company user
2. **Add Products** with details, images, and pricing
3. **Create Batches** with manufacturing and expiration dates
4. **Track Product Journey** through the supply chain
5. **Monitor Verification Statistics** on your dashboard

### For Retailers
1. **Scan Products** using QR codes or manual entry
2. **Verify Authenticity** in real-time
3. **Update Inventory Status** as products move through your store
4. **View Scan History** for audit purposes

### For Customers
1. **Scan Product QR Codes** to verify authenticity
2. **View Product Details** and manufacturing information
3. **Check Verification History** of previously scanned items
4. **Report Suspicious Products** if counterfeit is detected

---

## 🔧 Customization

### Adding New User Roles
1. Update the registration form in `src/pages/Register.jsx`
2. Create a new dashboard component in `src/dashboards/`
3. Add role-specific routes in the main App component

### Modifying Verification Process
1. Edit the QR scanner logic in `src/components/QRScanner.jsx`
2. Update verification API calls in `src/services/traceService.js`
3. Customize the results display in `src/pages/VerifyProduct.jsx`

### Styling Changes
The application uses Tailwind CSS for styling. Modify classes in components or update the Tailwind configuration in `tailwind.config.js`.

---

## 🤝 Contributing

We welcome contributions to enhance the Product Verification System:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

---

## 🆘 Support

For support, email priyanshukumar9780@email.com.

---

## 🎯 Future Enhancements

- [ ] **Mobile App Development** (React Native)
- [ ] **Blockchain Integration** for immutable verification records
- [ ] **Advanced Analytics** with data visualization
- [ ] **Multi-language Support**
- [ ] **Bulk Product Upload** via CSV
- [ ] **API Access** for third-party integrations
- [ ] **SMS/Email Notifications** for verification events

---

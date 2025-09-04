import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  QrCodeIcon, 
  ShieldCheckIcon, 
  ChartBarIcon, 
  DevicePhoneMobileIcon,
  ArrowRightIcon,
  CheckBadgeIcon,
  LockClosedIcon
} from "@heroicons/react/24/outline";
import ThemeToggle from "../components/ThemeToggle";
import { useTheme } from "../context/ThemeContext";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();

  const features = [
    {
      icon: <ShieldCheckIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />,
      title: "Instant Verification",
      description: "Verify product authenticity in seconds with our advanced QR scanning technology."
    },
    {
      icon: <ChartBarIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />,
      title: "Track & Trace",
      description: "Follow your product's journey from manufacturer to your hands with complete transparency."
    },
    {
      icon: <DevicePhoneMobileIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />,
      title: "Mobile Friendly",
      description: "Works seamlessly on any device, with optimized scanning for mobile cameras."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-200">
      {/* Navigation */}
      <nav className="w-full py-4 px-6 flex justify-between items-center">
        <div className="flex items-center">
          <div className="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
            <QrCodeIcon className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-blue-900 dark:text-white">TrueCheck</h1>
        </div>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 text-blue-700 dark:text-blue-300 font-medium hover:text-blue-900 dark:hover:text-blue-100 transition-colors"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/register")}
            className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg shadow hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-16 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-10 md:mb-0">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight">
            Verify Product
            <span className="text-blue-600 dark:text-blue-400"> Authenticity</span> in Seconds
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 mt-6 max-w-xl">
            Scan QR codes to instantly verify your products and ensure they're genuine. 
            Protect yourself from counterfeits with our advanced verification system.
          </p>
          <div className="flex flex-col sm:flex-row mt-8 space-y-4 sm:space-y-0 sm:space-x-4">
            <button
              onClick={() => navigate("/verify")}
              className="px-6 py-3 bg-blue-600 dark:bg-blue-700 text-white rounded-xl shadow-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors flex items-center justify-center"
            >
              <QrCodeIcon className="h-5 w-5 mr-2" />
              Verify Product Now
            </button>
            <button
              onClick={() => navigate("/register")}
              className="px-6 py-3 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-300 border border-blue-600 dark:border-blue-400 rounded-xl shadow-sm hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center"
            >
              Create Account
              <ArrowRightIcon className="h-5 w-5 ml-2" />
            </button>
          </div>
          <div className="mt-6 flex items-center text-sm text-gray-500 dark:text-gray-400">
            <LockClosedIcon className="h-4 w-4 mr-1 text-green-500" />
            <span>No account needed for verification</span>
          </div>
        </div>
        <div className="md:w-1/2 flex justify-center">
          <div className="relative">
            <div className="absolute -inset-4 bg-blue-200 dark:bg-blue-900 rounded-2xl transform rotate-3 opacity-50"></div>
            <div className="relative bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-blue-100 dark:border-gray-700 max-w-md">
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 mb-4">
                <div className="bg-white dark:bg-gray-600 p-3 rounded border-2 border-dashed border-gray-300 dark:border-gray-500 flex items-center justify-center h-48">
                  <div className="text-center">
                    <QrCodeIcon className="h-16 w-16 text-gray-400 dark:text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">QR Code Scanner Preview</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="h-10 w-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mr-3">
                  <CheckBadgeIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Product Verified</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Authentic product from manufacturer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white dark:bg-gray-800 py-16 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">Why Choose TrueCheck?</h3>
            <p className="text-lg text-gray-600 dark:text-gray-300 mt-4 max-w-2xl mx-auto">
              Our platform offers comprehensive product verification solutions for consumers, retailers, and manufacturers.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 hover:shadow-md transition-all">
                <div className="bg-blue-100 dark:bg-blue-900 h-14 w-14 rounded-lg flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h4>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-800 dark:to-indigo-900 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h3 className="text-3xl font-bold text-white mb-6">Ready to Verify Your Products?</h3>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Start protecting yourself from counterfeit products today. It's fast, easy, and free to verify.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button
              onClick={() => navigate("/verify")}
              className="px-6 py-3 bg-white text-blue-600 rounded-xl shadow-md hover:bg-blue-50 transition-colors flex items-center justify-center"
            >
              <QrCodeIcon className="h-5 w-5 mr-2" />
              Verify Now
            </button>
            <button
              onClick={() => navigate("/register")}
              className="px-6 py-3 bg-transparent text-white border border-white rounded-xl hover:bg-white hover:text-blue-600 transition-colors"
            >
              Create Account
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-black text-white py-12 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-6 md:mb-0">
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <QrCodeIcon className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">TrueCheck</span>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© {new Date().getFullYear()} TrueCheck Product Verification System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
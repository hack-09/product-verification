import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  QrCodeIcon, 
  ShieldCheckIcon, 
  ChartBarIcon, 
  DevicePhoneMobileIcon,
  ArrowRightIcon,
  CheckBadgeIcon,
  LockClosedIcon,
  Bars3Icon,
  XMarkIcon
} from "@heroicons/react/24/outline";
import ThemeToggle from "../components/ThemeToggle";
import { useTheme } from "../context/ThemeContext";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

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
      <nav className="w-full py-4 px-4 sm:px-6 flex justify-between items-center">
        <div className="flex items-center">
          <div className="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
            <QrCodeIcon className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-blue-900 dark:text-white">TrueCheck</h1>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-4">
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

        {/* Mobile Navigation Button */}
        <div className="flex md:hidden items-center space-x-2">
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700"
          >
            {mobileMenuOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 shadow-lg rounded-lg mx-4 mt-2 p-4">
          <div className="flex flex-col space-y-3">
            <button
              onClick={() => {
                navigate("/login");
                setMobileMenuOpen(false);
              }}
              className="px-4 py-2 text-blue-700 dark:text-blue-300 font-medium text-left"
            >
              Login
            </button>
            <button
              onClick={() => {
                navigate("/register");
                setMobileMenuOpen(false);
              }}
              className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg"
            >
              Get Started
            </button>
            <button
              onClick={() => {
                navigate("/verify");
                setMobileMenuOpen(false);
              }}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 font-medium text-left"
            >
              Verify Product
            </button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-16 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-10 md:mb-0">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight">
            Verify Product
            <span className="text-blue-600 dark:text-blue-400"> Authenticity</span> in Seconds
          </h2>
          <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 mt-4 sm:mt-6 max-w-xl">
            Scan QR codes to instantly verify your products and ensure they're genuine. 
            Protect yourself from counterfeits with our advanced verification system.
          </p>
          <div className="flex flex-col sm:flex-row mt-6 sm:mt-8 space-y-3 sm:space-y-0 sm:space-x-4">
            <button
              onClick={() => navigate("/verify")}
              className="px-5 py-3 bg-blue-600 dark:bg-blue-700 text-white rounded-xl shadow-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors flex items-center justify-center text-sm sm:text-base"
            >
              <QrCodeIcon className="h-5 w-5 mr-2" />
              Verify Product Now
            </button>
            <button
              onClick={() => navigate("/register")}
              className="px-5 py-3 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-300 border border-blue-600 dark:border-blue-400 rounded-xl shadow-sm hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center text-sm sm:text-base"
            >
              Create Account
              <ArrowRightIcon className="h-5 w-5 ml-2" />
            </button>
          </div>
          <div className="mt-4 sm:mt-6 flex items-center text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            <LockClosedIcon className="h-4 w-4 mr-1 text-green-500" />
            <span>No account needed for verification</span>
          </div>
        </div>
        <div className="md:w-1/2 flex justify-center mt-8 md:mt-0">
          <div className="relative w-full max-w-sm">
            <div className="absolute -inset-3 bg-blue-200 dark:bg-blue-900 rounded-2xl transform rotate-3 opacity-50"></div>
            <div className="relative bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-2xl shadow-lg border border-blue-100 dark:border-gray-700">
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
                <div className="bg-white dark:bg-gray-600 p-3 rounded border-2 border-dashed border-gray-300 dark:border-gray-500 flex items-center justify-center h-40 sm:h-48">
                  <div className="text-center">
                    <QrCodeIcon className="h-12 sm:h-16 w-12 sm:w-16 text-gray-400 dark:text-gray-300 mx-auto mb-2" />
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">QR Code Scanner Preview</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="h-8 w-8 sm:h-10 sm:w-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mr-2 sm:mr-3">
                  <CheckBadgeIcon className="h-4 w-4 sm:h-6 sm:w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">Product Verified</p>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Authentic product from manufacturer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white dark:bg-gray-800 py-12 md:py-16 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 md:mb-16">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Why Choose TrueCheck?</h3>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mt-3 sm:mt-4 max-w-2xl mx-auto">
              Our platform offers comprehensive product verification solutions for consumers, retailers, and manufacturers.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-5 sm:p-6 hover:shadow-md transition-all">
                <div className="bg-blue-100 dark:bg-blue-900 h-12 w-12 sm:h-14 sm:w-14 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                  {feature.icon}
                </div>
                <h4 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-800 dark:to-indigo-900 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6">Ready to Verify Your Products?</h3>
          <p className="text-base sm:text-lg text-blue-100 mb-6 sm:mb-8 max-w-2xl mx-auto">
            Start protecting yourself from counterfeit products today. It's fast, easy, and free to verify.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
            <button
              onClick={() => navigate("/verify")}
              className="px-5 py-3 bg-white text-blue-600 rounded-xl shadow-md hover:bg-blue-50 transition-colors flex items-center justify-center text-sm sm:text-base"
            >
              <QrCodeIcon className="h-5 w-5 mr-2" />
              Verify Now
            </button>
            <button
              onClick={() => navigate("/register")}
              className="px-5 py-3 bg-transparent text-white border border-white rounded-xl hover:bg-white hover:text-blue-600 transition-colors text-sm sm:text-base"
            >
              Create Account
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-black text-white py-8 md:py-12 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-6 md:mb-0">
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <QrCodeIcon className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">TrueCheck</span>
            </div>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-6 md:mb-0">
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base">Contact</a>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-6 md:mt-8 pt-6 md:pt-8 text-center text-gray-400 text-sm sm:text-base">
            <p>© {new Date().getFullYear()} TrueCheck Product Verification System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
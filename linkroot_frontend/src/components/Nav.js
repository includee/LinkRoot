import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // Import AuthContext
import logo from '../logo.svg';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  // const location = useLocation();
  const navigate = useNavigate();
  const { onLogout, isAuthenticated } = useContext(AuthContext); // Access isAuthenticated

  // Toggle the mobile menu
  const handleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = async () => {
    await onLogout();
    navigate('/login');
  };

  return (
    <nav className="p-3 flex bg-white justify-between items-center fixed top-0 left-0 right-0 z-20 shadow-md">
      {/* Brand Section */}
      <Link to="/" id="brand" className="flex gap-2 items-center flex-1">
        <img className="object-cover max-w-12 max-h-12" src="/linkroot1.png" alt="Logo" />
        <span className="text-lg font-medium font-display">LinkRoot</span>
      </Link>

      {/* Desktop Menu */}
      <div id="nav-menu" className="hidden lg:flex gap-12">
        {isAuthenticated ? (
          <>
            <Link to="/dashboard" className="font-medium hover:text-primary">
              Dashboard
            </Link>
            
            <button
              className="btn btn-error btn-outline btn-sm text-white"
              onClick={handleLogout}
            >
              Logout
              <i className="fa-solid fa-arrow-right ml-1"></i>
            </button>
          </>
        ) : (
          <>
            <Link to="/" className="font-medium hover:text-primary">
              Home
            </Link>
            <Link to="/register" className="font-medium hover:text-primary">
              Register
            </Link>
            <Link to="/login" className="font-medium hover:text-primary">
              Login
            </Link>
          </>
        )}
      </div>

      {/* Desktop Button */}
      {!isAuthenticated && (
        <div className="hidden lg:flex flex-1 justify-end">
          <button className="flex gap-2 items-center border border-gray-400 px-6 py-2 rounded-lg hover:border-gray-600">
            <img src="./assets/asset 1.svg" alt="" />
            <span className="font-display font-medium">LinkRoot</span>
            <i className="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      )}

      {/* Mobile Menu Toggle Button */}
      <button className="p-2 lg:hidden" onClick={handleMenu}>
        <i className="fa-solid fa-bars text-gray-600"></i>
      </button>

      {/* Mobile Menu */}
      {menuOpen && (
        <div id="nav-dialog" className="fixed z-10 md:hidden bg-white inset-0 p-3">
          {/* Mobile Navbar Brand */}
          <div id="nav-bar" className="flex justify-between">
            <Link to="/" id="brand" className="flex gap-2 items-center">
              <img
                className="object-cover max-w-12 max-h-12"
                src="./assets/asset 0.png"
                alt="Logo"
              />
              <span className="text-lg font-medium font-display">LinkRoot</span>
            </Link>
            <button className="p-2 md:hidden" onClick={handleMenu}>
              <i className="fa-solid fa-xmark text-gray-600"></i>
            </button>
          </div>

          {/* Mobile Menu Links */}
          <div className="mt-6">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="font-medium m-3 p-3 hover:bg-gray-50 block rounded-lg"
                >
                  Dashboard
                </Link>
                <Link
                  to="/dashboard/analytics" // Updated Link for mobile
                  className="font-medium m-3 p-3 hover:bg-gray-50 block rounded-lg"
                >
                  Analytics
                </Link>
                <button
                  className="font-medium m-3 p-3 hover:bg-gray-50 block rounded-lg"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/"
                  className="font-medium m-3 p-3 hover:bg-gray-50 block rounded-lg"
                >
                  Home
                </Link>
                <Link
                  to="/register"
                  className="font-medium m-3 p-3 hover:bg-gray-50 block rounded-lg"
                >
                  Register
                </Link>
                <Link
                  to="/login"
                  className="font-medium m-3 p-3 hover:bg-gray-50 block rounded-lg"
                >
                  Login
                </Link>
              </>
            )}
          </div>

          {/* Divider */}
          <div className="h-[1px] bg-gray-300"></div>

          {/* Mobile Button */}
          {!isAuthenticated && (
            <button className="mt-6 w-full flex gap-2 items-center px-6 py-4 rounded-lg hover:bg-gray-50">
              <img src="./assets/asset 1.svg" alt="" />
              <span>Download Now</span>
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;


import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

interface HeaderProps {
  isLoggedIn: boolean;
}

const Header: React.FC<HeaderProps> = ({ isLoggedIn }) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    // Clear session storage
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('isAdmin');
    
    // Show toast
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account",
    });
    
    // Navigate to home
    navigate('/');
  };

  return (
    <header>
      {/* Top Bar with contact info */}
      <div className="hidden md:block bg-medical-dark text-white py-2">
        <div className="medical-container flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span className="text-sm">+123 456 7890</span>
            </div>
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="text-sm">info@chestscanai.com</span>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <button 
                onClick={handleLogout}
                className="text-sm hover:text-medical-secondary transition-colors"
              >
                Logout
              </button>
            ) : (
              <>
                <Link to="/login" className="text-sm hover:text-medical-secondary transition-colors">Login</Link>
                <Link to="/register" className="text-sm hover:text-medical-secondary transition-colors">Register</Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="bg-white shadow-md">
        <div className="medical-container flex justify-between items-center py-4">
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-medical-primary">ChestScan</span>
            <span className="text-2xl font-bold text-medical-secondary">HealthAI</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-medical-primary transition-colors">Home</Link>
            <Link to="/about" className="text-gray-700 hover:text-medical-primary transition-colors">About</Link>
            <Link to="/services" className="text-gray-700 hover:text-medical-primary transition-colors">Services</Link>
            {isLoggedIn && (
              <Link to="/dashboard" className="text-gray-700 hover:text-medical-primary transition-colors">Dashboard</Link>
            )}
            <Link to="/contact" className="text-gray-700 hover:text-medical-primary transition-colors">Contact</Link>
          </div>
          
          <div className="md:hidden flex items-center">
            <Button variant="ghost" size="sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;

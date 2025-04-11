
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { authService } from '@/services/auth.service';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const user = await authService.login({ email, password });
      
      if (user) {
        // Store user in session storage
        sessionStorage.setItem('user', JSON.stringify(user));
        if (user.isAdmin) {
          sessionStorage.setItem('isAdmin', 'true');
        }
        
        // Show success toast
        toast({
          title: "Login Successful",
          description: `Welcome ${user.name}!`,
        });
        
        // Redirect based on user role
        if (user.isAdmin) {
          navigate('/admin-dashboard');
        } else {
          navigate('/dashboard');
        }
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('An error occurred during login. Please try again.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header isLoggedIn={false} />
      
      <main className="flex-grow py-16 bg-gray-50">
        <div className="medical-container">
          <div className="max-w-md mx-auto medical-card overflow-hidden">
            <div className="p-1 gradient-bg"></div>
            <div className="p-8">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Login to Your Account</h1>
                <p className="text-gray-600 mt-2">Access your health dashboard and AI services</p>
              </div>
              
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="medical-input"
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="password">Password</Label>
                    <Link to="/forgot-password" className="text-sm text-medical-primary hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <Input 
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="medical-input"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full medical-btn-primary py-3"
                  disabled={isLoading}
                >
                  {isLoading ? 'Logging in...' : 'Login'}
                </Button>
                
                <div className="text-center mt-4">
                  <p className="text-gray-600">
                    Don't have an account? {' '}
                    <Link to="/register" className="text-medical-primary hover:underline">
                      Register here
                    </Link>
                  </p>
                </div>
                
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-500">Demo Credentials:</p>
                  <p className="text-xs text-gray-500">Patient: patient@example.com / patient123</p>
                  <p className="text-xs text-gray-500">Admin: admin@example.com / admin123</p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Login;

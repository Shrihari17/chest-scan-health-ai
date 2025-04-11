
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { authService } from '@/services/auth.service';

const Index = () => {
  const currentUser = authService.getCurrentUser();
  const isLoggedIn = !!currentUser;

  return (
    <div className="flex flex-col min-h-screen">
      <Header isLoggedIn={isLoggedIn} />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-medical-primary/80 to-medical-dark/80 z-10"></div>
          <div className="relative h-[80vh] bg-[url('https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80')] bg-cover bg-center">
            <div className="medical-container h-full flex items-center relative z-20">
              <div className="max-w-2xl text-white">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">Advanced AI Chest X-Ray Analysis</h1>
                <p className="text-xl mb-8">
                  Our cutting-edge AI technology analyzes chest X-rays to detect pneumonia 
                  with high accuracy, providing fast and reliable results.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/services">
                    <Button className="medical-btn-primary w-full sm:w-auto">
                      Our Services
                    </Button>
                  </Link>
                  <Link to={isLoggedIn ? "/services/xray-analysis" : "/login"}>
                    <Button className="medical-btn-secondary w-full sm:w-auto">
                      {isLoggedIn ? "Analyze X-Ray" : "Login to Start"}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 bg-gray-50">
          <div className="medical-container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Our Features</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Discover how our AI-powered platform is revolutionizing pneumonia detection
                through advanced chest X-ray analysis
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="medical-card p-6">
                <div className="w-14 h-14 rounded-full bg-medical-light flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-medical-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">AI X-Ray Analysis</h3>
                <p className="text-gray-600">
                  Upload chest X-rays for instant pneumonia detection using our state-of-the-art
                  AI algorithm with high accuracy rates.
                </p>
              </div>
              
              <div className="medical-card p-6">
                <div className="w-14 h-14 rounded-full bg-medical-light flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-medical-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Health Chatbot</h3>
                <p className="text-gray-600">
                  Get instant answers to your lung health questions through our
                  AI-powered chatbot available 24/7.
                </p>
              </div>
              
              <div className="medical-card p-6">
                <div className="w-14 h-14 rounded-full bg-medical-light flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-medical-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Detailed Reports</h3>
                <p className="text-gray-600">
                  Receive comprehensive analytical reports with visual annotations
                  that you can share with your healthcare provider.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Call to Action */}
        <section className="py-16 gradient-bg text-white">
          <div className="medical-container text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
            <p className="text-xl max-w-2xl mx-auto mb-8">
              Create an account today and start using our AI-powered chest X-ray analysis for fast, accurate pneumonia detection.
            </p>
            <div className="flex justify-center gap-4">
              <Link to="/register">
                <Button className="bg-white text-medical-primary hover:bg-gray-100 font-semibold py-3 px-6 rounded-lg">
                  Register Now
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="outline" className="border-white text-white hover:bg-white/10 font-semibold py-3 px-6 rounded-lg">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;


import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { authService } from '@/services/auth.service';

const Services = () => {
  const currentUser = authService.getCurrentUser();
  const isLoggedIn = !!currentUser;

  return (
    <div className="flex flex-col min-h-screen">
      <Header isLoggedIn={isLoggedIn} />
      
      <main className="flex-grow">
        {/* Services Hero */}
        <section className="py-16 gradient-bg text-white">
          <div className="medical-container text-center">
            <h1 className="text-4xl font-bold mb-4">Our Services</h1>
            <p className="text-xl max-w-2xl mx-auto">
              Discover our cutting-edge AI-powered services designed to provide
              fast, accurate pneumonia detection and lung health information.
            </p>
          </div>
        </section>
        
        {/* Services List */}
        <section className="py-16 bg-gray-50">
          <div className="medical-container">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* X-Ray Analysis Card */}
              <Card className="medical-card overflow-hidden flex flex-col h-full">
                <div className="h-48 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80" 
                    alt="Chest X-Ray Analysis" 
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-2xl text-medical-primary">Chest X-Ray Analysis</CardTitle>
                  <CardDescription>AI-powered pneumonia detection with high accuracy</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-gray-600">
                    Upload your chest X-ray images for instant analysis using our advanced 
                    machine learning model. Our technology can detect pneumonia with high accuracy, 
                    providing you with fast and reliable results.
                  </p>
                  <ul className="mt-4 space-y-2">
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-medical-secondary mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Instant image analysis</span>
                    </li>
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-medical-secondary mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>High accuracy pneumonia detection</span>
                    </li>
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-medical-secondary mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Downloadable detailed reports</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Link to={isLoggedIn ? "/services/xray-analysis" : "/login"} className="w-full">
                    <Button className="w-full medical-btn-primary">
                      {isLoggedIn ? "Analyze X-Ray" : "Login to Access"}
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
              
              {/* Lung Health Chatbot Card */}
              <Card className="medical-card overflow-hidden flex flex-col h-full">
                <div className="h-48 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1598257006458-087169a1f08d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80" 
                    alt="Lung Health Chatbot" 
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-2xl text-medical-primary">Lung Health Chatbot</CardTitle>
                  <CardDescription>Interactive AI assistant for lung health information</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-gray-600">
                    Have questions about pneumonia or other lung-related conditions? 
                    Our AI-powered chatbot provides instant answers to your health questions 
                    24/7, with information based on the latest medical research.
                  </p>
                  <ul className="mt-4 space-y-2">
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-medical-secondary mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>24/7 availability</span>
                    </li>
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-medical-secondary mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Evidence-based information</span>
                    </li>
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-medical-secondary mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Interactive conversational interface</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Link to={isLoggedIn ? "/services/health-chatbot" : "/login"} className="w-full">
                    <Button className="w-full medical-btn-primary">
                      {isLoggedIn ? "Chat Now" : "Login to Access"}
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>
        
        {/* How It Works */}
        <section className="py-16">
          <div className="medical-container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">How It Works</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Our simple and straightforward process makes it easy to get the information you need
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-medical-light flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-medical-primary">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Create an Account</h3>
                <p className="text-gray-600">
                  Sign up for a free account to access our AI-powered services
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-medical-light flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-medical-primary">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Choose a Service</h3>
                <p className="text-gray-600">
                  Select either X-ray analysis or interact with our health chatbot
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-medical-light flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-medical-primary">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Get Results Instantly</h3>
                <p className="text-gray-600">
                  Receive immediate results and downloadable reports for your records
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Services;

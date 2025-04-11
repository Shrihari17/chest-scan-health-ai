
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { authService } from '@/services/auth.service';

const About = () => {
  const currentUser = authService.getCurrentUser();
  const isLoggedIn = !!currentUser;

  return (
    <div className="flex flex-col min-h-screen">
      <Header isLoggedIn={isLoggedIn} />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-16 gradient-bg text-white">
          <div className="medical-container text-center">
            <h1 className="text-4xl font-bold mb-4">About ChestScan HealthAI</h1>
            <p className="text-xl max-w-2xl mx-auto">
              Advanced AI-powered chest X-ray analysis for pneumonia detection
            </p>
          </div>
        </section>
        
        {/* Mission Section */}
        <section className="py-16">
          <div className="medical-container">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Mission</h2>
                <p className="text-gray-600 mb-4">
                  ChestScan HealthAI is dedicated to improving pneumonia diagnosis through 
                  cutting-edge artificial intelligence. Our mission is to provide fast, 
                  accurate, and accessible medical imaging analysis to help healthcare 
                  providers make better decisions and improve patient outcomes.
                </p>
                <p className="text-gray-600">
                  We believe that AI-powered diagnostics can democratize access to high-quality 
                  healthcare, particularly in regions with limited access to radiologists. 
                  By combining advanced machine learning techniques with medical expertise, 
                  we aim to create tools that augment human capabilities and make healthcare 
                  more effective and efficient.
                </p>
              </div>
              <div className="rounded-lg overflow-hidden shadow-lg">
                <img 
                  src="https://images.unsplash.com/photo-1631815588090-d4bfef9b3a5e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80" 
                  alt="Medical professionals" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>
        
        {/* Technology Section */}
        <section className="py-16 bg-gray-50">
          <div className="medical-container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Our Technology</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Powered by state-of-the-art AI and machine learning algorithms
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="medical-card p-6">
                <div className="w-14 h-14 rounded-full bg-medical-light flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-medical-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Deep Learning</h3>
                <p className="text-gray-600">
                  Our pneumonia detection model uses convolutional neural networks trained on 
                  thousands of clinically validated X-ray images to identify patterns associated 
                  with pneumonia.
                </p>
              </div>
              
              <div className="medical-card p-6">
                <div className="w-14 h-14 rounded-full bg-medical-light flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-medical-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Advanced Analytics</h3>
                <p className="text-gray-600">
                  We employ sophisticated image processing techniques and statistical analysis 
                  to continually improve the accuracy and reliability of our diagnostic predictions.
                </p>
              </div>
              
              <div className="medical-card p-6">
                <div className="w-14 h-14 rounded-full bg-medical-light flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-medical-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Security & Privacy</h3>
                <p className="text-gray-600">
                  Patient data security is our top priority. We use industry-standard encryption 
                  and comply with healthcare data protection regulations to keep information safe.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Team Section */}
        <section className="py-16">
          <div className="medical-container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Our Team</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                A dedicated group of healthcare professionals, AI researchers, and engineers
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                {
                  name: "Dr. Sarah Chen",
                  role: "Chief Medical Officer",
                  image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80"
                },
                {
                  name: "Michael Rodriguez",
                  role: "AI Research Director",
                  image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80"
                },
                {
                  name: "Dr. James Wilson",
                  role: "Pulmonology Specialist",
                  image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80"
                },
                {
                  name: "Dr. Emily Patel",
                  role: "Radiology Consultant",
                  image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80"
                }
              ].map((member, index) => (
                <div key={index} className="medical-card overflow-hidden">
                  <div className="h-64 overflow-hidden">
                    <img 
                      src={member.image} 
                      alt={member.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4 text-center">
                    <h3 className="text-lg font-semibold">{member.name}</h3>
                    <p className="text-gray-600">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;

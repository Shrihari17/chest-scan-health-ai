
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { authService } from '@/services/auth.service';

interface AnalysisHistory {
  id: string;
  date: string;
  result: string;
  confidence: number;
}

const Dashboard = () => {
  const [user, setUser] = useState(authService.getCurrentUser());
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Mock analysis history data
  const [analysisHistory, setAnalysisHistory] = useState<AnalysisHistory[]>([
    {
      id: 'XR-12345',
      date: '2025-04-10',
      result: 'Normal',
      confidence: 0.89
    },
    {
      id: 'XR-12300',
      date: '2025-04-05',
      result: 'Pneumonia',
      confidence: 0.94
    },
    {
      id: 'XR-11998',
      date: '2025-03-28',
      result: 'Normal',
      confidence: 0.76
    }
  ]);
  
  useEffect(() => {
    // Check if user is logged in
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to access your dashboard",
        variant: "destructive"
      });
      navigate('/login');
    }
    
    // Check if user is admin
    if (user?.isAdmin) {
      navigate('/admin-dashboard');
    }
  }, [user, navigate, toast]);

  if (!user) return null;

  return (
    <div className="flex flex-col min-h-screen">
      <Header isLoggedIn={true} />
      
      <main className="flex-grow py-12 bg-gray-50">
        <div className="medical-container">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Patient Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user.name}</p>
            </div>
            <div className="flex space-x-4">
              <Link to="/services/xray-analysis">
                <Button className="medical-btn-primary">New Analysis</Button>
              </Link>
            </div>
          </div>
          
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="history">Analysis History</TabsTrigger>
              <TabsTrigger value="profile">My Profile</TabsTrigger>
            </TabsList>
            
            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="medical-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl">X-Ray Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Upload a chest X-ray image for instant pneumonia detection using our AI algorithm.
                    </p>
                    <Link to="/services/xray-analysis">
                      <Button className="w-full medical-btn-primary">
                        Analyze X-Ray
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
                
                <Card className="medical-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl">Health Chatbot</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Have questions about pneumonia or lung health? Chat with our AI assistant.
                    </p>
                    <Link to="/services/health-chatbot">
                      <Button className="w-full medical-btn-primary">
                        Start Chat
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
              
              {/* Recent Activity */}
              <Card className="medical-card">
                <CardHeader>
                  <CardTitle className="text-xl">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  {analysisHistory.length > 0 ? (
                    <div className="space-y-4">
                      {analysisHistory.slice(0, 2).map((item) => (
                        <div key={item.id} className="flex items-center p-3 border border-gray-200 rounded-lg">
                          <div className={`w-2 h-2 rounded-full mr-3 ${
                            item.result === 'Normal' ? 'bg-green-500' : 'bg-red-500'
                          }`}></div>
                          <div className="flex-1">
                            <p className="font-medium">{item.result} (ID: {item.id})</p>
                            <p className="text-sm text-gray-500">
                              {new Date(item.date).toLocaleDateString()} • 
                              Confidence: {Math.round(item.confidence * 100)}%
                            </p>
                          </div>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </div>
                      ))}
                      
                      <div className="text-center mt-4">
                        <Button variant="link" className="text-medical-primary">
                          View All Activity
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <p>No recent activity found.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* History Tab */}
            <TabsContent value="history">
              <Card className="medical-card">
                <CardHeader>
                  <CardTitle className="text-xl">Analysis History</CardTitle>
                </CardHeader>
                <CardContent>
                  {analysisHistory.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="border-b">
                            <th className="py-2 px-4 text-left font-semibold">ID</th>
                            <th className="py-2 px-4 text-left font-semibold">Date</th>
                            <th className="py-2 px-4 text-left font-semibold">Result</th>
                            <th className="py-2 px-4 text-left font-semibold">Confidence</th>
                            <th className="py-2 px-4 text-right font-semibold">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {analysisHistory.map((item) => (
                            <tr key={item.id} className="border-b hover:bg-gray-50">
                              <td className="py-3 px-4">{item.id}</td>
                              <td className="py-3 px-4">{new Date(item.date).toLocaleDateString()}</td>
                              <td className="py-3 px-4">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  item.result === 'Normal' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {item.result}
                                </span>
                              </td>
                              <td className="py-3 px-4">{Math.round(item.confidence * 100)}%</td>
                              <td className="py-3 px-4 text-right">
                                <Button variant="ghost" size="sm">
                                  View
                                </Button>
                                <Button variant="ghost" size="sm">
                                  Download
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <p>No analysis history found.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card className="medical-card">
                <CardHeader>
                  <CardTitle className="text-xl">My Profile</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-medium text-gray-900">Personal Information</h3>
                      <dl className="mt-4 space-y-4">
                        <div className="border-b pb-2">
                          <dt className="text-sm text-gray-500">Full Name</dt>
                          <dd className="mt-1 text-gray-900">{user.name}</dd>
                        </div>
                        <div className="border-b pb-2">
                          <dt className="text-sm text-gray-500">Email</dt>
                          <dd className="mt-1 text-gray-900">{user.email}</dd>
                        </div>
                        <div className="border-b pb-2">
                          <dt className="text-sm text-gray-500">Date of Birth</dt>
                          <dd className="mt-1 text-gray-900">{user.dob || "Not provided"}</dd>
                        </div>
                        <div className="border-b pb-2">
                          <dt className="text-sm text-gray-500">Phone</dt>
                          <dd className="mt-1 text-gray-900">{user.phone || "Not provided"}</dd>
                        </div>
                      </dl>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-gray-900">Medical Information</h3>
                      <div className="mt-4 p-4 border rounded-lg bg-gray-50">
                        <h4 className="text-sm font-medium text-gray-500">Medical History</h4>
                        <p className="mt-2 text-gray-700">
                          {user.medicalHistory || "No medical history provided."}
                        </p>
                      </div>
                      
                      <div className="mt-6 flex space-x-4">
                        <Button className="flex-1 medical-btn-secondary">
                          Edit Profile
                        </Button>
                        <Button variant="outline" className="flex-1">
                          Change Password
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;

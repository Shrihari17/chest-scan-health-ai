
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { authService } from '@/services/auth.service';

const AdminDashboard = () => {
  const [user, setUser] = useState(authService.getCurrentUser());
  const [patients, setPatients] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    // Check if user is logged in and is admin
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to access this page",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }
    
    if (!user.isAdmin) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access the admin dashboard",
        variant: "destructive"
      });
      navigate('/dashboard');
      return;
    }
    
    // Fetch patients data
    const fetchPatients = async () => {
      try {
        const data = await authService.getAllPatients();
        setPatients(data);
      } catch (error) {
        console.error('Error fetching patients:', error);
        toast({
          title: "Data Loading Error",
          description: "Could not load patients data. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPatients();
  }, [user, navigate, toast]);

  // Filter patients based on search term
  const filteredPatients = patients.filter(patient => 
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!user || !user.isAdmin) return null;

  return (
    <div className="flex flex-col min-h-screen">
      <Header isLoggedIn={true} />
      
      <main className="flex-grow py-12 bg-gray-50">
        <div className="medical-container">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
              <p className="text-gray-600">Manage patients and system settings</p>
            </div>
          </div>
          
          <Tabs defaultValue="patients" className="space-y-6">
            <TabsList>
              <TabsTrigger value="patients">Patients</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="settings">System Settings</TabsTrigger>
            </TabsList>
            
            {/* Patients Tab */}
            <TabsContent value="patients">
              <Card className="medical-card">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-xl">Patients List</CardTitle>
                  <div className="w-72">
                    <Input 
                      placeholder="Search patients..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="medical-input"
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="text-center py-8">
                      <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-medical-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                      <p className="mt-2 text-gray-600">Loading patients data...</p>
                    </div>
                  ) : filteredPatients.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="border-b">
                            <th className="py-2 px-4 text-left font-semibold">ID</th>
                            <th className="py-2 px-4 text-left font-semibold">Name</th>
                            <th className="py-2 px-4 text-left font-semibold">Email</th>
                            <th className="py-2 px-4 text-left font-semibold">Phone</th>
                            <th className="py-2 px-4 text-left font-semibold">DOB</th>
                            <th className="py-2 px-4 text-right font-semibold">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredPatients.map((patient) => (
                            <tr key={patient.id} className="border-b hover:bg-gray-50">
                              <td className="py-3 px-4">{patient.id}</td>
                              <td className="py-3 px-4">{patient.name}</td>
                              <td className="py-3 px-4">{patient.email}</td>
                              <td className="py-3 px-4">{patient.phone || "N/A"}</td>
                              <td className="py-3 px-4">{patient.dob || "N/A"}</td>
                              <td className="py-3 px-4 text-right">
                                <Button variant="ghost" size="sm">
                                  View
                                </Button>
                                <Button variant="ghost" size="sm">
                                  Edit
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      {searchTerm ? (
                        <p>No patients match your search criteria.</p>
                      ) : (
                        <p>No patients found in the system.</p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Analytics Tab */}
            <TabsContent value="analytics">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <Card className="medical-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl">Total Patients</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-medical-primary">{patients.length}</div>
                    <p className="text-gray-500 text-sm">Registered in the system</p>
                  </CardContent>
                </Card>
                
                <Card className="medical-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl">Total Analyses</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-medical-primary">247</div>
                    <p className="text-gray-500 text-sm">X-rays analyzed</p>
                  </CardContent>
                </Card>
                
                <Card className="medical-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl">Positive Results</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-medical-primary">83</div>
                    <p className="text-gray-500 text-sm">Pneumonia cases detected</p>
                  </CardContent>
                </Card>
              </div>
              
              <Card className="medical-card">
                <CardHeader>
                  <CardTitle className="text-xl">System Activity</CardTitle>
                </CardHeader>
                <CardContent className="h-80 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <p>Analytics charts would be displayed here</p>
                    <p className="text-sm mt-2">This is a placeholder for visualization of system activity</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Settings Tab */}
            <TabsContent value="settings">
              <Card className="medical-card">
                <CardHeader>
                  <CardTitle className="text-xl">System Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="border-b pb-4">
                      <h3 className="font-medium text-gray-900 mb-2">AI Model Configuration</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Confidence Threshold
                          </label>
                          <Input 
                            type="number" 
                            defaultValue="0.7" 
                            min="0" 
                            max="1" 
                            step="0.05" 
                            className="medical-input w-full"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Minimum confidence score to report a positive result (0-1)
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Model Version
                          </label>
                          <select className="medical-input w-full">
                            <option>v2.0.1 (Latest)</option>
                            <option>v1.9.4</option>
                            <option>v1.8.7</option>
                          </select>
                          <p className="text-xs text-gray-500 mt-1">
                            The AI model version used for analysis
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-b pb-4">
                      <h3 className="font-medium text-gray-900 mb-2">System Maintenance</h3>
                      <div className="space-y-3">
                        <div>
                          <Button variant="outline" className="w-full md:w-auto">
                            Clear Cache
                          </Button>
                          <p className="text-xs text-gray-500 mt-1">
                            Clear system cache to free up storage space
                          </p>
                        </div>
                        <div>
                          <Button variant="outline" className="w-full md:w-auto">
                            Download System Logs
                          </Button>
                          <p className="text-xs text-gray-500 mt-1">
                            Download logs for system diagnostics
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Danger Zone</h3>
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <h4 className="text-red-800 font-medium">Reset System</h4>
                        <p className="text-red-700 text-sm mt-1 mb-3">
                          This action will reset all system settings to default values. This cannot be undone.
                        </p>
                        <Button variant="destructive" size="sm">
                          Reset System
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex justify-end pt-4 space-x-4">
                      <Button variant="outline">Cancel</Button>
                      <Button className="medical-btn-primary">Save Changes</Button>
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

export default AdminDashboard;

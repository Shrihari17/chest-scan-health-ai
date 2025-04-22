import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { authService } from '@/services/auth.service';
import { aiService, XrayAnalysisResult } from '@/services/ai.service';
import { AlertCircle } from 'lucide-react';

const XrayAnalysis = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<XrayAnalysisResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const currentUser = authService.getCurrentUser();
  const isLoggedIn = !!currentUser;
  
  // Redirect if not logged in
  React.useEffect(() => {
    if (!isLoggedIn) {
      toast({
        title: "Authentication Required",
        description: "Please log in to access this feature",
        variant: "destructive"
      });
      navigate('/login');
    }
  }, [isLoggedIn, navigate, toast]);
  
  // Simulate progress updates
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isAnalyzing) {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval);
            return prev;
          }
          return prev + 10;
        });
      }, 300);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAnalyzing]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    
    if (file) {
      // Check if file is an image
      if (!file.type.match('image.*')) {
        toast({
          title: "Invalid File Type",
          description: "Please upload an image file (JPEG, PNG, etc.)",
          variant: "destructive"
        });
        return;
      }
      
      setSelectedFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      // Reset previous results and errors
      setResult(null);
      setErrorMessage(null);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      toast({
        title: "No File Selected",
        description: "Please select an X-ray image to analyze",
        variant: "destructive"
      });
      return;
    }
    
    setIsAnalyzing(true);
    setProgress(0);
    setErrorMessage(null);
    
    try {
      // Process file upload
      const result = await aiService.analyzeXray(selectedFile);
      
      // Set progress to 100% when complete
      setProgress(100);
      
      setTimeout(() => {
        setResult(result);
        setIsAnalyzing(false);
        
        toast({
          title: "Analysis Complete",
          description: `Result: ${result.prediction}`,
        });
      }, 500);
      
    } catch (error) {
      console.error('Error analyzing X-ray:', error);
      setIsAnalyzing(false);
      setProgress(0);
      
      // Prepare a helpful error message
      let errorMsg = "There was an error analyzing your X-ray.";
      
      if (error instanceof Error) {
        if (error.message.includes("Failed to fetch")) {
          errorMsg = "Could not connect to the prediction server. Please ensure the Flask backend is running on http://localhost:5000.";
          setErrorMessage(errorMsg);
        } else {
          errorMsg += " " + error.message;
          setErrorMessage(error.message);
        }
      }
      
      toast({
        title: "Analysis Failed",
        description: errorMsg,
        variant: "destructive"
      });
    }
  };

  const handleDownloadReport = () => {
    if (result?.reportDownloadUrl) {
      // If it's a full URL, navigate to it
      if (result.reportDownloadUrl.startsWith('http')) {
        window.open(result.reportDownloadUrl, '_blank');
      } else {
        // Otherwise, it's a relative URL - construct the full URL
        const baseUrl = import.meta.env.VITE_FLASK_API_URL || "http://localhost:5000";
        window.open(`${baseUrl}${result.reportDownloadUrl}`, '_blank');
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header isLoggedIn={isLoggedIn} />
      
      <main className="flex-grow py-12 bg-gray-50">
        <div className="medical-container">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Chest X-Ray Analysis</h1>
          <p className="text-gray-600 mb-8">
            Upload a chest X-ray image for AI-powered pneumonia detection
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Upload Section */}
            <Card className="medical-card">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Upload X-Ray Image</h2>
                
                <div 
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-medical-primary transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {preview ? (
                    <div className="mb-4">
                      <img 
                        src={preview} 
                        alt="X-ray preview" 
                        className="max-h-64 mx-auto" 
                      />
                    </div>
                  ) : (
                    <div className="py-8">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-gray-600">Click to upload or drag and drop</p>
                      <p className="text-gray-500 text-sm mt-1">Supports JPG, PNG files</p>
                    </div>
                  )}
                  
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>
                
                {selectedFile && (
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-sm text-gray-600 truncate max-w-[70%]">
                      {selectedFile.name}
                    </span>
                    <Button 
                      onClick={() => {
                        setSelectedFile(null);
                        setPreview(null);
                      }}
                      variant="outline"
                      size="sm"
                      className="text-red-500"
                    >
                      Remove
                    </Button>
                  </div>
                )}
                
                {errorMessage && (
                  <div className="mt-4 p-3 bg-red-50 border-l-4 border-red-400 text-sm text-red-700">
                    <div className="flex">
                      <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                      <p>
                        <strong>Connection Error:</strong> {errorMessage}
                      </p>
                    </div>
                    <p className="mt-2 ml-7">
                      Please make sure your Flask backend is running on localhost:5000, or try enabling mock mode.
                    </p>
                  </div>
                )}
                
                <div className="mt-6">
                  <Button 
                    onClick={handleAnalyze}
                    className="w-full medical-btn-primary"
                    disabled={!selectedFile || isAnalyzing}
                  >
                    {isAnalyzing ? "Analyzing..." : "Analyze X-Ray"}
                  </Button>
                </div>
                
                {isAnalyzing && (
                  <div className="mt-6">
                    <p className="text-sm text-gray-600 mb-2">
                      Analyzing your X-ray image...
                    </p>
                    <Progress value={progress} className="h-2" />
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Results Section */}
            <Card className={`medical-card ${!result && 'bg-gray-50'}`}>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Analysis Results</h2>
                
                {result ? (
                  <div className="space-y-6">
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center mb-4">
                        <div className={`w-3 h-3 rounded-full mr-2 ${
                          result.prediction === 'Pneumonia' ? 'bg-red-500' : 'bg-green-500'
                        }`}></div>
                        <h3 className="text-lg font-medium">{result.prediction}</h3>
                      </div>
                      
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-1">Confidence Level:</p>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className={`h-2.5 rounded-full ${
                              result.prediction === 'Pneumonia' ? 'bg-red-600' : 'bg-green-600'
                            }`}
                            style={{ width: `${result.confidence * 100}%` }}
                          ></div>
                        </div>
                        <p className="text-right text-xs text-gray-500 mt-1">
                          {Math.round(result.confidence * 100)}%
                        </p>
                      </div>
                      
                      <div className="border-t border-gray-200 pt-4 mt-4">
                        <p className="text-sm text-gray-600 mb-2">Analysis Details:</p>
                        <ul className="text-sm text-gray-700 space-y-1">
                          <li className="flex justify-between">
                            <span>Report ID:</span>
                            <span className="font-medium">{result.reportId}</span>
                          </li>
                          <li className="flex justify-between">
                            <span>Date:</span>
                            <span className="font-medium">
                              {new Date(result.timestamp).toLocaleDateString()}
                            </span>
                          </li>
                          <li className="flex justify-between">
                            <span>Time:</span>
                            <span className="font-medium">
                              {new Date(result.timestamp).toLocaleTimeString()}
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <Button 
                        className="medical-btn-secondary"
                        onClick={handleDownloadReport}
                        disabled={!result.reportDownloadUrl}
                      >
                        Download Report
                      </Button>
                    </div>
                    
                    {result.prediction === 'Pneumonia' && (
                      <div className="bg-red-50 border-l-4 border-red-400 p-4 mt-4">
                        <div className="flex">
                          <svg className="h-5 w-5 text-red-400 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          <div>
                            <p className="text-sm text-red-700">
                              This analysis suggests pneumonia may be present. Please consult with a healthcare professional for proper diagnosis and treatment.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <p className="text-gray-500">
                      Upload and analyze an X-ray to see results
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-12">
            <h2 className="text-2xl font-semibold mb-4">How to Prepare Your X-Ray for Analysis</h2>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <ol className="list-decimal list-inside space-y-4 text-gray-700">
                <li>
                  <span className="font-medium">Use a clear digital image:</span> 
                  <p className="ml-6 mt-1">Ensure your X-ray image is clear and not blurry. Higher resolution images yield better results.</p>
                </li>
                <li>
                  <span className="font-medium">Proper orientation:</span>
                  <p className="ml-6 mt-1">Make sure the X-ray is properly oriented (typically with the heart on the patient's left side).</p>
                </li>
                <li>
                  <span className="font-medium">Full view of the lungs:</span>
                  <p className="ml-6 mt-1">The image should include the entire lung fields for the most accurate analysis.</p>
                </li>
                <li>
                  <span className="font-medium">Remove personal information:</span>
                  <p className="ml-6 mt-1">Consider cropping out any personal identifying information from the image before uploading.</p>
                </li>
                <li>
                  <span className="font-medium">File formats:</span>
                  <p className="ml-6 mt-1">Use common image formats like JPEG, PNG, or DICOM format if available.</p>
                </li>
              </ol>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-blue-800 font-medium">Important Disclaimer:</p>
                <p className="text-blue-700 text-sm mt-1">
                  This AI analysis tool is designed to assist, not replace, professional medical diagnosis. 
                  Always consult with a healthcare provider for a proper diagnosis and treatment plan.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default XrayAnalysis;

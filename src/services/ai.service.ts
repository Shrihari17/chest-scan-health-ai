
// This service connects to the Flask backend for AI model predictions and chatbot functionality

export interface XrayAnalysisResult {
  prediction: "Normal" | "Pneumonia";
  confidence: number;
  imageUrl: string;
  timestamp: string;
  reportId: string;
  reportDownloadUrl?: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

// Default to localhost in development, can be overridden
const FLASK_BASE_URL = import.meta.env.VITE_FLASK_API_URL || "http://localhost:5000";

// Enable mock mode for testing without a backend
const USE_MOCK_MODE = import.meta.env.VITE_USE_MOCK_MODE === "true" || false;

export const aiService = {
  // Function to analyze chest X-ray by sending to Flask backend
  analyzeXray: async (imageFile: File): Promise<XrayAnalysisResult> => {
    // If in mock mode, return mock data
    if (USE_MOCK_MODE) {
      console.log("Using mock mode for X-ray analysis");
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create a mock result
      return {
        prediction: Math.random() > 0.5 ? "Pneumonia" : "Normal",
        confidence: 0.85 + Math.random() * 0.1,
        imageUrl: URL.createObjectURL(imageFile),
        timestamp: new Date().toISOString(),
        reportId: `MOCK_REP_${Date.now()}`,
        reportDownloadUrl: "#mock-report"
      };
    }
    
    const formData = new FormData();
    formData.append('file', imageFile);
    
    try {
      console.log(`Sending request to ${FLASK_BASE_URL}/detect`);
      
      const response = await fetch(`${FLASK_BASE_URL}/detect`, {
        method: 'POST',
        body: formData,
        credentials: 'include', // Important for session handling
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Backend error:', errorText);
        throw new Error(`Backend error: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log("Backend response:", result);
      
      // Handle the reportDownloadUrl if provided by backend
      const reportDownloadUrl = result.report_download_url;
      
      return {
        prediction: result.prediction === "Pneumonia" ? "Pneumonia" : "Normal",
        confidence: result.confidence || 0.95,
        imageUrl: result.image_url,
        timestamp: new Date().toISOString(),
        reportId: result.report_id,
        reportDownloadUrl: reportDownloadUrl
      };
    } catch (error) {
      console.error('Error analyzing X-ray:', error);
      throw error;
    }
  },
  
  // Function to get chatbot responses from Flask backend
  getChatResponse: async (message: string): Promise<ChatMessage> => {
    // If in mock mode, return mock data
    if (USE_MOCK_MODE) {
      console.log("Using mock mode for chat");
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock responses based on keywords
      let response = "I'm here to help with questions about pneumonia. You can ask about symptoms, causes, treatment, prevention, or diagnosis.";
      
      if (message.toLowerCase().includes("symptoms")) {
        response = "Common symptoms of pneumonia include chest pain, coughing, fatigue, fever, shortness of breath...";
      } else if (message.toLowerCase().includes("causes")) {
        response = "Pneumonia is typically caused by infection with bacteria, viruses, or fungi...";
      } else if (message.toLowerCase().includes("treatment")) {
        response = "Treatment depends on the cause of pneumonia. Bacterial pneumonia is treated with antibiotics...";
      }
      
      return {
        role: "assistant",
        content: response,
        timestamp: new Date().toISOString()
      };
    }
    
    try {
      console.log(`Sending chat request to ${FLASK_BASE_URL}/chat`);
      
      const response = await fetch(`${FLASK_BASE_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
        credentials: 'include', // Important for session handling
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Chat backend error:', errorText);
        throw new Error(`Chat backend error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      return {
        role: "assistant",
        content: data.response,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error getting chat response:', error);
      throw error;
    }
  }
};

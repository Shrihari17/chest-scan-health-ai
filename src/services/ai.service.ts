
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

const FLASK_BASE_URL = "http://localhost:5000"; // Change this when deploying

export const aiService = {
  // Function to analyze chest X-ray by sending to Flask backend
  analyzeXray: async (imageFile: File): Promise<XrayAnalysisResult> => {
    const formData = new FormData();
    formData.append('file', imageFile);
    
    try {
      const response = await fetch(`${FLASK_BASE_URL}/detect`, {
        method: 'POST',
        body: formData,
        credentials: 'include', // Important for session handling
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const result = await response.json();
      
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
    try {
      const response = await fetch(`${FLASK_BASE_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
        credentials: 'include', // Important for session handling
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
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

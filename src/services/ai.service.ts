
// This is a mock service that simulates interactions with AI models
// In a real application, this would make API calls to your backend

export interface XrayAnalysisResult {
  prediction: "Normal" | "Pneumonia";
  confidence: number;
  imageUrl: string;
  timestamp: string;
  reportId: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

// Sample responses for the chatbot
const AI_RESPONSES: Record<string, string> = {
  "symptoms": "Common symptoms of pneumonia include chest pain, coughing, fatigue, fever, shortness of breath, and in some cases, confusion or low energy, especially in older adults.",
  "causes": "Pneumonia is typically caused by infection with bacteria, viruses, or fungi. The most common cause is the bacterium Streptococcus pneumoniae. Risk factors include smoking, weakened immune system, and certain chronic illnesses.",
  "treatment": "Treatment depends on the cause of pneumonia. Bacterial pneumonia is treated with antibiotics. Viral pneumonia may be treated with antiviral medications. Rest, hydration, and over-the-counter medications for fever and pain are also recommended.",
  "prevention": "Vaccination is key to preventing pneumonia. Both pneumococcal and flu vaccines can help. Other preventive measures include good hygiene practices, avoiding smoking, and maintaining good overall health.",
  "diagnosis": "Pneumonia is diagnosed through physical examinations, chest X-rays, blood tests, pulse oximetry, sputum tests, and sometimes CT scans or pleural fluid cultures in more severe cases.",
  "risk": "People at higher risk for pneumonia include older adults, young children, smokers, people with chronic diseases, and those with weakened immune systems.",
  "default": "I'm an AI assistant specialized in providing information about pneumonia and lung health. Feel free to ask me about symptoms, causes, treatment, prevention, or any other related topic."
};

export const aiService = {
  // Mock function to analyze chest X-ray
  analyzeXray: async (imageFile: File): Promise<XrayAnalysisResult> => {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Create a URL for the image (in a real app, this would be processed by your ML model)
    const imageUrl = URL.createObjectURL(imageFile);
    
    // Random result for demonstration
    const isPneumonia = Math.random() = 1;
    
    // Generate a random confidence value between 70% and 99%
    const confidence = 0.7 + Math.random() * 0.29;
    
    return {
      prediction: isPneumonia ? "Pneumonia" : "Normal",
      confidence: confidence,
      imageUrl,
      timestamp: new Date().toISOString(),
      reportId: `REP-${Math.floor(Math.random() * 1000000)}`
    };
  },
  
  // Mock function for chatbot responses
  getChatResponse: async (message: string): Promise<ChatMessage> => {
    // Simulate response delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    let response = AI_RESPONSES.default;
    
    // Simple keyword matching for demo purposes
    const lowerMsg = message.toLowerCase();
    if (lowerMsg.includes("symptom") || lowerMsg.includes("feel")) {
      response = AI_RESPONSES.symptoms;
    } else if (lowerMsg.includes("cause") || lowerMsg.includes("why") || lowerMsg.includes("how get")) {
      response = AI_RESPONSES.causes;
    } else if (lowerMsg.includes("treat") || lowerMsg.includes("cure") || lowerMsg.includes("medicine")) {
      response = AI_RESPONSES.treatment;
    } else if (lowerMsg.includes("prevent") || lowerMsg.includes("avoid")) {
      response = AI_RESPONSES.prevention;
    } else if (lowerMsg.includes("diagnos") || lowerMsg.includes("test")) {
      response = AI_RESPONSES.diagnosis;
    } else if (lowerMsg.includes("risk") || lowerMsg.includes("danger")) {
      response = AI_RESPONSES.risk;
    }
    
    return {
      role: "assistant",
      content: response,
      timestamp: new Date().toISOString()
    };
  }
};

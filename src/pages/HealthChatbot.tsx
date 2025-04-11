
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { authService } from '@/services/auth.service';
import { aiService, ChatMessage } from '@/services/ai.service';

const HealthChatbot = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Hello! I\'m your lung health assistant. How can I help you today? You can ask me about pneumonia symptoms, causes, treatment, or prevention.',
      timestamp: new Date().toISOString()
    }
  ]);
  const [userMessage, setUserMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const currentUser = authService.getCurrentUser();
  const isLoggedIn = !!currentUser;
  
  // Redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      toast({
        title: "Authentication Required",
        description: "Please log in to access this feature",
        variant: "destructive"
      });
      navigate('/login');
    }
  }, [isLoggedIn, navigate, toast]);
  
  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!userMessage.trim()) return;
    
    // Add user message to chat
    const userChatMsg: ChatMessage = {
      role: 'user',
      content: userMessage,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userChatMsg]);
    setUserMessage('');
    setIsTyping(true);
    
    try {
      // Get AI response
      const response = await aiService.getChatResponse(userMessage);
      setMessages(prev => [...prev, response]);
    } catch (error) {
      console.error('Error getting chat response:', error);
      // Add error message
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'I\'m sorry, I encountered an error processing your request. Please try again.',
        timestamp: new Date().toISOString()
      }]);
      
      toast({
        title: "Communication Error",
        description: "There was an error contacting the AI assistant. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsTyping(false);
    }
  };

  const getSampleQuestions = () => [
    "What are the symptoms of pneumonia?",
    "How is pneumonia diagnosed?",
    "Can pneumonia be prevented?",
    "What's the difference between viral and bacterial pneumonia?",
    "Who is at higher risk for pneumonia?",
    "How long does it take to recover from pneumonia?"
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header isLoggedIn={isLoggedIn} />
      
      <main className="flex-grow py-12 bg-gray-50">
        <div className="medical-container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Chat Area */}
            <div className="lg:col-span-2">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Lung Health Chatbot</h1>
              <p className="text-gray-600 mb-6">
                Ask questions about pneumonia and other lung-related health concerns
              </p>
              
              <Card className="medical-card">
                <CardContent className="p-0">
                  {/* Chat Messages */}
                  <div className="h-[60vh] overflow-y-auto p-6">
                    {messages.map((message, index) => (
                      <div key={index} className={`mb-4 ${message.role === 'user' ? 'text-right' : ''}`}>
                        <div className={`inline-block max-w-[85%] p-4 rounded-lg ${
                          message.role === 'user' 
                            ? 'bg-medical-primary text-white rounded-tr-none'
                            : 'bg-gray-100 text-gray-800 rounded-tl-none'
                        }`}>
                          <p>{message.content}</p>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </p>
                      </div>
                    ))}
                    
                    {isTyping && (
                      <div className="mb-4">
                        <div className="inline-block max-w-[85%] p-4 rounded-lg bg-gray-100 text-gray-800 rounded-tl-none">
                          <div className="flex space-x-2">
                            <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"></div>
                            <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse delay-100"></div>
                            <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse delay-200"></div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div ref={messagesEndRef} />
                  </div>
                  
                  <Separator />
                  
                  {/* Message Input */}
                  <form onSubmit={handleSendMessage} className="p-4 flex items-center">
                    <Input
                      type="text"
                      placeholder="Type your question here..."
                      value={userMessage}
                      onChange={(e) => setUserMessage(e.target.value)}
                      className="medical-input flex-1"
                      disabled={isTyping}
                    />
                    <Button 
                      type="submit" 
                      className="ml-2 medical-btn-primary"
                      disabled={!userMessage.trim() || isTyping}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                      </svg>
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
            
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card className="medical-card mb-6">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Sample Questions</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {getSampleQuestions().map((question, index) => (
                      <li key={index}>
                        <Button 
                          variant="outline" 
                          className="w-full justify-start text-left h-auto py-2 text-sm"
                          onClick={() => {
                            setUserMessage(question);
                            // Focus on input
                            document.querySelector('input')?.focus();
                          }}
                        >
                          {question}
                        </Button>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="medical-card">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">About This Chatbot</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-gray-600 space-y-4">
                  <p>
                    This AI-powered chatbot is designed to provide general information about pneumonia 
                    and lung health. It uses natural language processing to understand your questions 
                    and provide evidence-based responses.
                  </p>
                  <p>
                    You can ask about symptoms, diagnosis, treatment options, prevention strategies, 
                    risk factors, and more.
                  </p>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <p className="text-yellow-800 font-medium">Important Note:</p>
                    <p className="text-yellow-700 mt-1">
                      This chatbot is for informational purposes only and does not provide medical advice. 
                      Always consult with a qualified healthcare professional for medical concerns.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default HealthChatbot;

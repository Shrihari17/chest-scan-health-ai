
// This is a mock service that simulates authentication with a backend
// In a real application, this would make API calls to your backend

interface User {
  id: string;
  name: string;
  email: string;
  dob?: string;
  phone?: string;
  medicalHistory?: string;
  isAdmin?: boolean;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  dob: string;
  phone: string;
  medicalHistory: string;
}

// Mock database
const USERS_DB: User[] = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@example.com",
    isAdmin: true
  },
  {
    id: "2",
    name: "John Doe",
    email: "patient@example.com",
    dob: "1990-01-01",
    phone: "123-456-7890",
    medicalHistory: "No significant medical history"
  }
];

// Mock passwords (in a real app, passwords would be hashed and stored in the backend)
const PASSWORDS: Record<string, string> = {
  "admin@example.com": "admin123",
  "patient@example.com": "patient123"
};

export const authService = {
  login: async (credentials: LoginCredentials): Promise<User | null> => {
    // Simulate API request delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const user = USERS_DB.find(u => u.email === credentials.email);
    if (user && PASSWORDS[credentials.email] === credentials.password) {
      return user;
    }
    return null;
  },
  
  register: async (data: RegisterData): Promise<User | null> => {
    // Simulate API request delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Check if user already exists
    if (USERS_DB.some(u => u.email === data.email)) {
      throw new Error("User with this email already exists");
    }
    
    // Create new user
    const newUser: User = {
      id: (USERS_DB.length + 1).toString(),
      name: data.name,
      email: data.email,
      dob: data.dob,
      phone: data.phone,
      medicalHistory: data.medicalHistory
    };
    
    // In a real app, this would be an API call to create the user
    USERS_DB.push(newUser);
    PASSWORDS[data.email] = data.password;
    
    return newUser;
  },
  
  logout: async (): Promise<void> => {
    // Simulate API request delay
    await new Promise(resolve => setTimeout(resolve, 500));
    // In a real app, this would invalidate the session on the server
  },
  
  getCurrentUser: (): User | null => {
    const userStr = sessionStorage.getItem('user');
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch (e) {
      console.error("Error parsing user from sessionStorage", e);
      return null;
    }
  },
  
  getAllPatients: async (): Promise<User[]> => {
    // Simulate API request delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Return only non-admin users
    return USERS_DB.filter(user => !user.isAdmin);
  }
};

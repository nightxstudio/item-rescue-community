
import { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { UserProfile } from "@/types";

interface AuthContextType {
  user: UserProfile | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  isProfileComplete: boolean;
  login: (email: string, password: string) => Promise<void>;
  googleLogin: () => Promise<void>;
  appleLogin: () => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  completeProfile: (profile: Partial<UserProfile>) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  deleteAccount: () => Promise<void>;
}

// Create the auth context
const AuthContext = createContext<AuthContextType | null>(null);

// Mock user data for demonstration
const mockUserData: UserProfile = {
  email: "user@example.com",
  name: "John Doe",
  dob: "1990-01-01",
  gender: "male",
  phoneNumber: "1234567890",
  occupation: "student",
  studentType: "college",
  collegeName: "Example College",
  universityRollNo: "12345",
  branch: "Computer Science",
  collegeSection: "A",
  collegeClassRollNo: "CS101"
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Check if user is logged in
    const checkAuth = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);
  
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      // Mock login - in a real app, this would be an API call
      if (email && password) {
        // Mock successful login
        localStorage.setItem("user", JSON.stringify(mockUserData));
        setUser(mockUserData);
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const googleLogin = async () => {
    try {
      setIsLoading(true);
      // Mock Google login
      localStorage.setItem("user", JSON.stringify(mockUserData));
      setUser(mockUserData);
    } catch (error) {
      console.error("Google login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const appleLogin = async () => {
    try {
      setIsLoading(true);
      // Mock Apple login
      localStorage.setItem("user", JSON.stringify(mockUserData));
      setUser(mockUserData);
    } catch (error) {
      console.error("Apple login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const register = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      // Mock registration - in a real app, this would be an API call
      if (email && password) {
        // Create a basic user without profile information
        const newUser: UserProfile = {
          email,
          name: "",
          dob: "",
          gender: "male",
          phoneNumber: "",
          occupation: "student",
        };
        localStorage.setItem("user", JSON.stringify(newUser));
        setUser(newUser);
      } else {
        throw new Error("Invalid registration data");
      }
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = async () => {
    try {
      setIsLoading(true);
      // Remove user from local storage
      localStorage.removeItem("user");
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const completeProfile = async (profile: Partial<UserProfile>) => {
    try {
      setIsLoading(true);
      // In a real app, this would be an API call to update the user profile
      if (user) {
        const updatedUser = { ...user, ...profile };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
      }
    } catch (error) {
      console.error("Profile update error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const resetPassword = async (email: string) => {
    try {
      setIsLoading(true);
      // Mock password reset - in a real app, this would be an API call
      console.log("Password reset requested for:", email);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error("Password reset error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const deleteAccount = async () => {
    try {
      setIsLoading(true);
      // Mock account deletion - in a real app, this would be an API call
      localStorage.removeItem("user");
      setUser(null);
    } catch (error) {
      console.error("Account deletion error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Check if the user profile is complete
  const isProfileComplete = !!user && !!user.name && !!user.dob && !!user.phoneNumber;
  
  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        isLoading,
        isProfileComplete,
        login,
        googleLogin,
        appleLogin,
        logout,
        register,
        completeProfile,
        resetPassword,
        deleteAccount
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return context;
};

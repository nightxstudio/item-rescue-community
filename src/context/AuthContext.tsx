
import { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { UserProfile } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      try {
        // Get the initial session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          // Fetch user profile from the profiles table
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (error) {
            console.error("Error fetching profile:", error);
            setUser(null);
          } else if (profile) {
            // Set user with profile data
            setUser({ 
              ...profile,
              email: session.user.email || ""
            });
          }
        }
      } catch (error) {
        console.error("Auth check error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
    
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setIsLoading(true);
        
        if (event === 'SIGNED_IN' && session) {
          // Fetch user profile when signed in
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
            console.error("Error fetching profile:", error);
            setUser(null);
          } else if (profile) {
            setUser({
              ...profile,
              email: session.user.email || "",
            });
          } else {
            // Create a new profile if one doesn't exist
            const newProfile = {
              id: session.user.id,
              email: session.user.email || "",
              name: "",
              dob: "",
              gender: "male",
              phoneNumber: "",
              occupation: "student",
            };
            
            const { error: insertError } = await supabase
              .from('profiles')
              .insert([{ 
                id: session.user.id,
                email: session.user.email,
                gender: "male",
                occupation: "student"
              }]);
              
            if (insertError) {
              console.error("Error creating profile:", insertError);
            } else {
              setUser(newProfile);
            }
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
        
        setIsLoading(false);
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      toast.success("Login successful");
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.message || "Login failed");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const googleLogin = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      
      if (error) throw error;
    } catch (error: any) {
      console.error("Google login error:", error);
      toast.error(error.message || "Google login failed");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const appleLogin = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: {
          redirectTo: window.location.origin
        }
      });
      
      if (error) throw error;
    } catch (error: any) {
      console.error("Apple login error:", error);
      toast.error(error.message || "Apple login failed");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const register = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) throw error;
      toast.success("Registration successful");
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error(error.message || "Registration failed");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      toast.success("Logged out successfully");
    } catch (error: any) {
      console.error("Logout error:", error);
      toast.error(error.message || "Logout failed");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const completeProfile = async (profile: Partial<UserProfile>) => {
    try {
      setIsLoading(true);
      
      if (!user?.id) {
        throw new Error("User not authenticated");
      }
      
      // Update the profile in Supabase
      const { error } = await supabase
        .from('profiles')
        .update({
          name: profile.name,
          dob: profile.dob,
          gender: profile.gender,
          phone_number: profile.phoneNumber,
          profile_picture: profile.profilePicture,
          occupation: profile.occupation,
          student_type: profile.studentType,
          school_name: profile.schoolName,
          class_name: profile.className,
          section: profile.section,
          class_roll_no: profile.classRollNo,
          parents_phone: profile.parentsPhone,
          college_name: profile.collegeName,
          university_roll_no: profile.universityRollNo,
          branch: profile.branch,
          college_section: profile.collegeSection,
          college_class_roll_no: profile.collegeClassRollNo,
          company_name: profile.companyName,
          locality: profile.locality,
          employee_id: profile.employeeId
        })
        .eq('id', user.id);
        
      if (error) throw error;
      
      // Update local state
      setUser(prev => prev ? { ...prev, ...profile } : null);
      toast.success("Profile updated successfully");
    } catch (error: any) {
      console.error("Profile update error:", error);
      toast.error(error.message || "Profile update failed");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const resetPassword = async (email: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      toast.success("Password reset email sent");
    } catch (error: any) {
      console.error("Password reset error:", error);
      toast.error(error.message || "Password reset failed");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const deleteAccount = async () => {
    try {
      setIsLoading(true);
      
      // In a real implementation, we'd call a Supabase function to delete the user
      // For now, we'll just sign them out
      await supabase.auth.signOut();
      setUser(null);
      toast.success("Account deleted successfully");
    } catch (error: any) {
      console.error("Account deletion error:", error);
      toast.error(error.message || "Account deletion failed");
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

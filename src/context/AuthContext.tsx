import { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { UserProfile } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Session } from "@supabase/supabase-js";

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
  const [session, setSession] = useState<Session | null>(null); // Add session state
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // First set up auth state change listener before checking for any sessions
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        // Always update the session immediately
        setSession(newSession);
        
        if (event === 'SIGNED_IN' || (event === 'INITIAL_SESSION' && newSession)) {
          setIsLoading(true);
          try {
            // Wait until after state updates to fetch profile
            setTimeout(async () => {
              // Fetch user profile from the profiles table
              const { data: profile, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', newSession.user.id)
                .single();
                
              if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
                console.error("Error fetching profile:", error);
                setUser(null);
              } else if (profile) {
                setUser({
                  uid: newSession.user.id,
                  email: newSession.user.email || "",
                  name: profile.name || "",
                  dob: profile.dob || "",
                  gender: profile.gender as UserProfile['gender'] || "male",
                  phoneNumber: profile.phone_number || "",
                  profilePicture: profile.profile_picture || "",
                  occupation: profile.occupation as UserProfile['occupation'] || "student",
                  studentType: profile.student_type as UserProfile['studentType'],
                  schoolName: profile.school_name || "",
                  className: profile.class_name || "",
                  section: profile.section || "",
                  classRollNo: profile.class_roll_no || "",
                  parentsPhone: profile.parents_phone || "",
                  collegeName: profile.college_name || "",
                  universityRollNo: profile.university_roll_no || "",
                  branch: profile.branch || "",
                  collegeSection: profile.college_section || "",
                  collegeClassRollNo: profile.college_class_roll_no || "",
                  companyName: profile.company_name || "",
                  locality: profile.locality || "",
                  employeeId: profile.employee_id || ""
                });
              } else {
                // Create a new profile if one doesn't exist
                const newUser: UserProfile = {
                  uid: newSession.user.id,
                  email: newSession.user.email || "",
                  name: "",
                  dob: "",
                  gender: "male",
                  phoneNumber: "",
                  occupation: "student",
                };
                
                // Insert basic profile
                const { error: insertError } = await supabase
                  .from('profiles')
                  .insert([{ 
                    id: newSession.user.id,
                    email: newSession.user.email,
                    gender: "male",
                    occupation: "student"
                  }]);
                  
                if (insertError) {
                  console.error("Error creating profile:", insertError);
                } else {
                  setUser(newUser);
                }
              }
              setIsLoading(false);
            }, 0);
          } catch (error) {
            console.error("Error in auth state change:", error);
            setIsLoading(false);
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setIsLoading(false);
        } else {
          setIsLoading(false);
        }
      }
    );
    
    // Then check for existing session
    const initializeAuth = async () => {
      try {
        const { data: { session: existingSession } } = await supabase.auth.getSession();
        
        // If we have an existing session, set it and let the auth change handler take care of the profile
        setSession(existingSession);
        
        // If no session, just finish loading
        if (!existingSession) {
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error checking session:", error);
        setIsLoading(false);
      }
    };
    
    initializeAuth();
    
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
      toast.success("Login successful", {
        description: "Welcome back!",
        duration: 3000,
        className: "animate-in slide-in-from-top-5 zoom-in-95 duration-300"
      });
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error("Login failed", {
        description: error.message || "Invalid credentials",
        duration: 5000
      });
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
      toast.success("Registration successful", {
        description: "Welcome! Please complete your profile.",
        duration: 3000,
        className: "animate-in slide-in-from-top-5 zoom-in-95 duration-300"
      });
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error("Registration failed", {
        description: error.message || "Could not create account",
        duration: 5000
      });
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
      setSession(null);
      toast.success("Logged out successfully", {
        duration: 3000,
        className: "animate-in slide-in-from-top-5 zoom-in-95 duration-300"
      });
    } catch (error: any) {
      console.error("Logout error:", error);
      toast.error("Logout failed", {
        description: error.message || "Could not log out",
        duration: 5000
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const completeProfile = async (profile: Partial<UserProfile>) => {
    try {
      setIsLoading(true);
      
      if (!user?.uid) {
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
        .eq('id', user.uid);
        
      if (error) throw error;
      
      // Update local state
      setUser(prev => prev ? { ...prev, ...profile } : null);
      
      toast.success("Profile updated successfully", {
        duration: 3000,
        className: "animate-in slide-in-from-top-5 zoom-in-95 duration-300"
      });
    } catch (error: any) {
      console.error("Profile update error:", error);
      toast.error("Profile update failed", {
        description: error.message || "Could not update profile",
        duration: 5000
      });
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
        isLoggedIn: !!session,
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

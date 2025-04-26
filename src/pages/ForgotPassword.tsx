
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { isValidEmail } from "@/utils/validation";
import { ArrowLeft, CheckCircle } from "lucide-react";

const ForgotPassword = () => {
  const { resetPassword } = useAuth();
  
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const validateForm = (): boolean => {
    if (!email) {
      setError("Email is required");
      return false;
    }
    
    if (!isValidEmail(email)) {
      setError("Please enter a valid Gmail address");
      return false;
    }
    
    setError("");
    return true;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setIsLoading(true);
      await resetPassword(email);
      setIsSubmitted(true);
    } catch (error) {
      console.error("Password reset failed:", error);
      setError("Failed to send reset instructions. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4">
      <Card className="w-full max-w-md shadow-xl border-slate-200 dark:border-slate-800 animate-in fade-in-50 duration-300">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            {isSubmitted ? "Check your email" : "Reset your password"}
          </CardTitle>
          <CardDescription className="text-center">
            {isSubmitted
              ? "We've sent you instructions to reset your password"
              : "Enter your email and we'll send you instructions to reset your password"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isSubmitted ? (
            <div className="flex flex-col items-center justify-center py-6 space-y-4">
              <div className="rounded-full bg-primary/10 p-3">
                <CheckCircle className="h-10 w-10 text-primary" />
              </div>
              <p className="text-center text-sm text-slate-600 dark:text-slate-400">
                Please check your email inbox for instructions on how to reset your password. If you don't see it, please check your spam folder.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.name@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={error ? "border-destructive" : ""}
                />
                {error && (
                  <p className="text-sm text-destructive">{error}</p>
                )}
              </div>
              
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Sending instructions..." : "Send reset instructions"}
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link 
            to="/login" 
            className="flex items-center text-sm text-primary hover:underline"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to login
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ForgotPassword;

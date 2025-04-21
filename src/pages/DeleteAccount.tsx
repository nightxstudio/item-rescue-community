
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertCircle } from "lucide-react";

const DeleteAccount = () => {
  const navigate = useNavigate();
  const { user, deleteAccount } = useAuth();
  
  const [confirmText, setConfirmText] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  const isConfirmValid = confirmText === "DELETE";
  
  const handleRequestDelete = () => {
    if (!isConfirmValid) return;
    setIsDialogOpen(true);
  };
  
  const handleFinalDelete = async () => {
    try {
      setIsLoading(true);
      setError("");
      
      await deleteAccount();
      
      // Navigate to home page after account deletion
      navigate("/");
    } catch (error) {
      console.error("Account deletion failed:", error);
      setError("Failed to delete account. Please try again later.");
      setIsDialogOpen(false);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="max-w-md mx-auto py-8">
      <h1 className="text-3xl font-bold text-center mb-6">Delete Account</h1>
      
      <Card className="shadow-md border-destructive/20">
        <CardHeader className="space-y-1">
          <CardTitle className="text-xl text-destructive">Delete Your Account</CardTitle>
          <CardDescription>
            This action is permanent and cannot be undone. All your data will be erased.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-destructive/10 p-4 rounded-md flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-destructive mb-1">Warning</p>
              <ul className="text-sm space-y-1 text-slate-700 dark:text-slate-300 list-disc list-inside">
                <li>Your profile information will be permanently deleted</li>
                <li>Your lost and found item reports will be removed</li>
                <li>You won't be able to recover your account</li>
              </ul>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirm">Type DELETE to confirm</Label>
            <Input
              id="confirm"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="DELETE"
              className="border-slate-300"
            />
          </div>
          
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
        </CardContent>
        <CardFooter>
          <Button
            variant="destructive"
            className="w-full"
            disabled={!isConfirmValid || isLoading}
            onClick={handleRequestDelete}
          >
            {isLoading ? "Deleting Account..." : "Delete Account"}
          </Button>
        </CardFooter>
      </Card>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. Your account and all associated data will be permanently deleted.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              If you're sure you want to delete your account, click the button below.
            </p>
          </div>
          
          <DialogFooter className="sm:justify-start">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleFinalDelete}
              disabled={isLoading}
            >
              {isLoading ? "Deleting..." : "Yes, Delete My Account"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DeleteAccount;

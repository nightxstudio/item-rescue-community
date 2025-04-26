
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { AlertCircle, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const AccountManagement = () => {
  const navigate = useNavigate();
  const { deleteAccount } = useAuth();
  
  const [confirmText, setConfirmText] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  
  const isConfirmValid = confirmText === "DELETE";

  const handleRequestDelete = () => {
    if (!isConfirmValid) return;
    setIsDialogOpen(true);
  };
  
  const handleFinalDelete = async () => {
    try {
      setIsLoading(true);
      setDeleteError("");
      
      await deleteAccount();
      
      navigate("/");
    } catch (error) {
      console.error("Account deletion failed:", error);
      setDeleteError("Failed to delete account. Please try again later.");
      setIsDialogOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold mb-3 text-destructive">Account Management</h2>
      <Card className="p-6 border-destructive/60 bg-destructive/10">
        <h3 className="font-medium text-destructive mb-4">Delete Your Account</h3>
        
        <div className="bg-destructive/20 p-4 rounded-md flex items-start gap-3 mb-4">
          <AlertCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-destructive mb-1">Warning</p>
            <ul className="text-sm space-y-1 text-white list-disc list-inside">
              <li>Your profile information will be permanently deleted</li>
              <li>Your lost and found item reports will be removed</li>
              <li>You won't be able to recover your account</li>
            </ul>
          </div>
        </div>
        
        <div className="space-y-2 mb-4">
          <Label htmlFor="confirm">Type DELETE to confirm</Label>
          <Input
            id="confirm"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="DELETE"
            className="border-slate-300"
          />
        </div>
        
        {deleteError && (
          <p className="text-sm text-destructive mb-4">{deleteError}</p>
        )}
        
        <Button
          variant="destructive"
          className="w-full"
          disabled={!isConfirmValid || isLoading}
          onClick={handleRequestDelete}
        >
          <Trash2 className="w-5 h-5 mr-2" />
          {isLoading ? "Deleting Account..." : "Delete Account"}
        </Button>
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

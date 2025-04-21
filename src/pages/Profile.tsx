
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/utils/validation";
import { Pencil, Save, X } from "lucide-react";

const Profile = () => {
  const navigate = useNavigate();
  const { user, completeProfile, isProfileComplete } = useAuth();
  
  const [editing, setEditing] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || "");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(user?.profilePicture || null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  useEffect(() => {
    // If profile isn't complete, redirect to profile completion
    if (user && !isProfileComplete) {
      navigate("/profile-completion");
    }
  }, [user, isProfileComplete, navigate]);
  
  if (!user) return null;
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSave = async () => {
    try {
      setIsLoading(true);
      setError("");
      
      // In a real app, you would upload the image to storage
      // and get back a URL to store in the user profile
      const profilePicture = imagePreview || undefined;
      
      await completeProfile({
        phoneNumber,
        profilePicture
      });
      
      setEditing(false);
    } catch (error) {
      console.error("Update failed:", error);
      setError("Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCancel = () => {
    setEditing(false);
    setPhoneNumber(user.phoneNumber || "");
    setImagePreview(user.profilePicture || null);
    setProfileImage(null);
  };
  
  const getOccupationText = () => {
    if (user.occupation === 'student') {
      return user.studentType === 'school' ? 'School Student' : 'College Student';
    }
    return 'Working Professional';
  };
  
  const getOrganizationText = () => {
    if (user.occupation === 'student') {
      if (user.studentType === 'school') {
        return user.schoolName || 'N/A';
      } else {
        return user.collegeName || 'N/A';
      }
    }
    return user.companyName || 'N/A';
  };
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Profile</h1>
      
      <Card className="shadow-md">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Personal Information</CardTitle>
            {!editing ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditing(true)}
              >
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </Button>
            ) : (
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancel}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleSave}
                  disabled={isLoading}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col items-center space-y-3">
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-primary bg-secondary">
                {imagePreview || user.profilePicture ? (
                  <img
                    src={imagePreview || user.profilePicture}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-3xl font-bold text-primary">
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </span>
                  </div>
                )}
                {editing && (
                  <Label
                    htmlFor="profilePicture"
                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity cursor-pointer text-white text-sm font-medium"
                  >
                    Change Photo
                  </Label>
                )}
              </div>
              {editing && (
                <Input
                  id="profilePicture"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              )}
              <h2 className="text-xl font-semibold">{user.name}</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {getOccupationText()}
              </p>
            </div>
            
            <div className="flex-1 space-y-4">
              {error && (
                <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm">
                  {error}
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-sm text-slate-500">Email</Label>
                  <p>{user.email}</p>
                </div>
                
                <div className="space-y-1">
                  <Label className="text-sm text-slate-500">Date of Birth</Label>
                  <p>{user.dob ? formatDate(user.dob) : 'N/A'}</p>
                </div>
                
                <div className="space-y-1">
                  <Label className="text-sm text-slate-500">Gender</Label>
                  <p className="capitalize">{user.gender}</p>
                </div>
                
                <div className="space-y-1">
                  <Label className="text-sm text-slate-500">Phone Number</Label>
                  {editing ? (
                    <Input
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="10-digit number"
                    />
                  ) : (
                    <p>{user.phoneNumber || 'N/A'}</p>
                  )}
                </div>
                
                <div className="space-y-1">
                  <Label className="text-sm text-slate-500">Organization</Label>
                  <p>{getOrganizationText()}</p>
                </div>
                
                {user.occupation === 'student' && user.studentType === 'school' && (
                  <>
                    <div className="space-y-1">
                      <Label className="text-sm text-slate-500">Class</Label>
                      <p>{user.className || 'N/A'}</p>
                    </div>
                    
                    <div className="space-y-1">
                      <Label className="text-sm text-slate-500">Section</Label>
                      <p>{user.section || 'N/A'}</p>
                    </div>
                    
                    <div className="space-y-1">
                      <Label className="text-sm text-slate-500">Roll Number</Label>
                      <p>{user.classRollNo || 'N/A'}</p>
                    </div>
                  </>
                )}
                
                {user.occupation === 'student' && user.studentType === 'college' && (
                  <>
                    <div className="space-y-1">
                      <Label className="text-sm text-slate-500">University Roll No.</Label>
                      <p>{user.universityRollNo || 'N/A'}</p>
                    </div>
                    
                    <div className="space-y-1">
                      <Label className="text-sm text-slate-500">Branch</Label>
                      <p>{user.branch || 'N/A'}</p>
                    </div>
                    
                    <div className="space-y-1">
                      <Label className="text-sm text-slate-500">Section</Label>
                      <p>{user.collegeSection || 'N/A'}</p>
                    </div>
                    
                    <div className="space-y-1">
                      <Label className="text-sm text-slate-500">Roll Number</Label>
                      <p>{user.collegeClassRollNo || 'N/A'}</p>
                    </div>
                  </>
                )}
                
                {user.occupation === 'professional' && (
                  <>
                    <div className="space-y-1">
                      <Label className="text-sm text-slate-500">Locality</Label>
                      <p>{user.locality || 'N/A'}</p>
                    </div>
                    
                    <div className="space-y-1">
                      <Label className="text-sm text-slate-500">Employee ID</Label>
                      <p>{user.employeeId || 'N/A'}</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;

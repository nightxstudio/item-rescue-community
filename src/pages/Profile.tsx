
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/utils/validation";
import { Pencil, Save, X } from "lucide-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { UserOccupation, StudentType } from "@/types";

import { colleges, companies, schools, localities } from "@/data/organizationData";

const Profile = () => {
  const navigate = useNavigate();
  const { user, completeProfile, isProfileComplete } = useAuth();
  
  const [editing, setEditing] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || "");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(user?.profilePicture || null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [editedData, setEditedData] = useState({
    phoneNumber: user?.phoneNumber || "",
    occupation: user?.occupation || "student",
    studentType: user?.studentType || "college",
    schoolName: user?.schoolName || "",
    className: user?.className || "",
    section: user?.section || "",
    classRollNo: user?.classRollNo || "",
    parentsPhone: user?.parentsPhone || "",
    collegeName: user?.collegeName || "",
    universityRollNo: user?.universityRollNo || "",
    branch: user?.branch || "",
    collegeSection: user?.collegeSection || "",
    collegeClassRollNo: user?.collegeClassRollNo || "",
    companyName: user?.companyName || "",
    locality: user?.locality || "",
    employeeId: user?.employeeId || "",
  });

  useEffect(() => {
    if (user && !isProfileComplete) {
      navigate("/profile-completion");
    }
  }, [user, isProfileComplete, navigate]);
  
  if (!user) return null;
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleEditChange = (name: string, value: string) => {
    if (name === "occupation") {
      if (value === "student") {
        setEditedData(prev => ({
          ...prev,
          occupation: value as UserOccupation,
          studentType: "college" as StudentType,
          collegeName: "",
          universityRollNo: "",
          branch: "",
          collegeSection: "",
          collegeClassRollNo: "",
          schoolName: "",
          className: "",
          section: "",
          classRollNo: "",
          parentsPhone: "",
          companyName: "",
          locality: "",
          employeeId: "",
        }));
      } else {
        setEditedData(prev => ({
          ...prev,
          occupation: value as UserOccupation,
          companyName: "",
          locality: "",
          employeeId: "",
          studentType: undefined as any,
          schoolName: "",
          className: "",
          section: "",
          classRollNo: "",
          parentsPhone: "",
          collegeName: "",
          universityRollNo: "",
          branch: "",
          collegeSection: "",
          collegeClassRollNo: "",
        }));
      }
      return;
    }
    setEditedData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      setError("");
      
      const profilePicture = imagePreview || undefined;
      
      await completeProfile({
        phoneNumber: editedData.phoneNumber,
        profilePicture,
        occupation: editedData.occupation,
        studentType: editedData.studentType,
        schoolName: editedData.schoolName,
        className: editedData.className,
        section: editedData.section,
        classRollNo: editedData.classRollNo,
        parentsPhone: editedData.parentsPhone,
        collegeName: editedData.collegeName,
        universityRollNo: editedData.universityRollNo,
        branch: editedData.branch,
        collegeSection: editedData.collegeSection,
        collegeClassRollNo: editedData.collegeClassRollNo,
        companyName: editedData.companyName,
        locality: editedData.locality,
        employeeId: editedData.employeeId,
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
    setEditedData({
      phoneNumber: user.phoneNumber || "",
      occupation: user.occupation || "student",
      studentType: user.studentType || "college",
      schoolName: user.schoolName || "",
      className: user.className || "",
      section: user.section || "",
      classRollNo: user.classRollNo || "",
      parentsPhone: user.parentsPhone || "",
      collegeName: user.collegeName || "",
      universityRollNo: user.universityRollNo || "",
      branch: user.branch || "",
      collegeSection: user.collegeSection || "",
      collegeClassRollNo: user.collegeClassRollNo || "",
      companyName: user.companyName || "",
      locality: user.locality || "",
      employeeId: user.employeeId || "",
    });
    setImagePreview(user.profilePicture || null);
    setProfileImage(null);
    setError("");
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
                <span className="flex items-center gap-2">
                  <span>Edit</span>
                </span>
              </Button>
            ) : (
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancel}
                >
                  <span className="flex items-center gap-2">
                    <span>Cancel</span>
                  </span>
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleSave}
                  disabled={isLoading}
                >
                  <span className="flex items-center gap-2">
                    <span>Save</span>
                  </span>
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
                <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm">{error}</div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-sm text-slate-500">Email</Label>
                  <p>{user.email}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm text-slate-500">Date of Birth</Label>
                  <Input value={user.dob || "N/A"} disabled />
                </div>
                <div className="space-y-1">
                  <Label className="text-sm text-slate-500">Gender</Label>
                  <Input value={user.gender || "N/A"} disabled className="capitalize" />
                </div>
                <div className="space-y-1">
                  <Label className="text-sm text-slate-500">Phone Number</Label>
                  {editing ? (
                    <Input
                      value={editedData.phoneNumber}
                      onChange={(e) => handleEditChange("phoneNumber", e.target.value)}
                      placeholder="10-digit number"
                    />
                  ) : (
                    <p>{user.phoneNumber || 'N/A'}</p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label className="text-sm text-slate-500">Occupation</Label>
                  {editing ? (
                    <Select
                      value={editedData.occupation}
                      onValueChange={(value) => handleEditChange("occupation", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your occupation" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="professional">Working Professional</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <p>{getOccupationText()}</p>
                  )}
                </div>

                {editing && editedData.occupation === 'student' && (
                  <>
                    <div className="space-y-1">
                      <Label className="text-sm text-slate-500">Student Type</Label>
                      <Select
                        value={editedData.studentType}
                        onValueChange={(value) => handleEditChange("studentType", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select student type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="school">School Student</SelectItem>
                          <SelectItem value="college">College Student</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {editedData.studentType === "school" && (
                      <>
                        <div className="space-y-1">
                          <Label className="text-sm text-slate-500">School Name</Label>
                          <Select
                            value={editedData.schoolName}
                            onValueChange={(value) => handleEditChange("schoolName", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select school" />
                            </SelectTrigger>
                            <SelectContent>
                              {schools.map((school) => (
                                <SelectItem key={school} value={school}>
                                  {school}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-sm text-slate-500">Class</Label>
                          <Input
                            value={editedData.className}
                            onChange={e => handleEditChange("className", e.target.value)}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-sm text-slate-500">Section</Label>
                          <Input
                            value={editedData.section}
                            onChange={e => handleEditChange("section", e.target.value)}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-sm text-slate-500">Roll Number</Label>
                          <Input
                            value={editedData.classRollNo}
                            onChange={e => handleEditChange("classRollNo", e.target.value)}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-sm text-slate-500">Parent's Phone (Optional)</Label>
                          <Input
                            value={editedData.parentsPhone}
                            onChange={e => handleEditChange("parentsPhone", e.target.value)}
                          />
                        </div>
                      </>
                    )}
                    {editedData.studentType === "college" && (
                      <>
                        <div className="space-y-1">
                          <Label className="text-sm text-slate-500">College Name</Label>
                          <Select
                            value={editedData.collegeName}
                            onValueChange={(value) => handleEditChange("collegeName", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select college" />
                            </SelectTrigger>
                            <SelectContent>
                              {colleges.map((college) => (
                                <SelectItem key={college} value={college}>
                                  {college}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-sm text-slate-500">University Roll No.</Label>
                          <Input
                            value={editedData.universityRollNo}
                            onChange={e => handleEditChange("universityRollNo", e.target.value)}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-sm text-slate-500">Branch</Label>
                          <Input
                            value={editedData.branch}
                            onChange={e => handleEditChange("branch", e.target.value)}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-sm text-slate-500">Section</Label>
                          <Input
                            value={editedData.collegeSection}
                            onChange={e => handleEditChange("collegeSection", e.target.value)}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-sm text-slate-500">Class Roll No.</Label>
                          <Input
                            value={editedData.collegeClassRollNo}
                            onChange={e => handleEditChange("collegeClassRollNo", e.target.value)}
                          />
                        </div>
                      </>
                    )}
                  </>
                )}
                {editing && editedData.occupation === "professional" && (
                  <>
                    <div className="space-y-1">
                      <Label className="text-sm text-slate-500">Company Name</Label>
                      <Select
                        value={editedData.companyName}
                        onValueChange={(value) => handleEditChange("companyName", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select company" />
                        </SelectTrigger>
                        <SelectContent>
                          {companies.map((company) => (
                            <SelectItem key={company} value={company}>
                              {company}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-sm text-slate-500">Locality</Label>
                      <Select
                        value={editedData.locality}
                        onValueChange={(value) => handleEditChange("locality", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select locality" />
                        </SelectTrigger>
                        <SelectContent>
                          {localities.map((loc) => (
                            <SelectItem key={loc} value={loc}>
                              {loc}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-sm text-slate-500">Employee ID</Label>
                      <Input
                        value={editedData.employeeId}
                        onChange={e => handleEditChange("employeeId", e.target.value)}
                      />
                    </div>
                  </>
                )}

                {!editing && (
                  <>
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

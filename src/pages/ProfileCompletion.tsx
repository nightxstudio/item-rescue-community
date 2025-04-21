import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserProfile, UserOccupation, Gender, StudentType } from "@/types";
import { isValidName, isValidPhoneNumber } from "@/utils/validation";
import { ArrowRight } from "lucide-react";
import { colleges, companies, schools, localities } from "@/data/organizationData";

const ProfileCompletion = () => {
  const navigate = useNavigate();
  const { user, completeProfile, isProfileComplete } = useAuth();
  
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    name: user?.name || "",
    dob: user?.dob || "",
    gender: user?.gender || "male",
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
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(user?.profilePicture || null);
  
  useEffect(() => {
    if (isProfileComplete) {
      navigate("/profile");
    }
  }, [isProfileComplete, navigate]);
  
  const validateBasicInfo = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name) {
      newErrors.name = "Name is required";
    } else if (!isValidName(formData.name)) {
      newErrors.name = "Name must be at least 3 characters";
    }
    
    if (!formData.dob) {
      newErrors.dob = "Date of birth is required";
    }
    
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!isValidPhoneNumber(formData.phoneNumber)) {
      newErrors.phoneNumber = "Please enter a valid 10-digit phone number";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const validateOccupationInfo = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (formData.occupation === 'student') {
      if (formData.studentType === 'school') {
        if (!formData.schoolName) {
          newErrors.schoolName = "School name is required";
        }
        if (!formData.className) {
          newErrors.className = "Class is required";
        }
        if (!formData.section) {
          newErrors.section = "Section is required";
        }
        if (!formData.classRollNo) {
          newErrors.classRollNo = "Class roll number is required";
        }
      } else {
        if (!formData.collegeName) {
          newErrors.collegeName = "College name is required";
        }
        if (!formData.universityRollNo) {
          newErrors.universityRollNo = "University roll number is required";
        }
        if (!formData.branch) {
          newErrors.branch = "Branch is required";
        }
        if (!formData.collegeSection) {
          newErrors.collegeSection = "Section is required";
        }
        if (!formData.collegeClassRollNo) {
          newErrors.collegeClassRollNo = "Class roll number is required";
        }
      }
    } else {
      if (!formData.companyName) {
        newErrors.companyName = "Company name is required";
      }
      if (!formData.locality) {
        newErrors.locality = "Locality is required";
      }
      if (!formData.employeeId) {
        newErrors.employeeId = "Employee ID is required";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    if (name === "occupation") {
      if (value === "student") {
        setFormData(prev => ({
          ...prev,
          occupation: value as UserOccupation,
          studentType: "college",
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
        setFormData(prev => ({
          ...prev,
          occupation: value as UserOccupation,
          companyName: "",
          locality: "",
          employeeId: "",
          studentType: undefined,
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
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
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
  
  const handleNextStep = () => {
    if (step === 1 && validateBasicInfo()) {
      setStep(2);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateOccupationInfo()) return;
    
    try {
      setIsLoading(true);
      
      const profilePicture = imagePreview || undefined;
      
      await completeProfile({
        ...formData,
        profilePicture
      });
      
      navigate("/profile");
    } catch (error) {
      console.error("Profile completion failed:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-2xl shadow-xl border-slate-200 dark:border-slate-800 animate-in fade-in-50 duration-300">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Complete your profile</CardTitle>
          <CardDescription className="text-center">
            {step === 1 
              ? "Let's start with your basic information" 
              : "Tell us about your occupation"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 1 ? (
            <div className="space-y-6">
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-primary bg-secondary">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Profile preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-3xl font-bold text-primary">
                        {formData.name ? formData.name.charAt(0).toUpperCase() : 'U'}
                      </span>
                    </div>
                  )}
                  <Label
                    htmlFor="profileImage"
                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity cursor-pointer text-white text-sm font-medium"
                  >
                    Change Photo
                  </Label>
                  <Input
                    id="profileImage"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </div>
                <p className="text-xs text-slate-500">
                  Click to upload a profile picture (1:1 ratio recommended)
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={errors.name ? "border-destructive" : ""}
                    disabled
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth</Label>
                  <Input
                    id="dob"
                    name="dob"
                    type="date"
                    value={formData.dob}
                    onChange={handleInputChange}
                    className={errors.dob ? "border-destructive" : ""}
                    disabled
                  />
                  {errors.dob && (
                    <p className="text-sm text-destructive">{errors.dob}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label>Gender</Label>
                  <RadioGroup
                    value={formData.gender}
                    onValueChange={(value) => handleSelectChange("gender", value as Gender)}
                    className="flex space-x-4"
                    disabled
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="male" />
                      <Label htmlFor="male" className="cursor-pointer">Male</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="female" />
                      <Label htmlFor="female" className="cursor-pointer">Female</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="transgender" id="transgender" />
                      <Label htmlFor="transgender" className="cursor-pointer">Transgender</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    placeholder="10-digit number"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className={errors.phoneNumber ? "border-destructive" : ""}
                  />
                  {errors.phoneNumber && (
                    <p className="text-sm text-destructive">{errors.phoneNumber}</p>
                  )}
                </div>
              </div>
              
              <Button
                type="button"
                className="w-full"
                onClick={handleNextStep}
              >
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="occupation">Occupation</Label>
                  <Select
                    value={formData.occupation}
                    onValueChange={(value) => handleSelectChange("occupation", value as UserOccupation)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your occupation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="professional">Working Professional</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {formData.occupation === 'student' ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="studentType">Student Type</Label>
                      <Select
                        value={formData.studentType}
                        onValueChange={(value) => handleSelectChange("studentType", value as StudentType)}
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
                    
                    {formData.studentType === 'school' ? (
                      <Tabs defaultValue="school" className="w-full">
                        <TabsContent value="school" className="mt-0 space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="schoolName">School Name</Label>
                            <Select
                              value={formData.schoolName}
                              onValueChange={(value) => handleSelectChange("schoolName", value)}
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
                            {errors.schoolName && (
                              <p className="text-sm text-destructive">{errors.schoolName}</p>
                            )}
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="className">Class</Label>
                              <Input
                                id="className"
                                name="className"
                                placeholder="e.g., 10th"
                                value={formData.className}
                                onChange={handleInputChange}
                                className={errors.className ? "border-destructive" : ""}
                              />
                              {errors.className && (
                                <p className="text-sm text-destructive">{errors.className}</p>
                              )}
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="section">Section</Label>
                              <Input
                                id="section"
                                name="section"
                                placeholder="e.g., A"
                                value={formData.section}
                                onChange={handleInputChange}
                                className={errors.section ? "border-destructive" : ""}
                              />
                              {errors.section && (
                                <p className="text-sm text-destructive">{errors.section}</p>
                              )}
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="classRollNo">Class Roll No.</Label>
                              <Input
                                id="classRollNo"
                                name="classRollNo"
                                placeholder="e.g., 42"
                                value={formData.classRollNo}
                                onChange={handleInputChange}
                                className={errors.classRollNo ? "border-destructive" : ""}
                              />
                              {errors.classRollNo && (
                                <p className="text-sm text-destructive">{errors.classRollNo}</p>
                              )}
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="parentsPhone">Parent's Phone (Optional)</Label>
                              <Input
                                id="parentsPhone"
                                name="parentsPhone"
                                placeholder="10-digit number"
                                value={formData.parentsPhone}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>
                        </TabsContent>
                      </Tabs>
                    ) : (
                      <Tabs defaultValue="college" className="w-full">
                        <TabsContent value="college" className="mt-0 space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="collegeName">College Name</Label>
                            <Select
                              value={formData.collegeName}
                              onValueChange={(value) => handleSelectChange("collegeName", value)}
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
                            {errors.collegeName && (
                              <p className="text-sm text-destructive">{errors.collegeName}</p>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="universityRollNo">University Roll No.</Label>
                              <Input
                                id="universityRollNo"
                                name="universityRollNo"
                                placeholder="e.g., 12345678"
                                value={formData.universityRollNo}
                                onChange={handleInputChange}
                                className={errors.universityRollNo ? "border-destructive" : ""}
                              />
                              {errors.universityRollNo && (
                                <p className="text-sm text-destructive">{errors.universityRollNo}</p>
                              )}
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="branch">Branch</Label>
                              <Input
                                id="branch"
                                name="branch"
                                placeholder="e.g., Computer Science"
                                value={formData.branch}
                                onChange={handleInputChange}
                                className={errors.branch ? "border-destructive" : ""}
                              />
                              {errors.branch && (
                                <p className="text-sm text-destructive">{errors.branch}</p>
                              )}
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="collegeSection">Section</Label>
                              <Input
                                id="collegeSection"
                                name="collegeSection"
                                placeholder="e.g., A"
                                value={formData.collegeSection}
                                onChange={handleInputChange}
                                className={errors.collegeSection ? "border-destructive" : ""}
                              />
                              {errors.collegeSection && (
                                <p className="text-sm text-destructive">{errors.collegeSection}</p>
                              )}
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="collegeClassRollNo">Class Roll No.</Label>
                              <Input
                                id="collegeClassRollNo"
                                name="collegeClassRollNo"
                                placeholder="e.g., 42"
                                value={formData.collegeClassRollNo}
                                onChange={handleInputChange}
                                className={errors.collegeClassRollNo ? "border-destructive" : ""}
                              />
                              {errors.collegeClassRollNo && (
                                <p className="text-sm text-destructive">{errors.collegeClassRollNo}</p>
                              )}
                            </div>
                          </div>
                        </TabsContent>
                      </Tabs>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Company Name</Label>
                      <Select
                        value={formData.companyName}
                        onValueChange={(value) => handleSelectChange("companyName", value)}
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
                      {errors.companyName && (
                        <p className="text-sm text-destructive">{errors.companyName}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="locality">Locality</Label>
                      <Select
                        value={formData.locality}
                        onValueChange={(value) => handleSelectChange("locality", value)}
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
                      {errors.locality && (
                        <p className="text-sm text-destructive">{errors.locality}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="employeeId">Employee ID</Label>
                      <Input
                        id="employeeId"
                        name="employeeId"
                        placeholder="e.g., EMP123456"
                        value={formData.employeeId}
                        onChange={handleInputChange}
                        className={errors.employeeId ? "border-destructive" : ""}
                      />
                      {errors.employeeId && (
                        <p className="text-sm text-destructive">{errors.employeeId}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setStep(1)}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={isLoading}
                >
                  {isLoading ? "Completing Profile..." : "Complete Profile"}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileCompletion;

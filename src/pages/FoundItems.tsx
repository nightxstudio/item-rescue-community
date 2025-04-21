
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FoundItem } from "@/types";
import { Image, MapPin, Plus, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const mockFoundItems: FoundItem[] = [
  {
    id: "1",
    createdBy: "user1",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=300&q=80",
    location: "Main Library, 2nd Floor",
    description: "Found a blue wallet with student ID cards inside. No cash. Found near the computer section.",
    createdAt: "2023-10-18T09:15:00.000Z",
    organization: "Example University",
    organizationType: "college"
  },
  {
    id: "2",
    createdBy: "user2",
    image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?auto=format&fit=crop&w=300&q=80",
    location: "Student Center",
    description: "Found a pair of black-rimmed glasses in a red case. Found on a table near the cafeteria entrance.",
    createdAt: "2023-10-22T16:45:00.000Z",
    organization: "Example University",
    organizationType: "college"
  }
];

const FoundItems = () => {
  const { user } = useAuth();
  const { toast: uiToast } = useToast();
  const [showFoundItemForm, setShowFoundItemForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [itemImage, setItemImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const filteredFoundItems = mockFoundItems.filter(item => {
    return searchQuery === "" || 
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase());
  });
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setItemImage(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!itemImage && !imagePreview) {
      newErrors.image = "Please upload an image of the found item";
    }
    
    if (!location) {
      newErrors.location = "Please specify where you found the item";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setIsLoading(true);
      
      // Get the user ID from the authenticated user
      const userId = user?.uid;
      
      if (!userId) {
        throw new Error("User not authenticated");
      }
      
      const { data, error } = await supabase
        .from('found_items')
        .insert([
          {
            created_by: userId,
            image: imagePreview,
            location,
            description,
            organization: user?.schoolName || user?.collegeName || user?.companyName || '',
            organization_type: user?.occupation === 'student' 
              ? user.studentType 
              : user?.occupation === 'professional' 
                ? 'company' 
                : ''
          }
        ])
        .select()
        .single();

      if (error) throw error;

      setItemImage(null);
      setImagePreview(null);
      setLocation("");
      setDescription("");
      setShowFoundItemForm(false);
      
      // Show success toast
      toast.success("Item posted successfully", {
        description: "Your found item has been reported.",
        position: "bottom-center",
        duration: 3000,
      });
      
    } catch (error) {
      console.error("Failed to submit found item:", error);
      toast.error("Failed to post item", {
        description: "Please try again later.",
        position: "bottom-center",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Found Items</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Report items you've found or check if someone found what you lost
          </p>
        </div>
        
        <Button
          onClick={() => setShowFoundItemForm(!showFoundItemForm)}
          className="flex items-center"
        >
          {showFoundItemForm ? (
            <>Cancel</>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              Report Found Item
            </>
          )}
        </Button>
      </div>
      
      {showFoundItemForm ? (
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Report a Found Item</CardTitle>
            <CardDescription>
              Provide details about the item you've found
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="foundItemImage">Upload Image</Label>
                <div className="flex items-center gap-4">
                  <div className="relative w-32 h-32 border-2 border-dashed border-slate-300 rounded-md flex items-center justify-center bg-slate-50 dark:bg-slate-900">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Item preview"
                        className="w-full h-full object-cover rounded-md"
                      />
                    ) : (
                      <Image className="h-10 w-10 text-slate-400" />
                    )}
                    <Label
                      htmlFor="foundItemImage"
                      className="absolute inset-0 cursor-pointer"
                    />
                    <Input
                      id="foundItemImage"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Upload a clear image of the found item to help others identify it.
                    </p>
                    {errors.image && (
                      <p className="text-sm text-destructive mt-1">{errors.image}</p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Where did you find it?</Label>
                <Input
                  id="location"
                  placeholder="E.g., Library, 2nd floor, near the computers"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className={errors.location ? "border-destructive" : ""}
                />
                {errors.location && (
                  <p className="text-sm text-destructive">{errors.location}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="foundDescription">Description (Optional)</Label>
                <Textarea
                  id="foundDescription"
                  placeholder="Add any additional details that might help identify the owner"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[120px]"
                />
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setShowFoundItemForm(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? "Creating Ticket..." : "Create Ticket"}
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <>
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              placeholder="Search for found items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {filteredFoundItems.length === 0 ? (
            <div className="py-12 text-center">
              <h3 className="text-xl font-medium mb-2">No found items reported yet</h3>
              <p className="text-slate-600 dark:text-slate-400">
                {searchQuery
                  ? "Try changing your search criteria"
                  : "If you've found an item, please report it to help others"
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFoundItems.map((item) => (
                <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-48 overflow-hidden">
                    <img
                      src={item.image}
                      alt="Found item"
                      className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                    />
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-2 mb-3">
                      <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-sm">{item.location}</p>
                        <p className="text-xs text-slate-500">
                          Found on {formatDate(item.createdAt || "")}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm line-clamp-3 mb-3">
                      {item.description || "No description provided"}
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      Claim This Item
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FoundItems;

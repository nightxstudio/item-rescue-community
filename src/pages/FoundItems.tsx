
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const FoundItems = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [foundItems, setFoundItems] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch found items
  useEffect(() => {
    const fetchFoundItems = async () => {
      try {
        const { data, error } = await supabase
          .from('found_items')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) {
          console.error("Error fetching found items:", error);
          return;
        }
        
        setFoundItems(data || []);
      } catch (error) {
        console.error("Error fetching found items:", error);
      }
    };
    
    fetchFoundItems();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const uploadImage = async (file: File): Promise<string> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;
      
      // In a real implementation, we would upload to Supabase Storage
      // For now, return the imagePreview as base64
      return imagePreview || '';
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("You must be logged in to report a found item");
      return;
    }
    
    if (!location || !description) {
      toast.error("Please fill all required fields", {
        description: "Location and description are required",
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Upload image if provided
      let imageUrl = '';
      if (image) {
        imageUrl = await uploadImage(image);
      }
      
      // Insert found item into database
      const { error } = await supabase
        .from('found_items')
        .insert([{
          created_by: user.uid, // Using uid instead of id
          location,
          description,
          image: imageUrl,
          organization: user.occupation === 'student' 
            ? (user.studentType === 'school' ? user.schoolName : user.collegeName) 
            : user.companyName,
          organization_type: user.occupation === 'student'
            ? (user.studentType === 'school' ? 'school' : 'college')
            : 'company'
        }]);
        
      if (error) throw error;
      
      // Reset form
      setLocation("");
      setDescription("");
      setImage(null);
      setImagePreview(null);
      
      // Show success toast
      toast.success("Item reported successfully", {
        description: "Thank you for reporting the found item!",
        position: "bottom-center",
        duration: 3000,
        className: "animate-in slide-in-from-bottom-5 duration-300",
      });
      
      // Refresh found items list
      const { data: newData } = await supabase
        .from('found_items')
        .select('*')
        .order('created_at', { ascending: false });
        
      setFoundItems(newData || []);
      setIsSubmitting(false);
    } catch (error) {
      console.error("Error reporting found item:", error);
      toast.error("Failed to report item", {
        description: "There was a problem saving your report.",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Report Found Items</h1>
      
      <Card className="shadow-md">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="image">Image (Optional)</Label>
              <div className="flex items-center gap-4">
                {imagePreview && (
                  <div className="relative w-24 h-24 rounded-md overflow-hidden border">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      className="absolute top-1 right-1 bg-black bg-opacity-50 rounded-full p-1 text-white"
                      onClick={() => {
                        setImage(null);
                        setImagePreview(null);
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                )}
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className={imagePreview ? "w-auto flex-1" : "w-full"}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location" className="required">Location <span className="text-red-500">*</span></Label>
              <Input
                id="location"
                placeholder="Where did you find it?"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description" className="required">Description <span className="text-red-500">*</span></Label>
              <Textarea
                id="description"
                placeholder="Describe the item you found..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={4}
              />
            </div>
            
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Report Found Item"}
            </Button>
          </form>
        </CardContent>
      </Card>
      
      <h2 className="text-2xl font-bold mt-8">Recent Found Items</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {foundItems.length > 0 ? (
          foundItems.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              {item.image && (
                <div className="h-48 overflow-hidden">
                  <img
                    src={item.image}
                    alt="Found item"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <CardContent className="p-4">
                <div className="font-medium">Location: {item.location}</div>
                <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                <div className="text-xs text-gray-400 mt-2">
                  Reported {new Date(item.created_at).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-8 text-gray-500">
            No found items reported yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default FoundItems;

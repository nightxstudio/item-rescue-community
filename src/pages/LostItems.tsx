import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { LostItem } from "@/types";
import { Image, Plus, Search } from "lucide-react";

// Mock data for lost items
const mockLostItems: LostItem[] = [
  {
    id: "1",
    createdBy: "user1",
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=300&q=80",
    category: "Electronics",
    lostDate: "2023-10-15",
    description: "MacBook Pro 13-inch, Silver, with a sticker of a mountain on the cover. Last seen in the library on the second floor.",
    phoneNumber: "1234567890",
    createdAt: "2023-10-16T12:00:00.000Z",
    organization: "Example University",
    organizationType: "college"
  },
  {
    id: "2",
    createdBy: "user2",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=300&q=80",
    category: "Books",
    lostDate: "2023-10-20",
    description: "Physics textbook by H.C. Verma, with blue cover. Has my name written on the first page. Lost near the cafeteria.",
    phoneNumber: "9876543210",
    createdAt: "2023-10-21T14:30:00.000Z",
    organization: "Example University",
    organizationType: "college"
  },
  {
    id: "3",
    createdBy: "user3",
    image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=300&q=80",
    category: "Others",
    lostDate: "2023-10-25",
    description: "Red water bottle with black cap, has a sticker of mountain biking. Lost in the sports complex during the basketball practice.",
    phoneNumber: "5556667777",
    createdAt: "2023-10-25T18:15:00.000Z",
    organization: "Example University",
    organizationType: "college"
  }
];

// Item categories
const categories = [
  "Electronics",
  "Books",
  "Stationery",
  "Clothing",
  "ID Cards",
  "Keys",
  "Bags",
  "Sports Equipment",
  "Jewelry",
  "Others"
];

const LostItems = () => {
  const { user } = useAuth();
  const [showLostItemForm, setShowLostItemForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCategory, setFilteredCategory] = useState<string>("");
  
  // Lost item form state
  const [itemImage, setItemImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [category, setCategory] = useState<string>("");
  const [lostDate, setLostDate] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Filter lost items based on search query and category
  const filteredLostItems = mockLostItems.filter(item => {
    const matchesSearch = searchQuery === "" || 
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = filteredCategory === "" || item.category === filteredCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setItemImage(file);
      
      // Create preview
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
      newErrors.image = "Please upload an image of the lost item";
    }
    
    if (!category) {
      newErrors.category = "Please select a category";
    }
    
    if (!lostDate) {
      newErrors.lostDate = "Please select the date when the item was lost";
    }
    
    if (!description) {
      newErrors.description = "Please provide a description of the lost item";
    } else if (description.length > 800) {
      newErrors.description = "Description must be less than 800 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setIsLoading(true);
      
      // In a real app, this would be an API call to create a new lost item
      console.log("Submitting lost item:", {
        image: itemImage,
        category,
        lostDate,
        description,
        phoneNumber: user?.phoneNumber
      });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Reset form
      setItemImage(null);
      setImagePreview(null);
      setCategory("");
      setLostDate("");
      setDescription("");
      setShowLostItemForm(false);
      
      // Add the new item to the list (in a real app, this would be done via API)
      // This is just for demonstration
      
    } catch (error) {
      console.error("Failed to submit lost item:", error);
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
          <h1 className="text-3xl font-bold">Lost Items</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Report lost items or browse items reported by others
          </p>
        </div>
        
        <Button
          onClick={() => setShowLostItemForm(!showLostItemForm)}
          className="flex items-center"
        >
          {showLostItemForm ? (
            <>Cancel</>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              Report Lost Item
            </>
          )}
        </Button>
      </div>
      
      {showLostItemForm ? (
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Report a Lost Item</CardTitle>
            <CardDescription>
              Provide details about the item you've lost
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="itemImage">Upload Image</Label>
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
                      htmlFor="itemImage"
                      className="absolute inset-0 cursor-pointer"
                    />
                    <Input
                      id="itemImage"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Upload a clear image of the lost item to help others identify it.
                    </p>
                    {errors.image && (
                      <p className="text-sm text-destructive mt-1">{errors.image}</p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={category}
                    onValueChange={setCategory}
                  >
                    <SelectTrigger className={errors.category ? "border-destructive" : ""}>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <p className="text-sm text-destructive">{errors.category}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="lostDate">Date of Loss</Label>
                  <Input
                    id="lostDate"
                    type="date"
                    value={lostDate}
                    onChange={(e) => setLostDate(e.target.value)}
                    className={errors.lostDate ? "border-destructive" : ""}
                  />
                  {errors.lostDate && (
                    <p className="text-sm text-destructive">{errors.lostDate}</p>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the item, including any identifying features, where you last saw it, etc."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={`min-h-[120px] ${errors.description ? "border-destructive" : ""}`}
                />
                <div className="flex justify-between">
                  {errors.description ? (
                    <p className="text-sm text-destructive">{errors.description}</p>
                  ) : (
                    <p className="text-xs text-slate-500">
                      Maximum 800 characters
                    </p>
                  )}
                  <p className="text-xs text-slate-500">
                    {description.length}/800
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Contact Phone Number</Label>
                <Input
                  id="phoneNumber"
                  value={user?.phoneNumber || ""}
                  disabled
                  className="bg-slate-50 dark:bg-slate-800"
                />
                <p className="text-xs text-slate-500">
                  This is your registered phone number. Others can contact you if they find your item.
                </p>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setShowLostItemForm(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? "Submitting..." : "Submit Report"}
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Search for lost items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select
              value={filteredCategory}
              onValueChange={setFilteredCategory}
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-categories">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {filteredLostItems.length === 0 ? (
            <div className="py-12 text-center">
              <h3 className="text-xl font-medium mb-2">No lost items found</h3>
              <p className="text-slate-600 dark:text-slate-400">
                {searchQuery || filteredCategory
                  ? "Try changing your search or filter criteria"
                  : "Be the first to report a lost item"
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLostItems.map((item) => (
                <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-48 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.description.substring(0, 20) + "..."}
                      className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                    />
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="bg-primary/10 text-primary text-xs font-medium px-2 py-1 rounded-full">
                        {item.category}
                      </div>
                      <div className="text-xs text-slate-500">
                        Lost on {formatDate(item.lostDate)}
                      </div>
                    </div>
                    <p className="text-sm line-clamp-3 mb-3">
                      {item.description}
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      Contact Owner
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

export default LostItems;

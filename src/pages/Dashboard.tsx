import { useState, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { formatDate } from "@/utils/dateUtils";
import { Calendar as CalendarIcon, Trash2 } from "lucide-react";
import ClockDisplay from "@/components/Clock";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import { useToast } from "@/hooks/use-toast";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button as ShadcnButton } from "@/components/ui/button";

const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("lost");
  const { toast } = useToast();

  const [lostFilterDate, setLostFilterDate] = useState<Date | undefined>();
  const [foundFilterDate, setFoundFilterDate] = useState<Date | undefined>();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; type: "lost" | "found" } | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const { data: lostItems = [], isLoading: isLoadingLost } = useQuery({
    queryKey: ['userLostItems'],
    queryFn: async () => {
      if (!user?.uid) return [];
      
      const { data, error } = await supabase
        .from('lost_items')
        .select('*')
        .eq('created_by', user.uid)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.uid
  });

  const { data: foundItems = [], isLoading: isLoadingFound } = useQuery({
    queryKey: ['userFoundItems'],
    queryFn: async () => {
      if (!user?.uid) return [];
      
      const { data, error } = await supabase
        .from('found_items')
        .select('*')
        .eq('created_by', user.uid)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.uid
  });

  const filteredLostItems = useMemo(() => {
    if (!lostFilterDate) return lostItems;
    return lostItems.filter(item => {
      const createdAt = new Date(item.created_at);
      return (
        createdAt.getFullYear() === lostFilterDate.getFullYear() &&
        createdAt.getMonth() === lostFilterDate.getMonth() &&
        createdAt.getDate() === lostFilterDate.getDate()
      );
    });
  }, [lostItems, lostFilterDate]);

  const filteredFoundItems = useMemo(() => {
    if (!foundFilterDate) return foundItems;
    return foundItems.filter(item => {
      const createdAt = new Date(item.created_at);
      return (
        createdAt.getFullYear() === foundFilterDate.getFullYear() &&
        createdAt.getMonth() === foundFilterDate.getMonth() &&
        createdAt.getDate() === foundFilterDate.getDate()
      );
    });
  }, [foundItems, foundFilterDate]);

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      if (deleteTarget.type === "lost") {
        const { error } = await supabase.from("lost_items").delete().eq("id", deleteTarget.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("found_items").delete().eq("id", deleteTarget.id);
        if (error) throw error;
      }
      toast({
        title: "Post deleted",
        description: "Your post has been deleted.",
        variant: "default",
        duration: 3000,
      });
      setDeleteDialogOpen(false);
      setDeleteTarget(null);
    } catch (e) {
      toast({
        title: "Failed to delete",
        description: "There was a problem deleting your post.",
        variant: "destructive",
      });
    } finally {
      setDeleteLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center">
          Dashboard
          <ClockDisplay />
        </h1>
      </div>
      
      <Tabs defaultValue="lost" onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="lost">Lost Items</TabsTrigger>
          <TabsTrigger value="found">Found Items</TabsTrigger>
        </TabsList>
        
        <TabsContent value="lost" className="space-y-4">
          <div className="flex justify-end mb-4">
            <Popover>
              <PopoverTrigger asChild>
                <ShadcnButton
                  variant="outline"
                  className="flex items-center gap-2 min-w-[155px]"
                >
                  <CalendarIcon size={16} className="mr-1" />
                  {lostFilterDate ? (
                    lostFilterDate.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  ) : (
                    <span>Filter by date</span>
                  )}
                </ShadcnButton>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={lostFilterDate}
                  onSelect={setLostFilterDate}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
            {lostFilterDate && (
              <button
                className="ml-2 text-xs text-gray-500 hover:underline"
                onClick={() => setLostFilterDate(undefined)}
                aria-label="Clear date filter"
              >
                Clear
              </button>
            )}
          </div>

          <h2 className="text-2xl font-semibold">My Lost Items</h2>
          {isLoadingLost ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : filteredLostItems.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              You haven't reported any lost items yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLostItems.map((item) => (
                <div key={item.id} className="relative group">
                  <Card className="overflow-hidden">
                    {item.image && (
                      <div className="h-48 overflow-hidden">
                        <img
                          src={item.image}
                          alt="Lost item"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <CardContent className="p-4">
                      <div className="mb-2 font-semibold">{item.category || 'Uncategorized'}</div>
                      <p className="text-sm text-gray-500 mb-2">{item.description}</p>
                      {item.lost_date && (
                        <div className="text-xs text-gray-400 mb-1">
                          Lost on: {formatDate(item.lost_date)}
                        </div>
                      )}
                      <div className="text-xs text-gray-400">
                        Reported: {formatDate(item.created_at)}
                      </div>
                    </CardContent>
                    <button
                      onClick={() => {
                        setDeleteTarget({ id: item.id, type: "lost" });
                        setDeleteDialogOpen(true);
                      }}
                      className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-[#ea384c] flex items-center justify-center shadow-md hover:bg-[#ce2339] focus:outline-none transition-all duration-150 z-10"
                      aria-label="Delete lost item post"
                    >
                      <Trash2 className="text-white" size={22} />
                    </button>
                  </Card>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="found" className="space-y-4">
          <div className="flex justify-end mb-4">
            <Popover>
              <PopoverTrigger asChild>
                <ShadcnButton
                  variant="outline"
                  className="flex items-center gap-2 min-w-[155px]"
                >
                  <CalendarIcon size={16} className="mr-1" />
                  {foundFilterDate ? (
                    foundFilterDate.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  ) : (
                    <span>Filter by date</span>
                  )}
                </ShadcnButton>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={foundFilterDate}
                  onSelect={setFoundFilterDate}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
            {foundFilterDate && (
              <button
                className="ml-2 text-xs text-gray-500 hover:underline"
                onClick={() => setFoundFilterDate(undefined)}
                aria-label="Clear date filter"
              >
                Clear
              </button>
            )}
          </div>

          <h2 className="text-2xl font-semibold">My Found Items</h2>
          {isLoadingFound ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : filteredFoundItems.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              You haven't reported any found items yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFoundItems.map((item) => (
                <div key={item.id} className="relative group">
                  <Card className="overflow-hidden">
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
                        Reported: {formatDate(item.created_at)}
                      </div>
                      {item.claimed_by && (
                        <div className="text-xs text-green-500 mt-1">
                          Claimed
                        </div>
                      )}
                    </CardContent>
                    <button
                      onClick={() => {
                        setDeleteTarget({ id: item.id, type: "found" });
                        setDeleteDialogOpen(true);
                      }}
                      className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-[#ea384c] flex items-center justify-center shadow-md hover:bg-[#ce2339] focus:outline-none transition-all duration-150 z-10"
                      aria-label="Delete found item post"
                    >
                      <Trash2 className="text-white" size={22} />
                    </button>
                  </Card>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
      <ConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={open => {
          setDeleteDialogOpen(open);
          if (!open) setDeleteTarget(null);
        }}
        title="Delete Post"
        description="Are you sure you want to delete this post? This action cannot be undone."
        onConfirm={handleDelete}
        loading={deleteLoading}
      />
    </div>
  );
};

export default Dashboard;

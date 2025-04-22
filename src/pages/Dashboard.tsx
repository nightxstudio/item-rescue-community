
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { formatDate } from "@/utils/dateUtils";

const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("lost");

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

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      <Tabs defaultValue="lost" onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="lost">Lost Items</TabsTrigger>
          <TabsTrigger value="found">Found Items</TabsTrigger>
        </TabsList>
        
        <TabsContent value="lost" className="space-y-4">
          <h2 className="text-2xl font-semibold">My Lost Items</h2>
          
          {isLoadingLost ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : lostItems.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              You haven't reported any lost items yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lostItems.map((item) => (
                <Card key={item.id} className="overflow-hidden">
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
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="found" className="space-y-4">
          <h2 className="text-2xl font-semibold">My Found Items</h2>
          
          {isLoadingFound ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : foundItems.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              You haven't reported any found items yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {foundItems.map((item) => (
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
                      Reported: {formatDate(item.created_at)}
                    </div>
                    {item.claimed_by && (
                      <div className="text-xs text-green-500 mt-1">
                        Claimed
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;


import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { formatDate } from "@/lib/utils";

const Dashboard = () => {
  const { user } = useAuth();
  
  // Fetch user's lost items
  const { data: lostItems = [] } = useQuery({
    queryKey: ['myLostItems'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lost_items')
        .select('*')
        .eq('created_by', user?.uid)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.uid
  });
  
  // Fetch user's found items
  const { data: foundItems = [] } = useQuery({
    queryKey: ['myFoundItems'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('found_items')
        .select('*')
        .eq('created_by', user?.uid)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.uid
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Dashboard</h1>
      
      <Tabs defaultValue="lost" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="lost">Lost Items ({lostItems.length})</TabsTrigger>
          <TabsTrigger value="found">Found Items ({foundItems.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="lost" className="mt-6">
          {lostItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lostItems.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  {item.image && (
                    <div className="h-48 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.description}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="bg-primary/10 text-primary text-xs font-medium px-2 py-1 rounded-full">
                        {item.category}
                      </div>
                      <div className="text-xs text-slate-500">
                        Lost on {formatDate(item.lost_date)}
                      </div>
                    </div>
                    <p className="text-sm line-clamp-3">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center text-slate-500 py-8">
              You haven't reported any lost items yet.
            </p>
          )}
        </TabsContent>
        
        <TabsContent value="found" className="mt-6">
          {foundItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {foundItems.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  {item.image && (
                    <div className="h-48 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.description}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="bg-primary/10 text-primary text-xs font-medium px-2 py-1 rounded-full">
                        {item.claimed_by ? 'Claimed' : 'Unclaimed'}
                      </div>
                      <div className="text-xs text-slate-500">
                        Found at {item.location}
                      </div>
                    </div>
                    <p className="text-sm line-clamp-3">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center text-slate-500 py-8">
              You haven't reported any found items yet.
            </p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;

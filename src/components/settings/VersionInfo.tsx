
import { Card } from "@/components/ui/card";
import { Shield, Info, Github } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const APP_VERSION = "Stable 2.0.0";
const RELEASE_DATE = "April 27, 2025";
const BUILD_NUMBER = "20250427-001";

export const VersionInfo = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold mb-3">System Information</h2>
      <Card className="p-6 space-y-6">
        <Tabs defaultValue="version" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="version">Version</TabsTrigger>
            <TabsTrigger value="changelog">Changelog</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
          </TabsList>
          
          <TabsContent value="version" className="space-y-4">
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-base font-medium">Current Version</h3>
                  <div className="text-2xl font-bold">{APP_VERSION}</div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Released on {RELEASE_DATE}
                  </p>
                </div>
                <div className="p-3 bg-primary/10 rounded-full">
                  <Info className="w-6 h-6 text-primary" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg bg-background">
                  <h4 className="font-medium mb-2">Build Information</h4>
                  <p className="text-sm text-muted-foreground">Build: {BUILD_NUMBER}</p>
                </div>
                
                <div className="p-4 border rounded-lg bg-background">
                  <h4 className="font-medium mb-2">System Status</h4>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <p className="text-sm text-muted-foreground">All systems operational</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="changelog" className="space-y-4">
            <div className="border rounded-lg p-4 bg-background">
              <h3 className="font-medium mb-2">Version 2.0.0</h3>
              <ul className="space-y-1 text-sm text-muted-foreground list-disc pl-5">
                <li>Added sidebar customization options</li>
                <li>Improved UI/UX with new theme options</li>
                <li>Enhanced security features</li>
                <li>Fixed various bugs and performance issues</li>
                <li>Added system information section</li>
              </ul>
              <div className="text-xs text-muted-foreground mt-2">Released on April 27, 2025</div>
            </div>
            
            <div className="border rounded-lg p-4 bg-background">
              <h3 className="font-medium mb-2">Version 1.5.0</h3>
              <ul className="space-y-1 text-sm text-muted-foreground list-disc pl-5">
                <li>Added dark mode support</li>
                <li>Improved accessibility features</li>
                <li>Enhanced mobile responsiveness</li>
                <li>Added account management features</li>
              </ul>
              <div className="text-xs text-muted-foreground mt-2">Released on March 15, 2025</div>
            </div>
          </TabsContent>
          
          <TabsContent value="about" className="space-y-4">
            <div className="text-center p-6 flex flex-col items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-full inline-flex mb-2">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Lost And Found Department</h3>
              <p className="text-muted-foreground mb-4 max-w-md">
                A secure and user-friendly system to help people find their lost items
                and return found items to their rightful owners.
              </p>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>© 2025 Lost And Found</span>
                <span>•</span>
                <a href="#" className="hover:underline hover:text-primary transition-colors">Privacy Policy</a>
                <span>•</span>
                <a href="#" className="hover:underline hover:text-primary transition-colors">Terms of Use</a>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};


import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Github, Linkedin, Mail, Twitter } from "lucide-react";

const DevelopersDesk = () => {
  return (
    <div className="space-y-8">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Developer's Desk</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          Meet the developer behind the Lost & Found Department platform
        </p>
      </div>
      
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-none shadow-xl max-w-4xl mx-auto overflow-hidden">
        <CardContent className="p-0">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-8 flex items-center justify-center">
              <div className="w-48 h-48 rounded-full border-4 border-white dark:border-slate-800 shadow-xl overflow-hidden bg-white dark:bg-slate-800">
                <img 
                  src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=400&q=80" 
                  alt="Developer" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            <div className="p-8 flex flex-col justify-center">
              <h2 className="text-2xl font-bold mb-2">John Developer</h2>
              <p className="text-primary font-medium mb-4">Full Stack Developer & UI/UX Designer</p>
              
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                I'm passionate about creating user-friendly applications that solve real-world problems. 
                The Lost & Found Department was built to help communities reconnect people with their lost items 
                in a secure and efficient way.
              </p>
              
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" size="sm" className="gap-2">
                  <Github className="h-4 w-4" />
                  <span>GitHub</span>
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <Linkedin className="h-4 w-4" />
                  <span>LinkedIn</span>
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <Twitter className="h-4 w-4" />
                  <span>Twitter</span>
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <Mail className="h-4 w-4" />
                  <span>Email</span>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">About the Project</h2>
        
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-xl font-semibold mb-3">The Vision</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Lost & Found Department was created to solve a common problem in shared spaces like schools, colleges, and offices. 
              Every day, people lose valuable items in these spaces, and others find these items but don't know who they belong to. 
              This platform aims to bridge that gap by creating a community-based system where users can post about lost items 
              or report found items, helping reconnect people with their belongings.
            </p>
          </div>
          
          <div className="bg-white dark:bg-slate-900 p-6 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-xl font-semibold mb-3">Technical Stack</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              This application is built using modern technologies to ensure a smooth and responsive user experience:
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-md text-center">
                <p className="font-medium">React</p>
                <p className="text-xs text-slate-500">Frontend Framework</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-md text-center">
                <p className="font-medium">TypeScript</p>
                <p className="text-xs text-slate-500">Language</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-md text-center">
                <p className="font-medium">Tailwind CSS</p>
                <p className="text-xs text-slate-500">Styling</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-md text-center">
                <p className="font-medium">Firebase</p>
                <p className="text-xs text-slate-500">Backend Services</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-900 p-6 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-xl font-semibold mb-3">Future Enhancements</h3>
            <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-400">
              <li>In-app messaging system for users to communicate without sharing phone numbers</li>
              <li>AI-powered image recognition to automatically categorize and match lost/found items</li>
              <li>Integration with campus security and lost & found offices</li>
              <li>Push notifications for potential matches and updates</li>
              <li>Analytics dashboard for campus administrators to track common lost items and locations</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DevelopersDesk;

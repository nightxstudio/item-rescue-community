import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Github, Linkedin, Mail, Twitter, Instagram } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useNavigate } from "react-router-dom";

const DevelopersDesk = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  
  const socialLinks = [
    {
      icon: Github,
      label: "GitHub",
      href: "https://github.com/saipritampanda",
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      href: "https://linkedin.com/in/saipritampanda",
    },
    {
      icon: Instagram,
      label: "Instagram",
      href: "https://instagram.com/saipritampanda",
    },
    {
      icon: Twitter,
      label: "Twitter",
      href: "https://twitter.com/saipritampanda",
    },
    {
      icon: Mail,
      label: "Email",
      href: "mailto:contact@saipritampanda.com",
    },
  ];

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
                  src='/Assets/Image-Assets/DeveloperDesk/DP.jpg'
                  alt="Developer" 
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            
            <div className="p-8 flex flex-col justify-center">
              <h2 className="text-2xl font-bold mb-2">Sai Pritam Panda</h2>
              <p className="text-primary font-medium mb-4">System Engineer & Android Developer</p>
              
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                I'm passionate about creating user-friendly applications that solve real-world problems. 
                The Lost & Found Department was built to help communities reconnect people with their lost items 
                in a secure and efficient way.
              </p>
              
              <div className="flex flex-wrap gap-3">
                {socialLinks.map((link) => (
                  <Button
                    key={link.label}
                    variant="outline"
                    size="sm"
                    className="gap-2 hover:bg-primary/10 hover:text-primary transition-colors"
                    onClick={() => window.open(link.href, '_blank')}
                  >
                    <link.icon className="h-4 w-4" />
                    <span>{link.label}</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="max-w-4xl mx-auto">
        <Card className="bg-gradient-to-br from-[#9b87f5]/20 to-[#7E69AB]/20 border-none shadow-xl p-6">
          <h2 className="text-2xl font-bold mb-4 text-center">Support the Project</h2>
          <div className="text-center space-y-4">
            <p className="text-lg text-slate-700 dark:text-slate-300">
              If you find this project helpful, consider supporting its development.
              Your support helps maintain and improve the platform!
            </p>
            <Button 
              size="lg"
              className="bg-gradient-to-r from-[#9b87f5] to-[#7E69AB] hover:from-[#8b77e5] hover:to-[#6E59AB] text-white gap-2 px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => navigate('/donation')}
            >
              Support this Project
            </Button>
          </div>
        </Card>
      </div>

      
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
                <p className="font-medium">Supabase</p>
                <p className="text-xs text-slate-500">Backend Services</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-900 p-6 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-xl font-semibold mb-3">Future Enhancements</h3>
            <div className="flex justify-center">
              <img 
                src={theme === 'dark' ? '/Assets/Image-Assets/DeveloperDesk/DarkModeTransparant.png' : '/Assets/Image-Assets/DeveloperDesk/LightModeTransparant.png'}
                alt="Future Enhancements" 
                className="h-40 object-contain my-4"
              />
            </div>
            <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-400">
              {/* Future enhancement items would go here */}
            </ul>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="border-none shadow-xl p-6 bg-gradient-to-br from-primary/5 to-primary/10">
              <h2 className="text-2xl font-bold mb-4 text-center">Get in Touch</h2>
              <div className="text-center space-y-4">
                <p className="text-lg text-slate-700 dark:text-slate-300">
                  Have suggestions or feedback? I'd love to hear from you!
                </p>
                <div className="flex justify-center gap-4">
                  <Button 
                    variant="outline"
                    className="gap-2"
                    onClick={() => window.open('mailto:contact@developer.com')}
                  >
                    <Mail className="h-5 w-5" />
                    Send Email
                  </Button>
                  <Button 
                    variant="outline"
                    className="gap-2"
                    onClick={() => window.open('/feedback', '_blank')}
                  >
                    <MessageSquare className="h-5 w-5" />
                    Send Feedback
                  </Button>
                </div>
              </div>
            </Card>
          </div> 
        </div>
      </div>
    </div>
  );
};

export default DevelopersDesk;

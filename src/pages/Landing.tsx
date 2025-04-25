import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Shield, Users, ExternalLink } from "lucide-react";

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 via-primary/10 to-white dark:from-primary/10 dark:via-slate-900 dark:to-slate-950 pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="container px-4 mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center md:text-left"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                Reconnect with your <span className="text-primary">lost items</span>
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 max-w-lg mx-auto md:mx-0">
                A community-based platform to help you find your lost belongings and report found items within your organization.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link to="/signup">
                  <Button size="lg" className="gap-2 w-full sm:w-auto">
                    Get Started
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Log In
                  </Button>
                </Link>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="hidden md:block relative"
            >
              <div className="relative mx-auto w-full max-w-md">
                <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary/10 rounded-lg"></div>
                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-primary/10 rounded-lg"></div>
                <img
                  src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=500&q=80"
                  alt="Lost and found items"
                  className="rounded-2xl shadow-2xl relative z-10 w-full"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 md:py-24 bg-white dark:bg-slate-950">
        <div className="container px-4 mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">How It Works</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Our platform makes it easy to report lost items and help others find their belongings
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-slate-50 dark:bg-slate-900 p-8 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Secure Community</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Connect with users from your own organization. Your posts are only visible to people from your school, college, or workplace.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-slate-50 dark:bg-slate-900 p-8 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Easy Reporting</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Quickly report lost items with details and images. The more information you provide, the higher the chances of recovery.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-slate-50 dark:bg-slate-900 p-8 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <CheckCircle2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Quick Claiming</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Found something that belongs to you? Quickly claim the item and connect with the finder through our platform.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Testimonial Section */}
      <section className="py-16 md:py-24 bg-slate-50 dark:bg-slate-900">
        <div className="container px-4 mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Success Stories</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-12">
              Join thousands of users who have successfully reconnected with their lost items
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-slate-950 p-6 rounded-xl shadow-md"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=100&q=80"
                    alt="User"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold">Mike Johnson</h4>
                  <p className="text-sm text-slate-500">Computer Science Student</p>
                </div>
              </div>
              <p className="text-slate-600 dark:text-slate-400">
                "I lost my laptop in the library and thought it was gone forever. Thanks to this platform, someone found it and contacted me within hours!"
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-slate-950 p-6 rounded-xl shadow-md"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80"
                    alt="User"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold">Sarah Williams</h4>
                  <p className="text-sm text-slate-500">Marketing Professional</p>
                </div>
              </div>
              <p className="text-slate-600 dark:text-slate-400">
                "Found a wallet in the cafeteria and used this platform to connect with the owner. It feels great to help someone recover their important documents."
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-slate-950 p-6 rounded-xl shadow-md lg:col-span-1 md:col-span-2 lg:mx-0 md:mx-auto md:max-w-md"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80"
                    alt="User"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold">David Chen</h4>
                  <p className="text-sm text-slate-500">Engineering Student</p>
                </div>
              </div>
              <p className="text-slate-600 dark:text-slate-400">
                "Lost my calculator before a big exam and was able to find it through this platform. The community here is amazing and helpful!"
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary/10">
        <div className="container px-4 mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to find what you've lost?
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
              Join our community and connect with people who might have found your belongings.
            </p>
            <Link to="/signup">
              <Button size="lg" className="gap-2">
                Create Your Account
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
      
      {/* Enhanced Footer */}
      <footer className="py-12 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
        <div className="container px-4 mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-bold mb-4">Lost & Found Department</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                Helping you reconnect with your lost belongings through our community-driven platform.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                <li><Link to="/signup" className="hover:text-primary transition-colors">Sign Up</Link></li>
                <li><Link to="/login" className="hover:text-primary transition-colors">Log In</Link></li>
                <li><Link to="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Legal</h3>
              <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                <li>
                  <a 
                    href="/privacy-policy" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="hover:text-primary transition-colors flex items-center gap-1"
                  >
                    Privacy Policy
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </li>
                <li><Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-200 dark:border-slate-800 text-center">
            <p className="text-slate-600 dark:text-slate-400">
              © {new Date().getFullYear()} Lost & Found Department. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;

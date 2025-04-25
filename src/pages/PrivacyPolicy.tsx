
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto bg-white dark:bg-slate-900 p-8 rounded-xl shadow-sm"
        >
          <Link to="/" className="inline-flex items-center gap-2 text-primary hover:underline mb-6">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          
          <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
          
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-lg mb-4">Last Updated: April 25, 2025</p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">1. Introduction</h2>
            <p>
              Welcome to Lost & Found Department. We respect your privacy and are committed 
              to protecting your personal data. This privacy policy will inform you about how 
              we look after your personal data when you visit our website and tell you about 
              your privacy rights and how the law protects you.
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">2. Data We Collect</h2>
            <p>We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:</p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>Identity Data: includes first name, last name, username or similar identifier</li>
              <li>Contact Data: includes email address and telephone numbers</li>
              <li>Technical Data: includes internet protocol (IP) address, your login data, browser type and version</li>
              <li>Profile Data: includes your username and password, your interests, preferences, feedback and survey responses</li>
              <li>Usage Data: includes information about how you use our website, products and services</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">3. How We Use Your Data</h2>
            <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
              <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
              <li>Where we need to comply with a legal obligation.</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">4. Data Security</h2>
            <p>
              We have put in place appropriate security measures to prevent your personal data from being accidentally 
              lost, used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your 
              personal data to those employees, agents, contractors and other third parties who have a business need to know.
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">5. Your Legal Rights</h2>
            <p>Under certain circumstances, you have rights under data protection laws in relation to your personal data, including:</p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>The right to access your personal data</li>
              <li>The right to request correction of your personal data</li>
              <li>The right to request erasure of your personal data</li>
              <li>The right to object to processing of your personal data</li>
              <li>The right to request restriction of processing your personal data</li>
              <li>The right to request transfer of your personal data</li>
              <li>The right to withdraw consent</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">6. Cookies</h2>
            <p>
              Our website uses cookies to distinguish you from other users of our website. This helps us to provide 
              you with a good experience when you browse our website and also allows us to improve our site. You can 
              set your browser to refuse all or some browser cookies, or to alert you when websites set or access cookies.
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">7. Contact Us</h2>
            <p>
              If you have any questions about this privacy policy or our privacy practices, please contact us at:
              <br />
              <a href="mailto:privacy@lostandfound.com" className="text-primary hover:underline">
                privacy@lostandfound.com
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

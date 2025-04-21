
import { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqItems: FAQItem[] = [
  {
    question: "What is Lost & Found Department?",
    answer: "Lost & Found Department is a community-based platform where users from a common workplace (like schools, colleges, or offices) can post about lost items or report found items within the campus. It helps connect people who have lost items with those who have found them.",
    category: "general"
  },
  {
    question: "Who can use this platform?",
    answer: "This platform is designed for students from schools and colleges, as well as working professionals. Users need to be from the same organization to see each other's posts.",
    category: "general"
  },
  {
    question: "How do I report a lost item?",
    answer: "After logging in, go to the 'Lost Items' section from the left panel navigation. Click on 'Report Lost Item', fill in the details about your lost item, upload an image, and submit the form. Your post will be visible to users from your organization.",
    category: "lost"
  },
  {
    question: "How do I report a found item?",
    answer: "Navigate to the 'Found Items' section from the left panel, click on 'Report Found Item', upload an image of the found item, provide the location where you found it, add an optional description, and create a ticket. Other users from your organization can see this and claim the item if it belongs to them.",
    category: "found"
  },
  {
    question: "Why can I only see posts from my organization?",
    answer: "To ensure authentic and verified community interactions, posts are only visible to users from the same organization. This helps maintain privacy and increases the likelihood of finding lost items.",
    category: "general"
  },
  {
    question: "Can I edit my profile information after registration?",
    answer: "Yes, you can edit your profile picture and phone number at any time from the 'Profile' section. If you need to change your occupation information, you can update the entire occupation section.",
    category: "account"
  },
  {
    question: "How do I contact someone who found my item?",
    answer: "When browsing found items, if you recognize an item as yours, you can click 'Claim This Item'. This will facilitate contact between you and the person who found it, typically via the phone number provided during registration.",
    category: "found"
  },
  {
    question: "How do I contact someone who lost an item that I found?",
    answer: "When browsing lost items, if you recognize an item you've found, you can click 'Contact Owner'. This will facilitate contact between you and the person who lost the item, typically via the phone number provided in their post.",
    category: "lost"
  },
  {
    question: "How can I delete my account?",
    answer: "You can delete your account by selecting the 'Delete Account' option from the left panel navigation. Please note that this action is irreversible and will remove all your data from our platform.",
    category: "account"
  },
  {
    question: "Is my data secure?",
    answer: "Yes, we take data security seriously. We only collect information necessary for the platform's functionality, and your data is only visible to users from your organization. We do not share your information with third parties.",
    category: "privacy"
  }
];

const FAQ = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  const categories = [
    { id: "general", name: "General Questions" },
    { id: "lost", name: "Lost Items" },
    { id: "found", name: "Found Items" },
    { id: "account", name: "Account Management" },
    { id: "privacy", name: "Privacy & Security" }
  ];
  
  const filteredFAQs = faqItems.filter(item => {
    const matchesSearch = searchQuery === "" || 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = activeCategory === null || item.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Frequently Asked Questions</h1>
      
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
        <Input
          placeholder="Search for questions or answers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setActiveCategory(null)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeCategory === null
              ? "bg-primary text-white"
              : "bg-slate-100 text-slate-800 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          }`}
        >
          All
        </button>
        
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCategory === category.id
                ? "bg-primary text-white"
                : "bg-slate-100 text-slate-800 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
      
      {filteredFAQs.length === 0 ? (
        <div className="py-12 text-center">
          <h3 className="text-xl font-medium mb-2">No FAQs match your search</h3>
          <p className="text-slate-600 dark:text-slate-400">
            Try using different keywords or clear your search
          </p>
        </div>
      ) : (
        <Accordion type="single" collapsible className="space-y-4">
          {filteredFAQs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden"
            >
              <AccordionTrigger className="px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800 text-left font-medium">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="px-6 py-4 text-slate-600 dark:text-slate-400">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
};

export default FAQ;

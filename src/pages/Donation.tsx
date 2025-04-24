
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { IndianRupee, CreditCard } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

const DONATION_AMOUNTS = [25, 50, 100, 200, 500];

const Donation = () => {
  const { theme } = useTheme();
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card'>('upi');
  const [selectedAmount, setSelectedAmount] = useState<number>(100);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setCustomAmount(value);
    setSelectedAmount(0);
  };

  const getFinalAmount = () => {
    if (customAmount) {
      return parseInt(customAmount, 10);
    }
    return selectedAmount;
  };

  const handlePayment = () => {
    const amount = getFinalAmount();
    if (!amount || amount <= 0) {
      toast.error("Please select a valid amount");
      return;
    }

    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      
      // Show success message
      toast.success("Thank you for your support!", {
        duration: 5000,
        description: `Your donation of ₹${amount} will help us improve the platform.`
      });
      
      // Reset form after successful payment
      setSelectedAmount(100);
      setCustomAmount('');
    }, 2000);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Support the Project</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          Your support helps us maintain and improve the Lost & Found Department platform.
        </p>
      </div>

      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-none shadow-xl mb-8">
        <CardHeader>
          <CardTitle className="text-center">Choose Payment Method</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full max-w-xs mx-auto">
            <Select 
              value={paymentMethod} 
              onValueChange={(value) => setPaymentMethod(value as 'upi' | 'card')}
            >
              <SelectTrigger className="w-full text-lg">
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="upi">UPI</SelectItem>
                <SelectItem value="card">Card</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-xl">
        <CardHeader>
          <CardTitle className="text-center">
            {paymentMethod === 'upi' ? 'Select UPI Amount' : 'Enter Card Details'}
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          {paymentMethod === 'upi' && (
            <div>
              <div className="flex flex-wrap justify-center gap-3 mb-6">
                {DONATION_AMOUNTS.map((amount) => (
                  <Button
                    key={amount}
                    variant={selectedAmount === amount ? "default" : "outline"}
                    onClick={() => handleAmountSelect(amount)}
                    className="min-w-[80px]"
                  >
                    <IndianRupee className="h-4 w-4 mr-1" />
                    {amount}
                  </Button>
                ))}
              </div>
              
              <div className="max-w-xs mx-auto mb-6">
                <label htmlFor="custom-amount" className="block text-sm font-medium mb-2 text-center">
                  Or enter custom amount:
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2">
                    <IndianRupee className="h-4 w-4 text-gray-500" />
                  </span>
                  <input
                    id="custom-amount"
                    type="text"
                    value={customAmount}
                    onChange={handleCustomAmountChange}
                    placeholder="Custom Amount"
                    className="w-full pl-10 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-background"
                  />
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 p-4 rounded-lg mb-6 max-w-sm mx-auto">
                <div className="text-center">
                  <p className="text-sm mb-2">Scan QR to pay via UPI apps:</p>
                  <div className="bg-white p-4 rounded-md inline-block">
                    {/* Placeholder for QR code - in real app this would be dynamic based on amount */}
                    <div className="w-40 h-40 bg-gray-200 flex items-center justify-center">
                      <span className="text-xs text-gray-500">QR Code</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {paymentMethod === 'card' && (
            <div className="max-w-md mx-auto">
              <div className="space-y-4">
                <div>
                  <label htmlFor="card-number" className="block text-sm font-medium mb-1">Card Number</label>
                  <input
                    id="card-number"
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-700 bg-background"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="expiry" className="block text-sm font-medium mb-1">Expiry Date</label>
                    <input
                      id="expiry"
                      type="text"
                      placeholder="MM/YY"
                      className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-700 bg-background"
                    />
                  </div>
                  <div>
                    <label htmlFor="cvv" className="block text-sm font-medium mb-1">CVV</label>
                    <input
                      id="cvv"
                      type="text"
                      placeholder="123"
                      className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-700 bg-background"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="card-name" className="block text-sm font-medium mb-1">Name on Card</label>
                  <input
                    id="card-name"
                    type="text"
                    placeholder="John Doe"
                    className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-700 bg-background"
                  />
                </div>
                
                <div className="bg-white dark:bg-slate-800 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Amount:</span>
                    <span className="font-bold">₹100</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-center pb-6">
          <Button 
            size="lg" 
            className="w-full max-w-xs"
            disabled={isProcessing}
            onClick={handlePayment}
          >
            {isProcessing ? (
              <div className="flex items-center">
                <div className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></div>
                Processing...
              </div>
            ) : (
              <>
                {paymentMethod === 'card' ? (
                  <>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Pay with Card
                  </>
                ) : (
                  <>
                    <IndianRupee className="mr-2 h-4 w-4" />
                    Pay with UPI
                  </>
                )}
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      <div className="mt-8 text-center">
        <img 
          src={theme === 'dark' ? '/Assets/Image-Assets/DeveloperDesk/DarkModeTransparant.png' : '/Assets/Image-Assets/DeveloperDesk/LightModeTransparant.png'}
          alt="Support" 
          className="h-20 mx-auto mb-4"
        />
        <p className="text-sm text-slate-500 dark:text-slate-400">
          All donations go directly to maintaining and improving the Lost & Found Department project.
        </p>
      </div>
    </div>
  );
};

export default Donation;

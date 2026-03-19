import { useAuth } from "@workspace/replit-auth-web";
import { useApplyForLoan } from "@workspace/api-client-react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft, Info } from "lucide-react";
import { useEffect } from "react";

const COUNTRIES = [
  "United States", "United Kingdom", "Canada", "Australia", "Germany", 
  "France", "Spain", "Italy", "Netherlands", "Sweden", 
  "Switzerland", "Norway", "United Arab Emirates", "Singapore", "Japan",
  "South Korea", "Brazil", "Mexico", "India", "South Africa", "Other"
];

const INCOME_RANGES = [
  "<$500", "$500-$1000", "$1000-$2500", "$2500-$5000", "$5000+"
];

const formSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  country: z.string().min(1, "Please select a country"),
  phoneNumber: z.string().min(8, "Please enter a valid phone number"),
  monthlyIncomeRange: z.string().min(1, "Please select an income range"),
  amount: z.number().min(500).max(50000),
  duration: z.number().min(3).max(36)
});

type FormValues = z.infer<typeof formSchema>;

export default function ApplyPage() {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const applyMutation = useApplyForLoan();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      country: "",
      phoneNumber: "",
      monthlyIncomeRange: "",
      amount: 5000,
      duration: 12
    }
  });

  const amount = form.watch("amount");
  const duration = form.watch("duration");
  const monthlyPayment = (amount * (1 + 0.02 * duration)) / duration;

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      setLocation("/login");
    }
  }, [isAuthLoading, isAuthenticated, setLocation]);

  if (isAuthLoading || !isAuthenticated) return null;

  const onSubmit = (data: FormValues) => {
    applyMutation.mutate({ data }, {
      onSuccess: () => {
        toast({
          title: "Application Submitted!",
          description: "We've received your application and will review it shortly.",
        });
        setLocation("/dashboard");
      },
      onError: (err) => {
        toast({
          variant: "destructive",
          title: "Submission failed",
          description: err.error || "An error occurred while submitting your application.",
        });
      }
    });
  };

  return (
    <div className="bg-muted/30 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link href="/dashboard" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="p-8 shadow-lg border-none rounded-2xl">
              <div className="mb-8">
                <h1 className="text-3xl font-display font-bold text-primary mb-2">Loan Application</h1>
                <p className="text-muted-foreground">Complete this short form to get your loan decision.</p>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">Personal Information</h3>
                    
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" className="rounded-xl h-12" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="country"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Country of Residence</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="rounded-xl h-12">
                                  <SelectValue placeholder="Select Country" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {COUNTRIES.map(c => (
                                  <SelectItem key={c} value={c}>{c}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input placeholder="+1 (555) 000-0000" className="rounded-xl h-12" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="monthlyIncomeRange"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Monthly Income</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="rounded-xl h-12">
                                <SelectValue placeholder="Select Income Range" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {INCOME_RANGES.map(r => (
                                <SelectItem key={r} value={r}>{r}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-6 pt-4">
                    <h3 className="text-lg font-semibold border-b pb-2">Loan Details</h3>
                    
                    <FormField
                      control={form.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem className="space-y-4">
                          <div className="flex justify-between items-end">
                            <FormLabel className="text-base">Loan Amount</FormLabel>
                            <span className="text-xl font-bold text-primary">${field.value.toLocaleString()}</span>
                          </div>
                          <FormControl>
                            <Slider 
                              value={[field.value]} 
                              onValueChange={(v) => field.onChange(v[0])} 
                              max={50000} min={500} step={100}
                              className="py-2"
                            />
                          </FormControl>
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>$500</span>
                            <span>$50,000</span>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="duration"
                      render={({ field }) => (
                        <FormItem className="space-y-4">
                          <div className="flex justify-between items-end">
                            <FormLabel className="text-base">Repayment Duration</FormLabel>
                            <span className="text-xl font-bold text-primary">{field.value} months</span>
                          </div>
                          <FormControl>
                            <Slider 
                              value={[field.value]} 
                              onValueChange={(v) => field.onChange(v[0])} 
                              max={36} min={3} step={3}
                              className="py-2"
                            />
                          </FormControl>
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>3 months</span>
                            <span>36 months</span>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl h-14 text-lg shadow-xl shadow-primary/20"
                    disabled={applyMutation.isPending}
                  >
                    {applyMutation.isPending ? (
                      <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...</>
                    ) : (
                      "Submit Application"
                    )}
                  </Button>
                  
                  <p className="text-xs text-center text-muted-foreground mt-4 flex items-center justify-center gap-1">
                    <Info className="w-3 h-3" /> By submitting, you agree to our Terms of Service.
                  </p>
                </form>
              </Form>
            </Card>
          </div>

          {/* Sticky Summary Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-28">
              <Card className="p-6 bg-gradient-to-br from-primary to-primary/90 text-primary-foreground border-none rounded-2xl shadow-xl shadow-primary/20">
                <h3 className="font-bold text-xl mb-6 text-white">Summary</h3>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-primary-foreground/80">
                    <span>Principal Amount</span>
                    <span className="font-medium text-white">${amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-primary-foreground/80">
                    <span>Duration</span>
                    <span className="font-medium text-white">{duration} months</span>
                  </div>
                  <div className="flex justify-between text-primary-foreground/80">
                    <span>Interest Rate</span>
                    <span className="font-medium text-white">2.0% Monthly</span>
                  </div>
                </div>
                
                <div className="border-t border-white/20 pt-6">
                  <p className="text-sm font-medium text-primary-foreground/80 mb-2">Estimated Monthly Payment</p>
                  <p className="text-4xl font-extrabold text-accent">${monthlyPayment.toFixed(2)}</p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

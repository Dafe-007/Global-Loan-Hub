import { useState, useEffect } from "react";
import { useAuth } from "@workspace/replit-auth-web";
import { useApplyForLoan } from "@workspace/api-client-react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft } from "lucide-react";

const COUNTRIES = [
  "United States","United Kingdom","Canada","Australia","Germany","France","Spain","Italy",
  "Netherlands","Sweden","Switzerland","Norway","United Arab Emirates","Singapore","Japan",
  "South Korea","Brazil","Mexico","India","South Africa","Nigeria","Kenya","Ghana","Pakistan",
  "Bangladesh","Philippines","Indonesia","Vietnam","Thailand","Malaysia","Other"
];

const INCOME_RANGES = ["<$500","$500-$1000","$1000-$2500","$2500-$5000","$5000+"];
const DURATIONS = [3,6,12,18,24,36];

export default function ApplyPage() {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const applyMutation = useApplyForLoan();

  const [fullName, setFullName] = useState("");
  const [country, setCountry] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [monthlyIncomeRange, setMonthlyIncomeRange] = useState("");
  const [amount, setAmount] = useState("5000");
  const [duration, setDuration] = useState("12");
  const [errors, setErrors] = useState<Record<string,string>>({});

  const numAmount = Math.max(500, Math.min(50000, Number(amount) || 0));
  const numDuration = Number(duration) || 12;
  const monthlyPayment = numAmount > 0 && numDuration > 0
    ? ((numAmount * (1 + 0.02 * numDuration)) / numDuration).toFixed(2)
    : "0.00";

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) setLocation("/login");
  }, [isAuthLoading, isAuthenticated, setLocation]);

  if (isAuthLoading || !isAuthenticated) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;
  }

  function validate() {
    const e: Record<string,string> = {};
    if (!fullName.trim() || fullName.trim().length < 2) e.fullName = "Enter your full name";
    if (!country) e.country = "Select a country";
    if (!phoneNumber.trim() || phoneNumber.trim().length < 6) e.phoneNumber = "Enter a valid phone number";
    if (!monthlyIncomeRange) e.monthlyIncomeRange = "Select your income range";
    if (!amount || numAmount < 500 || numAmount > 50000) e.amount = "Amount must be between $500 and $50,000";
    if (!duration) e.duration = "Select a repayment duration";
    return e;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    applyMutation.mutate(
      { data: { fullName, country, phoneNumber, monthlyIncomeRange, amount: numAmount, duration: numDuration } },
      {
        onSuccess: () => {
          toast({ title: "Application Submitted!", description: "We'll review it shortly." });
          setLocation("/dashboard");
        },
        onError: () => {
          toast({ variant: "destructive", title: "Submission failed", description: "Something went wrong. Please try again." });
        }
      }
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-xl">
        <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        <Card className="p-6 shadow-sm border border-border">
          <h1 className="text-2xl font-bold text-primary mb-1">Loan Application</h1>
          <p className="text-sm text-muted-foreground mb-6">Complete this short form to get your loan decision.</p>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div className="space-y-1.5">
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" placeholder="John Doe" value={fullName} onChange={e => setFullName(e.target.value)} />
              {errors.fullName && <p className="text-xs text-destructive">{errors.fullName}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Country of Residence</Label>
                <Select value={country} onValueChange={setCountry}>
                  <SelectTrigger><SelectValue placeholder="Select Country" /></SelectTrigger>
                  <SelectContent>
                    {COUNTRIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
                {errors.country && <p className="text-xs text-destructive">{errors.country}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" placeholder="+1 555 0000" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} />
                {errors.phoneNumber && <p className="text-xs text-destructive">{errors.phoneNumber}</p>}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Monthly Income</Label>
              <Select value={monthlyIncomeRange} onValueChange={setMonthlyIncomeRange}>
                <SelectTrigger><SelectValue placeholder="Select Income Range" /></SelectTrigger>
                <SelectContent>
                  {INCOME_RANGES.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                </SelectContent>
              </Select>
              {errors.monthlyIncomeRange && <p className="text-xs text-destructive">{errors.monthlyIncomeRange}</p>}
            </div>

            <div className="border-t border-border pt-5 space-y-4">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Loan Details</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="amount">Loan Amount ($)</Label>
                  <Input
                    id="amount"
                    type="number"
                    min={500}
                    max={50000}
                    step={100}
                    placeholder="5000"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    inputMode="numeric"
                  />
                  <p className="text-xs text-muted-foreground">$500 – $50,000</p>
                  {errors.amount && <p className="text-xs text-destructive">{errors.amount}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label>Repayment Duration</Label>
                  <Select value={duration} onValueChange={setDuration}>
                    <SelectTrigger><SelectValue placeholder="Select Duration" /></SelectTrigger>
                    <SelectContent>
                      {DURATIONS.map(d => <SelectItem key={d} value={String(d)}>{d} months</SelectItem>)}
                    </SelectContent>
                  </Select>
                  {errors.duration && <p className="text-xs text-destructive">{errors.duration}</p>}
                </div>
              </div>

              <div className="bg-primary/5 rounded-xl p-4 border border-primary/10 flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Est. Monthly Payment</p>
                  <p className="text-2xl font-extrabold text-accent">${monthlyPayment}</p>
                </div>
                <div className="text-right text-xs text-muted-foreground">
                  <p>Amount: ${numAmount.toLocaleString()}</p>
                  <p>Duration: {numDuration} months</p>
                  <p>Rate: 2% / month</p>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full bg-primary text-white hover:bg-primary/90 h-12 text-base font-semibold"
              disabled={applyMutation.isPending}
            >
              {applyMutation.isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Processing...</> : "Submit Application"}
            </Button>
            <p className="text-xs text-center text-muted-foreground">By submitting, you agree to our Terms of Service.</p>
          </form>
        </Card>
      </div>
    </div>
  );
}

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
  "Netherlands","Sweden","Switzerland","Norway","United Arab Emirates","Saudi Arabia",
  "Singapore","Japan","South Korea","Brazil","Mexico","India","Pakistan","Bangladesh",
  "South Africa","Nigeria","Kenya","Ghana","Philippines","Indonesia","Vietnam","Thailand",
  "Malaysia","Egypt","Morocco","Ethiopia","Tanzania","Uganda","Zimbabwe","Other"
];

const INCOME_RANGES = ["<$500","$500-$1000","$1000-$2500","$2500-$5000","$5000+"];
const DURATIONS = [3, 6, 12, 18, 24, 36];

type Errors = Record<string, string>;

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="text-xs text-destructive mt-0.5">{msg}</p>;
}

export default function ApplyPage() {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const applyMutation = useApplyForLoan();

  // Personal info
  const [fullName, setFullName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [country, setCountry] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [occupation, setOccupation] = useState("");
  const [employerName, setEmployerName] = useState("");
  const [monthlyIncomeRange, setMonthlyIncomeRange] = useState("");

  // Bank info
  const [bankName, setBankName] = useState("");
  const [bankAccountNumber, setBankAccountNumber] = useState("");

  // Loan details
  const [amount, setAmount] = useState("5000");
  const [duration, setDuration] = useState("12");

  const [errors, setErrors] = useState<Errors>({});

  // Safe parsed numbers for preview
  const numAmount = (() => {
    const n = parseFloat(amount);
    return isNaN(n) ? 0 : Math.min(50000, Math.max(500, n));
  })();
  const numDuration = parseInt(duration) || 12;
  const monthlyPayment =
    numAmount > 0 && numDuration > 0
      ? ((numAmount * (1 + 0.02 * numDuration)) / numDuration).toFixed(2)
      : "0.00";

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) setLocation("/login");
  }, [isAuthLoading, isAuthenticated, setLocation]);

  if (isAuthLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  function validate(): Errors {
    const e: Errors = {};
    if (!fullName.trim() || fullName.trim().length < 2) e.fullName = "Enter your full name (at least 2 characters)";
    if (!dateOfBirth) e.dateOfBirth = "Enter your date of birth";
    if (!country) e.country = "Select your country";
    if (!phoneNumber.trim() || phoneNumber.trim().length < 6) e.phoneNumber = "Enter a valid phone number";
    if (!occupation.trim()) e.occupation = "Enter your occupation";
    if (!monthlyIncomeRange) e.monthlyIncomeRange = "Select your income range";
    if (!bankName.trim()) e.bankName = "Enter your bank name";
    if (!bankAccountNumber.trim()) e.bankAccountNumber = "Enter your bank account number";
    if (!amount || numAmount < 500 || numAmount > 50000) e.amount = "Amount must be between $500 and $50,000";
    if (!duration) e.duration = "Select a repayment duration";
    return e;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      // Scroll to first error
      const firstEl = document.querySelector("[data-error]");
      firstEl?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setErrors({});
    applyMutation.mutate(
      {
        data: {
          fullName: fullName.trim(),
          dateOfBirth,
          country,
          phoneNumber: phoneNumber.trim(),
          occupation: occupation.trim(),
          employerName: employerName.trim() || undefined,
          monthlyIncomeRange,
          bankName: bankName.trim(),
          bankAccountNumber: bankAccountNumber.trim(),
          amount: numAmount,
          duration: numDuration,
        },
      },
      {
        onSuccess: () => {
          toast({ title: "Application Submitted!", description: "We'll review your application shortly." });
          setLocation("/dashboard");
        },
        onError: () => {
          toast({
            variant: "destructive",
            title: "Submission failed",
            description: "Something went wrong. Please try again.",
          });
        },
      }
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-xl">
        <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        <div className="mb-5">
          <h1 className="text-2xl font-bold text-primary">Loan Application</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Fill in all required fields. Your information is encrypted and secure.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">

          {/* ── Section 1: Personal Information ── */}
          <Card className="p-5 border border-border space-y-4">
            <h2 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Personal Information</h2>

            <div data-error={errors.fullName ? "1" : undefined}>
              <Label htmlFor="fullName">Full Name <span className="text-destructive">*</span></Label>
              <Input
                id="fullName"
                placeholder="e.g. John Appleseed"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="mt-1"
              />
              <FieldError msg={errors.fullName} />
            </div>

            <div data-error={errors.dateOfBirth ? "1" : undefined}>
              <Label htmlFor="dob">Date of Birth <span className="text-destructive">*</span></Label>
              <Input
                id="dob"
                type="date"
                value={dateOfBirth}
                onChange={e => setDateOfBirth(e.target.value)}
                max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split("T")[0]}
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-0.5">You must be at least 18 years old.</p>
              <FieldError msg={errors.dateOfBirth} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div data-error={errors.country ? "1" : undefined}>
                <Label>Country of Residence <span className="text-destructive">*</span></Label>
                <Select value={country} onValueChange={setCountry}>
                  <SelectTrigger className="mt-1"><SelectValue placeholder="Select country" /></SelectTrigger>
                  <SelectContent>
                    {COUNTRIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
                <FieldError msg={errors.country} />
              </div>

              <div data-error={errors.phoneNumber ? "1" : undefined}>
                <Label htmlFor="phone">Phone Number <span className="text-destructive">*</span></Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="e.g. +1 555 012 3456"
                  value={phoneNumber}
                  onChange={e => setPhoneNumber(e.target.value)}
                  className="mt-1"
                />
                <FieldError msg={errors.phoneNumber} />
              </div>
            </div>
          </Card>

          {/* ── Section 2: Employment ── */}
          <Card className="p-5 border border-border space-y-4">
            <h2 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Employment & Income</h2>

            <div data-error={errors.occupation ? "1" : undefined}>
              <Label htmlFor="occupation">Occupation <span className="text-destructive">*</span></Label>
              <Input
                id="occupation"
                placeholder="e.g. Software Engineer, Nurse, Self-employed"
                value={occupation}
                onChange={e => setOccupation(e.target.value)}
                className="mt-1"
              />
              <FieldError msg={errors.occupation} />
            </div>

            <div>
              <Label htmlFor="employer">Employer / Business Name <span className="text-muted-foreground font-normal">(optional)</span></Label>
              <Input
                id="employer"
                placeholder="e.g. Acme Corp, Self-employed"
                value={employerName}
                onChange={e => setEmployerName(e.target.value)}
                className="mt-1"
              />
            </div>

            <div data-error={errors.monthlyIncomeRange ? "1" : undefined}>
              <Label>Monthly Income <span className="text-destructive">*</span></Label>
              <Select value={monthlyIncomeRange} onValueChange={setMonthlyIncomeRange}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Select income range" /></SelectTrigger>
                <SelectContent>
                  {INCOME_RANGES.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                </SelectContent>
              </Select>
              <FieldError msg={errors.monthlyIncomeRange} />
            </div>
          </Card>

          {/* ── Section 3: Banking ── */}
          <Card className="p-5 border border-border space-y-4">
            <h2 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Banking Details</h2>
            <p className="text-xs text-muted-foreground -mt-2">
              Disbursements will be sent to this account. Your details are encrypted.
            </p>

            <div data-error={errors.bankName ? "1" : undefined}>
              <Label htmlFor="bankName">Bank Name <span className="text-destructive">*</span></Label>
              <Input
                id="bankName"
                placeholder="e.g. Chase, Barclays, GTBank"
                value={bankName}
                onChange={e => setBankName(e.target.value)}
                className="mt-1"
              />
              <FieldError msg={errors.bankName} />
            </div>

            <div data-error={errors.bankAccountNumber ? "1" : undefined}>
              <Label htmlFor="bankAccount">Bank Account Number <span className="text-destructive">*</span></Label>
              <Input
                id="bankAccount"
                placeholder="Enter your account number"
                value={bankAccountNumber}
                onChange={e => setBankAccountNumber(e.target.value)}
                inputMode="numeric"
                className="mt-1"
              />
              <FieldError msg={errors.bankAccountNumber} />
            </div>
          </Card>

          {/* ── Section 4: Loan Details ── */}
          <Card className="p-5 border border-border space-y-4">
            <h2 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Loan Details</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div data-error={errors.amount ? "1" : undefined}>
                <Label htmlFor="amount">Loan Amount (USD) <span className="text-destructive">*</span></Label>
                <Input
                  id="amount"
                  type="number"
                  min={500}
                  max={50000}
                  step={100}
                  placeholder="e.g. 5000"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  inputMode="numeric"
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-0.5">Min $500 · Max $50,000</p>
                <FieldError msg={errors.amount} />
              </div>

              <div data-error={errors.duration ? "1" : undefined}>
                <Label>Repayment Duration <span className="text-destructive">*</span></Label>
                <Select value={duration} onValueChange={setDuration}>
                  <SelectTrigger className="mt-1"><SelectValue placeholder="Select duration" /></SelectTrigger>
                  <SelectContent>
                    {DURATIONS.map(d => (
                      <SelectItem key={d} value={String(d)}>{d} months</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError msg={errors.duration} />
              </div>
            </div>

            {/* Live repayment preview */}
            <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Estimated monthly payment</p>
                <p className="text-2xl font-extrabold text-accent">
                  ${isNaN(parseFloat(monthlyPayment)) ? "0.00" : monthlyPayment}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">2% flat monthly interest · no hidden fees</p>
              </div>
              <div className="text-right text-xs text-muted-foreground space-y-0.5">
                <p>Principal: <span className="font-medium text-foreground">${numAmount.toLocaleString()}</span></p>
                <p>Duration: <span className="font-medium text-foreground">{numDuration} months</span></p>
                <p>Total repay: <span className="font-medium text-foreground">${(numAmount * (1 + 0.02 * numDuration)).toFixed(2)}</span></p>
              </div>
            </div>
          </Card>

          <Button
            type="submit"
            size="lg"
            className="w-full bg-primary text-white hover:bg-primary/90 h-12 text-base font-semibold"
            disabled={applyMutation.isPending}
          >
            {applyMutation.isPending
              ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</>
              : "Submit Application"}
          </Button>

          <p className="text-xs text-center text-muted-foreground pb-4">
            By submitting, you agree to our Terms of Service and Privacy Policy.
            Your data is encrypted and never shared without your consent.
          </p>
        </form>
      </div>
    </div>
  );
}

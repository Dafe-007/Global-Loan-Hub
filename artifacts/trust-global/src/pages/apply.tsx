import { useState, useEffect } from "react";
import { useAuth } from "@workspace/replit-auth-web";
import { useApplyForLoan } from "@workspace/api-client-react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft } from "lucide-react";

// All ~249 world countries via built-in Intl API — zero dependencies needed
const COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda",
  "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain",
  "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan",
  "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria",
  "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon", "Canada",
  "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros",
  "Congo (Brazzaville)", "Congo (Kinshasa)", "Costa Rica", "Croatia", "Cuba",
  "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic",
  "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia",
  "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia",
  "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau",
  "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran",
  "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan",
  "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho",
  "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar",
  "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania",
  "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro",
  "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands",
  "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia",
  "Norway", "Oman", "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea",
  "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania",
  "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia",
  "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe",
  "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore",
  "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea",
  "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland",
  "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo",
  "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu",
  "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States",
  "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam",
  "Yemen", "Zambia", "Zimbabwe",
];

const INCOME_RANGES = [
  "<$500",
  "$500-$1000",
  "$1000-$2500",
  "$2500-$5000",
  "$5000+",
];

const DURATIONS = [3, 6, 12, 18, 24, 36];

const LOAN_PURPOSES = [
  "Business",
  "Education",
  "Medical",
  "Home Improvement",
  "Travel",
  "Debt Consolidation",
  "Other",
];

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
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dob, setDob] = useState("");
  const [occupation, setOccupation] = useState("");
  const [employer, setEmployer] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [gender, setGender] = useState("");
  const [loanPurpose, setLoanPurpose] = useState("");

  const numAmount = Math.max(500, Math.min(50000, Number(amount) || 0));
  const numDuration = Number(duration) || 12;
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

  function validate() {
    const e: Record<string, string> = {};
    if (!fullName.trim() || fullName.trim().length < 2)
      e.fullName = "Enter your full name";
    if (!gender) e.gender = "Select your gender";
    if (!country) e.country = "Select a country";
    if (!phoneNumber.trim() || phoneNumber.trim().length < 6)
      e.phoneNumber = "Enter a valid phone number";
    if (!monthlyIncomeRange) e.monthlyIncomeRange = "Select your income range";
    if (!occupation.trim()) e.occupation = "Enter your occupation";
    if (!loanPurpose) e.loanPurpose = "Select a loan purpose";
    if (!amount || numAmount < 500 || numAmount > 50000)
      e.amount = "Amount must be between $500 and $50,000";
    if (!duration) e.duration = "Select a repayment duration";
    if (!dob) {
      e.dob = "Enter your date of birth";
    } else {
      const birthDate = new Date(dob);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 18) e.dob = "You must be at least 18 years old";
    }
    return e;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});
    applyMutation.mutate(
      {
        data: {
          fullName,
          country,
          phoneNumber,
          monthlyIncomeRange,
          amount: numAmount,
          duration: numDuration,
          gender,
          loanPurpose,
          occupation,
          employer,
          bankName,
          accountNumber,
          dob,
        },
      },
      {
        onSuccess: () => {
          toast({
            title: "Application Submitted!",
            description: "We'll review it shortly.",
          });
          setLocation("/dashboard");
        },
        onError: () => {
          toast({
            variant: "destructive",
            title: "Submission failed",
            description: "Something went wrong. Please try again.",
          });
        },
      },
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-xl">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        <Card className="p-6 shadow-sm border border-border">
          <h1 className="text-2xl font-bold text-primary mb-1">
            Loan Application
          </h1>
          <p className="text-sm text-muted-foreground mb-6">
            Complete this short form to get your loan decision.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>

            {/* ── Personal Information ── */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                Personal Information
              </h3>

              {/* Full Name — full width, intentional */}
              <div className="space-y-1.5">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
                {errors.fullName && (
                  <p className="text-xs text-destructive">{errors.fullName}</p>
                )}
              </div>

              {/* DOB + Gender */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="dob">Date of Birth</Label>
                  <Input
                    id="dob"
                    type="date"
                    value={dob}
                    min="1900-01-01"
                    max={new Date(new Date().setFullYear(new Date().getFullYear() - 18))
                      .toISOString()
                      .split("T")[0]}
                    onChange={(e) => setDob(e.target.value)}
                  />
                  {errors.dob && (
                    <p className="text-xs text-destructive">{errors.dob}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label>Gender</Label>
                  <Select value={gender} onValueChange={setGender}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                      <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.gender && (
                    <p className="text-xs text-destructive">{errors.gender}</p>
                  )}
                </div>
              </div>

              {/* Phone + Country */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 555 0000"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                  {errors.phoneNumber && (
                    <p className="text-xs text-destructive">{errors.phoneNumber}</p>
                  )}
                </div>
                
                <div className="space-y-1.5">
                  <Label>Country of Residence</Label>
                  <Select value={country} onValueChange={setCountry}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Country" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60 overflow-y-auto">
                      {COUNTRIES.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                     
                  </Select>
                  {errors.country && (
                    <p className="text-xs text-destructive">{errors.country}</p>
                  )}
                </div>
              </div>
            </div>

            {/* ── Employment & Finances ── */}
            <div className="border-t border-border pt-5 space-y-4">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                Employment & Finances
              </h3>

              {/* Occupation + Monthly Income */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="occupation">Occupation</Label>
                  <Input
                    id="occupation"
                    placeholder="e.g. Developer, Trader"
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value)}
                  />
                  {errors.occupation && (
                    <p className="text-xs text-destructive">{errors.occupation}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label>Monthly Income</Label>
                  <Select value={monthlyIncomeRange} onValueChange={setMonthlyIncomeRange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Income Range" />
                    </SelectTrigger>
                    <SelectContent>
                      {INCOME_RANGES.map((r) => (
                        <SelectItem key={r} value={r}>{r}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.monthlyIncomeRange && (
                    <p className="text-xs text-destructive">{errors.monthlyIncomeRange}</p>
                  )}
                </div>
              </div>

              {/* Employer — full width, no natural pair */}
              <div className="space-y-1.5">
                <Label htmlFor="employer">Employer / Business Name</Label>
                <Input
                  id="employer"
                  placeholder="Company or Business Name"
                  value={employer}
                  onChange={(e) => setEmployer(e.target.value)}
                />
              </div>

              {/* Bank Name + Account Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="bankName">Bank Name</Label>
                  <Input
                    id="bankName"
                    placeholder="Your Bank Name"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                  />
                  {errors.bankName && (
                    <p className="text-xs text-destructive">{errors.bankName}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="accountNumber">Account Number</Label>
                  <Input
                    id="accountNumber"
                    placeholder="Your Account Number"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                  />
                  {errors.accountNumber && (
                    <p className="text-xs text-destructive">{errors.accountNumber}</p>
                  )}
                </div>
              </div>
            </div>

            {/* ── Loan Details ── */}
            <div className="border-t border-border pt-5 space-y-4">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                Loan Details
              </h3>

              {/* Loan Purpose — full width */}
              <div className="space-y-1.5">
                <Label>Loan Purpose</Label>
                <Select value={loanPurpose} onValueChange={setLoanPurpose}>
                  <SelectTrigger>
                    <SelectValue placeholder="What is this loan for?" />
                  </SelectTrigger>
                  <SelectContent>
                    {LOAN_PURPOSES.map((p) => (
                      <SelectItem key={p} value={p}>{p}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.loanPurpose && (
                  <p className="text-xs text-destructive">{errors.loanPurpose}</p>
                )}
              </div>

              {/* Loan Amount + Repayment Duration */}
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
                    onChange={(e) => setAmount(e.target.value)}
                    inputMode="numeric"
                  />
                  <p className="text-xs text-muted-foreground">$500 – $50,000</p>
                  {errors.amount && (
                    <p className="text-xs text-destructive">{errors.amount}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label>Repayment Duration</Label>
                  <Select value={duration} onValueChange={setDuration}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Duration" />
                    </SelectTrigger>
                    <SelectContent>
                      {DURATIONS.map((d) => (
                        <SelectItem key={d} value={String(d)}>
                          {d} months
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.duration && (
                    <p className="text-xs text-destructive">{errors.duration}</p>
                  )}
                </div>
              </div>

              {/* Monthly payment summary */}
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
              {applyMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Submit Application"
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              By submitting, you agree to our Terms of Service.
            </p>
          </form>
        </Card>
      </div>
    </div>
  );
}

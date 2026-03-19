import { useState } from "react";
import { Link } from "wouter";
import { useAuth } from "@workspace/replit-auth-web";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Shield, Globe, Clock, Star, ArrowRight, Lock, CheckCircle } from "lucide-react";

export default function LandingPage() {
  const { isAuthenticated, login } = useAuth();
  const [amount, setAmount] = useState(5000);
  const [duration, setDuration] = useState(12);
  const monthlyPayment = (amount * (1 + 0.02 * duration)) / duration;

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-primary py-16 px-4">
        <div className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="text-white space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-sm">
              <Shield className="w-4 h-4 text-accent" />
              Licensed & Secure Global Lender
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
              Get a loan in minutes —{" "}
              <span className="text-accent">wherever you are.</span>
            </h1>
            <p className="text-lg text-white/75 max-w-md">
              Instant cross-border loans with transparent terms and no hidden fees. Get funded within 24 hours.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              {isAuthenticated ? (
                <Link href="/apply">
                  <Button size="lg" className="bg-accent hover:bg-accent/90 text-white font-bold">
                    Apply Now <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              ) : (
                <Button size="lg" onClick={() => login()} className="bg-accent hover:bg-accent/90 text-white font-bold">
                  Apply Now <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              )}
              <span className="flex items-center gap-1.5 text-white/60 text-sm">
                <Lock className="w-3.5 h-3.5" /> 256-bit Encryption
              </span>
            </div>
          </div>

          {/* Calculator */}
          <Card className="p-6 rounded-2xl shadow-xl border-0">
            <h3 className="text-xl font-bold mb-5 text-primary">Calculate your loan</h3>
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <label className="text-sm font-medium text-muted-foreground">I want to borrow</label>
                  <span className="text-xl font-bold text-primary">${amount.toLocaleString()}</span>
                </div>
                <Slider value={[amount]} onValueChange={(v) => setAmount(v[0])} max={50000} min={500} step={100} />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>$500</span><span>$50,000</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <label className="text-sm font-medium text-muted-foreground">Over a period of</label>
                  <span className="text-xl font-bold text-primary">{duration} months</span>
                </div>
                <Slider value={[duration]} onValueChange={(v) => setDuration(v[0])} max={36} min={3} step={3} />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>3 months</span><span>36 months</span>
                </div>
              </div>
              <div className="bg-primary/5 rounded-xl p-4 text-center border border-primary/10">
                <p className="text-sm text-muted-foreground mb-1">Estimated Monthly Payment</p>
                <p className="text-3xl font-extrabold text-accent">${monthlyPayment.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground mt-1">2% monthly simple interest. No hidden fees.</p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Trust Stats */}
      <section className="py-8 px-4 bg-white border-b border-border">
        <div className="mx-auto max-w-6xl grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <p className="text-3xl font-extrabold text-primary">50k+</p>
            <p className="text-sm text-muted-foreground mt-1">Customers Worldwide</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-primary">95%</p>
            <p className="text-sm text-muted-foreground mt-1">Approval Rate</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-primary">$120M+</p>
            <p className="text-sm text-muted-foreground mt-1">Funds Disbursed</p>
          </div>
          <div>
            <div className="flex justify-center gap-0.5 text-accent mb-1">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
            </div>
            <p className="text-2xl font-extrabold text-primary">4.8/5</p>
            <p className="text-sm text-muted-foreground">Average Rating</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-14 px-4 bg-gray-50">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">Why choose Trust Global?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Clock,  title: "Under 5 Minute Application", desc: "No lengthy paperwork. Just a few questions and get an instant decision." },
              { icon: Globe,  title: "Anywhere in the World",       desc: "We support disbursements to over 50 countries. No cross-border limits." },
              { icon: Shield, title: "Bank-Grade Security",         desc: "Military-grade encryption. GDPR compliant and fully licensed lender." },
            ].map(({ icon: Icon, title, desc }) => (
              <Card key={title} className="p-6 border border-border">
                <div className="w-11 h-11 bg-primary/8 rounded-xl flex items-center justify-center text-primary mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-14 px-4 bg-primary">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 text-white">Trusted by people globally</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "Sarah M.",  country: "Canada", quote: "I needed funds for a medical emergency. Trust Global approved me instantly.",             rating: 5 },
              { name: "Ahmed K.", country: "UAE",    quote: "Most transparent loan process I've experienced. Payments matched the calculator.",       rating: 5 },
              { name: "Elena R.", country: "Spain",  quote: "As an expat, getting a loan is usually a nightmare. Trust Global made it painless.",     rating: 4 },
            ].map((t) => (
              <Card key={t.name} className="bg-white/10 border-white/20 p-5">
                <div className="flex gap-0.5 mb-3">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className={`w-4 h-4 ${j < t.rating ? "fill-accent text-accent" : "text-white/30"}`} />
                  ))}
                </div>
                <p className="text-white/85 text-sm italic mb-4">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-accent rounded-full flex items-center justify-center font-bold text-white text-sm">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">{t.name}</p>
                    <p className="text-xs text-white/50">{t.country}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 px-4 bg-white text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-2xl font-bold mb-3">Ready to get started?</h2>
          <p className="text-muted-foreground mb-8">Join thousands of users who found financial freedom with Trust Global.</p>
          {isAuthenticated ? (
            <Link href="/apply">
              <Button size="lg" className="bg-primary text-white hover:bg-primary/90 px-10">Apply for a Loan</Button>
            </Link>
          ) : (
            <Button size="lg" onClick={() => login()} className="bg-primary text-white hover:bg-primary/90 px-10">Create an Account</Button>
          )}
          <div className="flex flex-wrap justify-center gap-6 mt-10 pt-8 border-t border-border/50">
            {["SSL Secured", "Licensed Lender", "GDPR Compliant"].map((t) => (
              <div key={t} className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <CheckCircle className="w-4 h-4 text-accent" /> {t}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

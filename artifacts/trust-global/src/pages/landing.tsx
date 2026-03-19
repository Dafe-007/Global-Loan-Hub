import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { useAuth } from "@workspace/replit-auth-web";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Shield, Globe, Clock, Star, ArrowRight, Lock, CheckCircle } from "lucide-react";

export default function LandingPage() {
  const { isAuthenticated, login } = useAuth();
  
  // Calculator State
  const [amount, setAmount] = useState<number>(5000);
  const [duration, setDuration] = useState<number>(12);

  // monthlyPayment = (amount * (1 + 0.02 * duration)) / duration
  const totalRepayment = amount * (1 + 0.02 * duration);
  const monthlyPayment = totalRepayment / duration;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden bg-primary">
        <div className="absolute inset-0 w-full h-full">
          <img 
            src={`${import.meta.env.BASE_URL}images/hero-bg.png`} 
            alt="Hero background" 
            className="w-full h-full object-cover opacity-40 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/50 to-primary"></div>
        </div>

        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-white space-y-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm">
                <Shield className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium">Licensed & Secure Global Lender</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-display font-extrabold leading-tight text-white">
                Get a loan in minutes — <span className="text-accent">wherever you are.</span>
              </h1>
              <p className="text-lg md:text-xl text-primary-foreground/80 max-w-xl leading-relaxed">
                Trust Global Finance provides instant cross-border loans with transparent terms and no hidden fees. Apply today and get funded within 24 hours.
              </p>
              
              <div className="flex flex-wrap items-center gap-4">
                {isAuthenticated ? (
                  <Link href="/apply">
                    <Button size="lg" className="bg-accent hover:bg-accent/90 text-white font-bold text-lg px-8 py-6 rounded-xl shadow-lg shadow-accent/25 hover:-translate-y-0.5 transition-all">
                      Apply Now <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                ) : (
                  <Button size="lg" onClick={() => login()} className="bg-accent hover:bg-accent/90 text-white font-bold text-lg px-8 py-6 rounded-xl shadow-lg shadow-accent/25 hover:-translate-y-0.5 transition-all">
                    Apply Now <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                )}
                
                <div className="flex items-center gap-2 text-primary-foreground/80 text-sm">
                  <Lock className="w-4 h-4" /> 256-bit Encryption
                </div>
              </div>
            </motion.div>

            {/* Calculator Card */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="glass-panel p-8 rounded-3xl border-0 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent to-primary"></div>
                <h3 className="text-2xl font-bold mb-6 text-primary">Calculate your loan</h3>
                
                <div className="space-y-8">
                  {/* Amount Slider */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <label className="text-sm font-semibold text-muted-foreground">I want to borrow</label>
                      <span className="text-2xl font-bold text-primary">${amount.toLocaleString()}</span>
                    </div>
                    <Slider 
                      value={[amount]} 
                      onValueChange={(v) => setAmount(v[0])} 
                      max={50000} 
                      min={500} 
                      step={100}
                      className="py-4"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>$500</span>
                      <span>$50,000</span>
                    </div>
                  </div>

                  {/* Duration Slider */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <label className="text-sm font-semibold text-muted-foreground">Over a period of</label>
                      <span className="text-2xl font-bold text-primary">{duration} months</span>
                    </div>
                    <Slider 
                      value={[duration]} 
                      onValueChange={(v) => setDuration(v[0])} 
                      max={36} 
                      min={3} 
                      step={3}
                      className="py-4"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>3 months</span>
                      <span>36 months</span>
                    </div>
                  </div>

                  <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10 flex flex-col items-center justify-center mt-6">
                    <p className="text-sm font-medium text-muted-foreground mb-1">Estimated Monthly Payment</p>
                    <p className="text-4xl font-extrabold text-accent">${monthlyPayment.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground mt-2 text-center">Includes 2% monthly simple interest. No hidden fees.</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Stats */}
      <section className="py-12 bg-white border-b border-border shadow-sm relative z-20 -mt-8 mx-4 md:mx-auto max-w-6xl rounded-2xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 px-8">
          <div className="text-center space-y-2">
            <h4 className="text-4xl font-extrabold text-primary">50k+</h4>
            <p className="text-sm font-medium text-muted-foreground">Customers Worldwide</p>
          </div>
          <div className="text-center space-y-2">
            <h4 className="text-4xl font-extrabold text-primary">95%</h4>
            <p className="text-sm font-medium text-muted-foreground">Approval Rate</p>
          </div>
          <div className="text-center space-y-2">
            <h4 className="text-4xl font-extrabold text-primary">$120M+</h4>
            <p className="text-sm font-medium text-muted-foreground">Funds Disbursed</p>
          </div>
          <div className="text-center space-y-2">
            <div className="flex justify-center items-center gap-1 text-accent mb-1">
              <Star className="w-6 h-6 fill-current" />
              <Star className="w-6 h-6 fill-current" />
              <Star className="w-6 h-6 fill-current" />
              <Star className="w-6 h-6 fill-current" />
              <Star className="w-6 h-6 fill-current" />
            </div>
            <h4 className="text-2xl font-extrabold text-primary">4.8/5</h4>
            <p className="text-sm font-medium text-muted-foreground">Average Rating</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why choose Trust Global?</h2>
            <p className="text-muted-foreground text-lg">We've simplified the lending process so you can focus on what matters most.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-8 border-none shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 text-primary">
                <Clock className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">Under 5 Minute Application</h3>
              <p className="text-muted-foreground leading-relaxed">No lengthy paperwork. Just answer a few questions about yourself and get an instant decision.</p>
            </Card>

            <Card className="p-8 border-none shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center mb-6 text-accent">
                <Globe className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">Anywhere in the World</h3>
              <p className="text-muted-foreground leading-relaxed">We support disbursements to over 50 countries natively. Cross-border limits don't apply here.</p>
            </Card>

            <Card className="p-8 border-none shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 text-primary">
                <Shield className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">Bank-Grade Security</h3>
              <p className="text-muted-foreground leading-relaxed">Your data is protected with military-grade encryption. We are GDPR compliant and fully licensed.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-primary text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 w-1/2 h-full opacity-10 pointer-events-none">
          <img src={`${import.meta.env.BASE_URL}images/global-reach.png`} className="w-full h-full object-cover" alt="" />
        </div>
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-white">Trusted by people globally</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Sarah M.", country: "Canada", quote: "I needed funds quickly for a medical emergency while traveling. Trust Global approved me instantly.", rating: 5 },
              { name: "Ahmed K.", country: "UAE", quote: "The most transparent loan process I've ever experienced. The monthly payments are exactly what the calculator showed.", rating: 5 },
              { name: "Elena R.", country: "Spain", quote: "As an expat, getting a loan is usually a nightmare. Trust Global made it completely painless.", rating: 4 }
            ].map((t, i) => (
              <Card key={i} className="bg-white/10 border-white/20 p-8 backdrop-blur-md">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className={`w-5 h-5 ${j < t.rating ? 'fill-accent text-accent' : 'text-white/30'}`} />
                  ))}
                </div>
                <p className="text-lg text-white/90 italic mb-6">"{t.quote}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-accent to-emerald-600 rounded-full flex items-center justify-center font-bold text-white shadow-inner">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{t.name}</h4>
                    <p className="text-sm text-white/60">{t.country}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA / Trust Badges */}
      <section className="py-20 bg-white text-center">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-bold mb-6">Ready to get started?</h2>
          <p className="text-lg text-muted-foreground mb-10">Join thousands of users who have found financial freedom with Trust Global.</p>
          
          {isAuthenticated ? (
            <Link href="/apply">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-bold text-lg px-12 py-6 rounded-xl shadow-xl shadow-primary/20">
                Apply for a Loan
              </Button>
            </Link>
          ) : (
            <Button size="lg" onClick={() => login()} className="bg-primary hover:bg-primary/90 text-white font-bold text-lg px-12 py-6 rounded-xl shadow-xl shadow-primary/20">
              Create an Account
            </Button>
          )}

          <div className="flex flex-wrap justify-center gap-8 mt-16 pt-12 border-t border-border/50">
            <div className="flex items-center gap-2 text-muted-foreground font-medium">
              <CheckCircle className="w-5 h-5 text-accent" /> SSL Secured
            </div>
            <div className="flex items-center gap-2 text-muted-foreground font-medium">
              <CheckCircle className="w-5 h-5 text-accent" /> Licensed Lender
            </div>
            <div className="flex items-center gap-2 text-muted-foreground font-medium">
              <CheckCircle className="w-5 h-5 text-accent" /> GDPR Compliant
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

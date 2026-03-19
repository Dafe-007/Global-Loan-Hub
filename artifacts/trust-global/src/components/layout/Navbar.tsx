import { Link, useLocation } from "wouter";
import { useAuth } from "@workspace/replit-auth-web";
import { Button } from "@/components/ui/button";
import { ShieldCheck, LogOut, LayoutDashboard, Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const { isAuthenticated, login, logout, user } = useAuth();
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between max-w-7xl">
        <Link href="/" className="flex items-center gap-2 group hover-elevate rounded-lg p-1 transition-all">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-md shadow-primary/20 group-hover:shadow-primary/30 transition-all">
            <ShieldCheck className="w-6 h-6 text-accent" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight text-primary">
            Trust<span className="text-accent">Global</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className={`text-sm font-medium transition-colors ${location === '/' ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}>Home</Link>
          {isAuthenticated && (
            <Link href="/dashboard" className={`text-sm font-medium transition-colors ${location === '/dashboard' ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}>Dashboard</Link>
          )}
          {user?.isAdmin && (
            <Link href="/admin" className={`text-sm font-medium transition-colors ${location === '/admin' ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}>Admin Panel</Link>
          )}
          
          <div className="flex items-center gap-4 ml-4">
            {isAuthenticated ? (
              <>
                <Link href="/apply" className="inline-block">
                  <Button className="font-semibold bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg shadow-accent/20 border-none rounded-xl">
                    Apply Now
                  </Button>
                </Link>
                <Button variant="ghost" className="text-muted-foreground hover:text-destructive" onClick={() => logout()}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Log out
                </Button>
              </>
            ) : (
              <Button onClick={() => login()} className="font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 border-none rounded-xl px-6">
                Log in / Sign up
              </Button>
            )}
          </div>
        </nav>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden p-2 text-primary"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border bg-background"
          >
            <div className="flex flex-col p-4 gap-4">
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="p-2 font-medium text-primary">Home</Link>
              {isAuthenticated && (
                <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="p-2 font-medium text-primary">Dashboard</Link>
              )}
              {user?.isAdmin && (
                <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)} className="p-2 font-medium text-primary">Admin Panel</Link>
              )}
              <div className="h-px w-full bg-border my-2" />
              {isAuthenticated ? (
                <div className="flex flex-col gap-3">
                  <Link href="/apply" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button className="w-full font-semibold bg-accent text-accent-foreground rounded-xl">Apply Now</Button>
                  </Link>
                  <Button variant="outline" className="w-full" onClick={() => { logout(); setIsMobileMenuOpen(false); }}>
                    Log out
                  </Button>
                </div>
              ) : (
                <Button onClick={() => { login(); setIsMobileMenuOpen(false); }} className="w-full font-semibold bg-primary text-primary-foreground rounded-xl">
                  Log in / Sign up
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

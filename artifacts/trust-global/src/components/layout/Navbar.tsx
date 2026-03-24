import { Link, useLocation } from "wouter";
import { useAuth } from "@workspace/replit-auth-web";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Menu, X } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const { isAuthenticated, login, logout, user } = useAuth();
  const [location] = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto px-4 h-16 flex items-center justify-between max-w-6xl">
        <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-accent" />
          </div>
          <span className="font-bold text-lg text-primary">
            Trust<span className="text-accent"> Global</span> Finance
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className={`text-sm font-medium ${location === "/" ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}>Home</Link>
          {isAuthenticated && (
            <Link href="/dashboard" className={`text-sm font-medium ${location === "/dashboard" ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}>Dashboard</Link>
          )}
          {user?.isAdmin && (
            <Link href="/admin" className={`text-sm font-medium ${location === "/admin" ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}>Admin</Link>
          )}
          {isAuthenticated ? (
            <>
              <Link href="/apply">
                <Button size="sm" className="bg-accent text-white hover:bg-accent/90">Apply Now</Button>
              </Link>
              <Button size="sm" variant="ghost" onClick={() => logout()} className="text-muted-foreground">Log out</Button>
            </>
          ) : (
            <Button size="sm" onClick={() => login()} className="bg-primary text-white hover:bg-primary/90">Log in / Sign up</Button>
          )}
        </nav>

        <button className="md:hidden p-2 text-primary" onClick={() => setOpen(!open)}>
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-background px-4 py-3 flex flex-col gap-3">
          <Link href="/" onClick={() => setOpen(false)} className="py-2 font-medium text-foreground">Home</Link>
          {isAuthenticated && (
            <Link href="/dashboard" onClick={() => setOpen(false)} className="py-2 font-medium text-foreground">Dashboard</Link>
          )}
          {user?.isAdmin && (
            <Link href="/admin" onClick={() => setOpen(false)} className="py-2 font-medium text-foreground">Admin</Link>
          )}
          {isAuthenticated ? (
            <>
              <Link href="/apply" onClick={() => setOpen(false)}>
                <Button className="w-full bg-accent text-white">Apply Now</Button>
              </Link>
              <Button variant="outline" className="w-full" onClick={() => { logout(); setOpen(false); }}>Log out</Button>
            </>
          ) : (
            <Button className="w-full bg-primary text-white" onClick={() => { login(); setOpen(false); }}>Log in / Sign up</Button>
          )}
        </div>
      )}
    </header>
  );
}

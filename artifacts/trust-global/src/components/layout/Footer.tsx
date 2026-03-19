import { ShieldCheck } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground py-8 mt-auto">
      <div className="mx-auto px-4 max-w-6xl flex flex-col md:flex-row justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="w-5 h-5 text-accent" />
            <span className="font-bold text-lg">Trust<span className="text-accent">Global</span></span>
          </div>
          <p className="text-primary-foreground/60 text-sm max-w-xs">Fast, secure cross-border loans wherever you are.</p>
        </div>
        <div className="flex gap-8 text-sm text-primary-foreground/60">
          <div className="space-y-1">
            <p className="text-white font-medium mb-2">Legal</p>
            <p><a href="#" className="hover:text-accent">Terms of Service</a></p>
            <p><a href="#" className="hover:text-accent">Privacy Policy</a></p>
          </div>
          <div className="space-y-1">
            <p className="text-white font-medium mb-2">Contact</p>
            <p>support@trustglobal.finance</p>
          </div>
        </div>
      </div>
      <div className="mx-auto px-4 max-w-6xl mt-6 pt-4 border-t border-primary-foreground/10 text-center text-primary-foreground/40 text-xs">
        &copy; {new Date().getFullYear()} Trust Global Finance. All rights reserved.
      </div>
    </footer>
  );
}

import { ShieldCheck } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground py-12 mt-auto">
      <div className="container mx-auto px-4 max-w-7xl grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className="w-8 h-8 text-accent" />
            <span className="font-display font-bold text-2xl tracking-tight">
              Trust<span className="text-accent">Global</span>
            </span>
          </div>
          <p className="text-primary-foreground/70 max-w-md">
            Providing fast, secure, and accessible cross-border loans to empower your financial journey, wherever you are in the world.
          </p>
        </div>
        <div>
          <h4 className="font-bold text-lg mb-4 text-white">Legal</h4>
          <ul className="space-y-2 text-primary-foreground/70">
            <li><a href="#" className="hover:text-accent transition-colors">Terms of Service</a></li>
            <li><a href="#" className="hover:text-accent transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-accent transition-colors">Lending Licenses</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-lg mb-4 text-white">Contact</h4>
          <ul className="space-y-2 text-primary-foreground/70">
            <li>support@trustglobal.finance</li>
            <li>+1 (800) 123-4567</li>
            <li>123 Global Finance Way<br />New York, NY 10001</li>
          </ul>
        </div>
      </div>
      <div className="container mx-auto px-4 max-w-7xl mt-12 pt-8 border-t border-primary-foreground/10 text-center text-primary-foreground/50 text-sm">
        &copy; {new Date().getFullYear()} Trust Global Finance. All rights reserved.
      </div>
    </footer>
  );
}

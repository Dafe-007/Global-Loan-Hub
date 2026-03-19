import { useAuth } from "@workspace/replit-auth-web";
import { useGetUserLoans } from "@workspace/api-client-react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, CreditCard, AlertCircle, Loader2 } from "lucide-react";

function fmtDate(d: string | undefined) {
  if (!d) return "";
  try { return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }); }
  catch { return d; }
}

function StatusBadge({ status }: { status: string }) {
  const cls =
    status === "approved" ? "bg-green-100 text-green-800" :
    status === "rejected" ? "bg-red-100 text-red-800" :
    "bg-yellow-100 text-yellow-800";
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase ${cls}`}>
      {status}
    </span>
  );
}

export default function Dashboard() {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [, setLocation] = useLocation();

  const { data: loans, isLoading, error } = useGetUserLoans({ query: { enabled: isAuthenticated } });

  if (isAuthLoading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;
  }
  if (!isAuthenticated) {
    setLocation("/login");
    return null;
  }

  return (
    <div className="mx-auto px-4 py-8 max-w-3xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-3">
        <div>
          <h1 className="text-2xl font-bold text-primary">Welcome back, {user?.name || "there"}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage your loan applications</p>
        </div>
        <Link href="/apply">
          <Button className="bg-primary text-white hover:bg-primary/90 w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" /> Apply for a Loan
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading your loans...
        </div>
      ) : error ? (
        <Card className="p-6 border-destructive/30 bg-destructive/5 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
          <p className="text-sm text-destructive">Failed to load loans. Please refresh the page.</p>
        </Card>
      ) : loans && loans.length > 0 ? (
        <div className="space-y-3">
          {loans.map(loan => (
            <Card key={loan.id} className="p-4 border border-border">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <p className="text-lg font-bold text-primary">${Number(loan.amount).toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">{loan.duration} months · {loan.country}</p>
                </div>
                <StatusBadge status={loan.status} />
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {loan.monthlyPayment != null && !isNaN(Number(loan.monthlyPayment)) && (
                  <div>
                    <p className="text-xs text-muted-foreground">Monthly payment</p>
                    <p className="font-semibold">${Number(loan.monthlyPayment).toFixed(2)}</p>
                  </div>
                )}
                {loan.repaymentDate && loan.status === "approved" && (
                  <div>
                    <p className="text-xs text-muted-foreground">First due date</p>
                    <p className="font-semibold text-accent">{fmtDate(loan.repaymentDate)}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-muted-foreground">Applied</p>
                  <p className="font-medium">{fmtDate(loan.createdAt)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Application #</p>
                  <p className="font-medium">{loan.id}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-10 text-center border-dashed border-2 border-border">
          <CreditCard className="w-10 h-10 text-muted-foreground/40 mx-auto mb-4" />
          <h3 className="font-bold text-lg mb-1">No loans yet</h3>
          <p className="text-sm text-muted-foreground mb-6">Apply in under 5 minutes and get an instant decision.</p>
          <Link href="/apply">
            <Button className="bg-accent text-white hover:bg-accent/90">Start Application</Button>
          </Link>
        </Card>
      )}
    </div>
  );
}

import { useAuth } from "@workspace/replit-auth-web";
import { useGetUserLoans } from "@workspace/api-client-react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, CreditCard, Calendar, Clock, AlertCircle } from "lucide-react";
import { format } from "date-fns";

export default function Dashboard() {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [, setLocation] = useLocation();
  
  const { data: loans, isLoading: isLoansLoading, error } = useGetUserLoans({
    query: {
      enabled: isAuthenticated
    }
  });

  if (isAuthLoading) {
    return <div className="min-h-screen flex items-center justify-center"><Skeleton className="w-32 h-32 rounded-full" /></div>;
  }

  if (!isAuthenticated) {
    setLocation("/login");
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved": return "bg-success/10 text-success border-success/20";
      case "rejected": return "bg-destructive/10 text-destructive border-destructive/20";
      case "pending": return "bg-warning/10 text-warning-foreground border-warning/20";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-primary">Welcome back, {user?.name || "User"}</h1>
          <p className="text-muted-foreground mt-1">Manage your active loans and applications</p>
        </div>
        <Link href="/apply">
          <Button className="bg-primary hover:bg-primary/90 rounded-xl shadow-lg shadow-primary/20">
            <Plus className="w-4 h-4 mr-2" /> Apply for a Loan
          </Button>
        </Link>
      </div>

      {isLoansLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <Card key={i} className="p-6 space-y-4">
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-10 w-1/2" />
              <div className="pt-4 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </Card>
          ))}
        </div>
      ) : error ? (
        <Card className="p-8 border-destructive bg-destructive/5 text-center">
          <AlertCircle className="w-10 h-10 text-destructive mx-auto mb-4" />
          <h3 className="text-xl font-bold text-destructive mb-2">Error loading loans</h3>
          <p className="text-muted-foreground">Please try refreshing the page later.</p>
        </Card>
      ) : loans && loans.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loans.map(loan => (
            <Card key={loan.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 border-border/50">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <Badge className={`${getStatusColor(loan.status)} border px-3 py-1 text-xs font-semibold capitalize uppercase`}>
                    {loan.status}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    ID: #{loan.id}
                  </span>
                </div>
                
                <div className="mb-6">
                  <p className="text-sm font-medium text-muted-foreground mb-1">Principal Amount</p>
                  <p className="text-3xl font-extrabold text-primary">${loan.amount.toLocaleString()}</p>
                </div>
                
                <div className="space-y-3 bg-secondary/50 rounded-xl p-4">
                  <div className="flex items-center text-sm">
                    <Clock className="w-4 h-4 text-muted-foreground mr-3" />
                    <span className="text-muted-foreground w-24">Duration:</span>
                    <span className="font-semibold text-foreground">{loan.duration} months</span>
                  </div>
                  {loan.monthlyPayment && (
                    <div className="flex items-center text-sm">
                      <CreditCard className="w-4 h-4 text-muted-foreground mr-3" />
                      <span className="text-muted-foreground w-24">Monthly:</span>
                      <span className="font-semibold text-foreground">${loan.monthlyPayment.toFixed(2)}</span>
                    </div>
                  )}
                  {loan.repaymentDate && loan.status === 'approved' && (
                    <div className="flex items-center text-sm">
                      <Calendar className="w-4 h-4 text-accent mr-3" />
                      <span className="text-muted-foreground w-24">Next due:</span>
                      <span className="font-semibold text-accent">{format(new Date(loan.repaymentDate), "MMM dd, yyyy")}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="bg-muted/30 px-6 py-4 border-t border-border/50 flex justify-between items-center text-xs text-muted-foreground">
                <span>Applied: {loan.createdAt ? format(new Date(loan.createdAt), "MMM dd, yyyy") : "Recently"}</span>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="flex flex-col items-center justify-center p-16 text-center border-dashed border-2 border-border/60 bg-muted/10">
          <div className="w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center mb-6">
            <CreditCard className="w-8 h-8 text-primary/40" />
          </div>
          <h3 className="text-2xl font-bold text-primary mb-2">No loans yet</h3>
          <p className="text-muted-foreground max-w-md mx-auto mb-8">
            You haven't applied for any loans. Experience lightning-fast approvals with our simple application process.
          </p>
          <Link href="/apply">
            <Button size="lg" className="bg-accent hover:bg-accent/90 rounded-xl">
              Start Application
            </Button>
          </Link>
        </Card>
      )}
    </div>
  );
}

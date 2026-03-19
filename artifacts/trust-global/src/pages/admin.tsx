import { useState, useEffect } from "react";
import { useAuth } from "@workspace/replit-auth-web";
import { useLocation } from "wouter";
import { useAdminGetAllLoans, useAdminUpdateLoanStatus, useAdminGetAllUsers, getAdminGetAllLoansQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

function fmtDate(d: string | undefined) {
  if (!d) return "–";
  try { return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }); }
  catch { return d; }
}

function StatusBadge({ status }: { status: string }) {
  const cls =
    status === "approved" ? "bg-green-100 text-green-800" :
    status === "rejected" ? "bg-red-100 text-red-800" :
    "bg-yellow-100 text-yellow-800";
  return <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold uppercase ${cls}`}>{status}</span>;
}

export default function AdminPage() {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<"loans"|"users">("loans");

  const { data: loans, isLoading: loansLoading } = useAdminGetAllLoans({ query: { enabled: isAuthenticated && !!user?.isAdmin } });
  const { data: users, isLoading: usersLoading } = useAdminGetAllUsers({ query: { enabled: isAuthenticated && !!user?.isAdmin && tab === "users" } });
  const updateMutation = useAdminUpdateLoanStatus();

  useEffect(() => {
    if (!isAuthLoading) {
      if (!isAuthenticated) setLocation("/login");
      else if (!user?.isAdmin) setLocation("/dashboard");
    }
  }, [isAuthLoading, isAuthenticated, user, setLocation]);

  if (isAuthLoading || !isAuthenticated || !user?.isAdmin) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;
  }

  function handleUpdate(loanId: number, status: "approved" | "rejected") {
    updateMutation.mutate(
      { loanId, data: { status } },
      {
        onSuccess: () => {
          toast({ title: `Loan ${status}` });
          queryClient.invalidateQueries({ queryKey: getAdminGetAllLoansQueryKey() });
        },
        onError: () => toast({ variant: "destructive", title: "Action failed" }),
      }
    );
  }

  const total    = loans?.length ?? 0;
  const pending  = loans?.filter(l => l.status === "pending").length ?? 0;
  const approved = loans?.filter(l => l.status === "approved").length ?? 0;

  return (
    <div className="mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-2xl font-bold text-primary mb-1">Admin Panel</h1>
      <p className="text-sm text-muted-foreground mb-6">Review and manage all loan applications</p>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: "Total", value: total,    color: "text-primary" },
          { label: "Pending", value: pending,  color: "text-yellow-600" },
          { label: "Approved", value: approved, color: "text-green-600" },
        ].map(s => (
          <Card key={s.label} className="p-4 text-center border border-border">
            <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border mb-5">
        {(["loans","users"] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              tab === t ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {t === "loans" ? "Loan Applications" : "Users"}
          </button>
        ))}
      </div>

      {/* Loans Tab */}
      {tab === "loans" && (
        <div className="space-y-3">
          {loansLoading ? (
            <div className="flex justify-center py-12"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>
          ) : loans?.length === 0 ? (
            <p className="text-center text-muted-foreground py-10 text-sm">No applications yet.</p>
          ) : (
            loans?.map(loan => (
              <Card key={loan.id} className="p-4 border border-border">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <p className="font-semibold">{loan.fullName}</p>
                    <p className="text-xs text-muted-foreground">{loan.userEmail} · {loan.phoneNumber}</p>
                  </div>
                  <StatusBadge status={loan.status} />
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm mb-3">
                  <div><span className="text-muted-foreground text-xs">Amount: </span><span className="font-semibold text-primary">${Number(loan.amount).toLocaleString()}</span></div>
                  <div><span className="text-muted-foreground text-xs">Duration: </span><span>{loan.duration} months</span></div>
                  <div><span className="text-muted-foreground text-xs">Country: </span><span>{loan.country}</span></div>
                  <div><span className="text-muted-foreground text-xs">Income: </span><span>{loan.monthlyIncomeRange}</span></div>
                  {loan.occupation && <div><span className="text-muted-foreground text-xs">Occupation: </span><span>{loan.occupation}</span></div>}
                  {loan.employerName && <div><span className="text-muted-foreground text-xs">Employer: </span><span>{loan.employerName}</span></div>}
                  {loan.bankName && <div><span className="text-muted-foreground text-xs">Bank: </span><span>{loan.bankName}</span></div>}
                  {loan.bankAccountNumber && <div><span className="text-muted-foreground text-xs">Account: </span><span className="font-mono">****{loan.bankAccountNumber.slice(-4)}</span></div>}
                  {loan.dateOfBirth && <div><span className="text-muted-foreground text-xs">DOB: </span><span>{loan.dateOfBirth}</span></div>}
                  <div><span className="text-muted-foreground text-xs">Applied: </span><span>{fmtDate(loan.createdAt)}</span></div>
                </div>
                {loan.status === "pending" && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => handleUpdate(loan.id, "approved")}
                      disabled={updateMutation.isPending}
                    >
                      <CheckCircle className="w-3.5 h-3.5 mr-1" /> Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                      onClick={() => handleUpdate(loan.id, "rejected")}
                      disabled={updateMutation.isPending}
                    >
                      <XCircle className="w-3.5 h-3.5 mr-1" /> Reject
                    </Button>
                  </div>
                )}
              </Card>
            ))
          )}
        </div>
      )}

      {/* Users Tab */}
      {tab === "users" && (
        <div className="space-y-3">
          {usersLoading ? (
            <div className="flex justify-center py-12"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>
          ) : users?.length === 0 ? (
            <p className="text-center text-muted-foreground py-10 text-sm">No users yet.</p>
          ) : (
            users?.map(u => (
              <Card key={u.id} className="p-4 border border-border flex items-center justify-between gap-3">
                <div>
                  <p className="font-semibold">{u.name || "Unknown"}</p>
                  <p className="text-xs text-muted-foreground">{u.email}</p>
                  <p className="text-xs text-muted-foreground">Joined {fmtDate(u.createdAt)}</p>
                </div>
                {u.isAdmin && (
                  <span className="px-2 py-0.5 rounded text-xs font-bold bg-primary/10 text-primary">Admin</span>
                )}
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}

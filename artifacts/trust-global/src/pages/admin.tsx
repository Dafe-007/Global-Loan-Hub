import { useState, useEffect } from "react";
import { useAuth } from "@workspace/replit-auth-web";
import { useLocation } from "wouter";
import { useAdminGetAllLoans, useAdminUpdateLoanStatus, useAdminGetAllUsers, getAdminGetAllLoansQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, CheckCircle, XCircle, Users, CreditCard, DollarSign, Activity } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

export default function AdminPage() {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("loans");

  const { data: loans, isLoading: isLoansLoading } = useAdminGetAllLoans({ query: { enabled: isAuthenticated && user?.isAdmin } });
  const { data: users, isLoading: isUsersLoading } = useAdminGetAllUsers({ query: { enabled: isAuthenticated && user?.isAdmin && activeTab === "users" } });
  const updateStatusMutation = useAdminUpdateLoanStatus();

  useEffect(() => {
    if (!isAuthLoading) {
      if (!isAuthenticated) {
        setLocation("/login");
      } else if (!user?.isAdmin) {
        setLocation("/dashboard");
      }
    }
  }, [isAuthLoading, isAuthenticated, user, setLocation]);

  if (isAuthLoading || !isAuthenticated || !user?.isAdmin) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  const handleStatusUpdate = (loanId: number, status: "approved" | "rejected") => {
    updateStatusMutation.mutate(
      { loanId, data: { status } },
      {
        onSuccess: () => {
          toast({ title: `Loan ${status} successfully` });
          queryClient.invalidateQueries({ queryKey: getAdminGetAllLoansQueryKey() });
        },
        onError: (error) => {
          toast({ variant: "destructive", title: "Action failed", description: error.error || "An error occurred" });
        }
      }
    );
  };

  // Stats
  const totalLoans = loans?.length || 0;
  const pendingLoans = loans?.filter(l => l.status === 'pending').length || 0;
  const totalDisbursed = loans?.filter(l => l.status === 'approved').reduce((sum, l) => sum + l.amount, 0) || 0;

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-primary">Admin Control Panel</h1>
        <p className="text-muted-foreground mt-1">Manage platform applications and users</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <Card className="p-6 border-l-4 border-l-primary hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Applications</p>
              <p className="text-2xl font-bold">{totalLoans}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6 border-l-4 border-l-warning hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center text-warning-foreground">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Pending Review</p>
              <p className="text-2xl font-bold">{pendingLoans}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-l-4 border-l-success hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center text-success">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Disbursed</p>
              <p className="text-2xl font-bold">${totalDisbursed.toLocaleString()}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-l-4 border-l-secondary-foreground hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center text-secondary-foreground">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">System Users</p>
              <p className="text-2xl font-bold">{users?.length || "—"}</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="border-border/50 shadow-md rounded-2xl overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="px-6 pt-6 border-b border-border/50 bg-muted/20">
            <TabsList className="bg-background/50 mb-0 pb-0 h-12 gap-6 rounded-none border-b-0">
              <TabsTrigger value="loans" className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none text-base px-1 h-full bg-transparent">
                Loan Applications
              </TabsTrigger>
              <TabsTrigger value="users" className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none text-base px-1 h-full bg-transparent">
                User Directory
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="loans" className="p-0 m-0">
            <div className="overflow-x-auto">
              {isLoansLoading ? (
                <div className="p-12 text-center text-muted-foreground flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin mr-2"/> Loading data...</div>
              ) : (
                <Table>
                  <TableHeader className="bg-muted/30">
                    <TableRow>
                      <TableHead className="w-20">ID</TableHead>
                      <TableHead>Applicant</TableHead>
                      <TableHead>Location / Income</TableHead>
                      <TableHead>Amount & Terms</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loans?.map((loan) => (
                      <TableRow key={loan.id} className="hover:bg-muted/10">
                        <TableCell className="font-medium text-muted-foreground">#{loan.id}</TableCell>
                        <TableCell>
                          <p className="font-semibold text-foreground">{loan.fullName}</p>
                          <p className="text-xs text-muted-foreground">{loan.userEmail}</p>
                          <p className="text-xs text-muted-foreground">{loan.phoneNumber}</p>
                        </TableCell>
                        <TableCell>
                          <p className="font-medium">{loan.country}</p>
                          <p className="text-xs text-muted-foreground">{loan.monthlyIncomeRange}</p>
                        </TableCell>
                        <TableCell>
                          <p className="font-bold text-primary">${loan.amount.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">{loan.duration} mos @ ${(loan.amount * (1 + 0.02 * loan.duration) / loan.duration).toFixed(0)}/mo</p>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                          {loan.createdAt ? format(new Date(loan.createdAt), "MMM dd, yyyy") : "N/A"}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={
                            loan.status === 'approved' ? 'bg-success/10 text-success border-success/30' : 
                            loan.status === 'rejected' ? 'bg-destructive/10 text-destructive border-destructive/30' : 
                            'bg-warning/10 text-warning-foreground border-warning/30'
                          }>
                            {loan.status.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {loan.status === 'pending' ? (
                            <div className="flex justify-end gap-2">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="border-success text-success hover:bg-success hover:text-white"
                                onClick={() => handleStatusUpdate(loan.id, 'approved')}
                                disabled={updateStatusMutation.isPending}
                              >
                                <CheckCircle className="w-4 h-4 mr-1" /> Approve
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="border-destructive text-destructive hover:bg-destructive hover:text-white"
                                onClick={() => handleStatusUpdate(loan.id, 'rejected')}
                                disabled={updateStatusMutation.isPending}
                              >
                                <XCircle className="w-4 h-4 mr-1" /> Reject
                              </Button>
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground italic">Action taken</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                    {loans?.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                          No applications found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </div>
          </TabsContent>

          <TabsContent value="users" className="p-0 m-0">
            <div className="overflow-x-auto">
              {isUsersLoading ? (
                <div className="p-12 text-center text-muted-foreground flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin mr-2"/> Loading data...</div>
              ) : (
                <Table>
                  <TableHeader className="bg-muted/30">
                    <TableRow>
                      <TableHead>User ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Joined</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users?.map((u) => (
                      <TableRow key={u.id} className="hover:bg-muted/10">
                        <TableCell className="font-mono text-xs text-muted-foreground">{u.id.substring(0,8)}...</TableCell>
                        <TableCell className="font-semibold">{u.name || "Unknown"}</TableCell>
                        <TableCell>{u.email}</TableCell>
                        <TableCell>
                          {u.isAdmin ? (
                            <Badge className="bg-primary/10 text-primary border-primary/20">Admin</Badge>
                          ) : (
                            <Badge variant="outline" className="text-muted-foreground">User</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {u.createdAt ? format(new Date(u.createdAt), "MMM dd, yyyy") : "N/A"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}

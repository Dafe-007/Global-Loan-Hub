import { Router, type IRouter } from "express";
import { db, loansTable, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { z } from "zod/v4";

const router: IRouter = Router();

function requireAdmin(req: any, res: any): boolean {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return false;
  }
  if (!req.user.isAdmin) {
    res.status(403).json({ error: "Forbidden" });
    return false;
  }
  return true;
}

router.get("/admin/loans", async (req, res) => {
  if (!requireAdmin(req, res)) return;
  const loans = await db
    .select({
      id: loansTable.id,
      userId: loansTable.userId,
      userName: usersTable.name,
      userEmail: usersTable.email,
      fullName: loansTable.fullName,
      country: loansTable.country,
      phoneNumber: loansTable.phoneNumber,
      monthlyIncomeRange: loansTable.monthlyIncomeRange,
      amount: loansTable.amount,
      duration: loansTable.duration,
      status: loansTable.status,
      repaymentDate: loansTable.repaymentDate,
      monthlyPayment: loansTable.monthlyPayment,
      createdAt: loansTable.createdAt,
    })
    .from(loansTable)
    .leftJoin(usersTable, eq(loansTable.userId, usersTable.id))
    .orderBy(loansTable.createdAt);
  res.json(loans);
});

router.patch("/admin/loans/:loanId", async (req, res) => {
  if (!requireAdmin(req, res)) return;
  const loanId = parseInt(req.params.loanId);
  if (isNaN(loanId)) {
    res.status(400).json({ error: "Invalid loan ID" });
    return;
  }
  const parsed = z.object({ status: z.enum(["approved", "rejected"]) }).safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid status" });
    return;
  }
  const [loan] = await db
    .update(loansTable)
    .set({ status: parsed.data.status })
    .where(eq(loansTable.id, loanId))
    .returning();
  if (!loan) {
    res.status(404).json({ error: "Loan not found" });
    return;
  }
  res.json(loan);
});

router.get("/admin/users", async (req, res) => {
  if (!requireAdmin(req, res)) return;
  const users = await db.select().from(usersTable);
  res.json(users);
});

export default router;

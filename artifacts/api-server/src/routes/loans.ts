import { Router, type IRouter } from "express";
import { db, loansTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { z } from "zod/v4";

const router: IRouter = Router();

const loanApplicationSchema = z.object({
  fullName: z.string().min(2),
  country: z.string().min(2),
  phoneNumber: z.string().min(5),
  monthlyIncomeRange: z.string(),
  dateOfBirth: z.string().optional(),
  occupation: z.string().optional(),
  employerName: z.string().optional(),
  bankName: z.string().optional(),
  bankAccountNumber: z.string().optional(),
  amount: z.number().min(500).max(50000),
  duration: z.number().int().min(3).max(36),
});

const INCOME_THRESHOLDS: Record<string, number> = {
  "<$500": 500,
  "$500-$1000": 1000,
  "$1000-$2500": 2500,
  "$2500-$5000": 5000,
  "$5000+": 999999,
};

function autoDecide(monthlyIncomeRange: string, amount: number): "approved" | "pending" {
  const incomeMin = INCOME_THRESHOLDS[monthlyIncomeRange] ?? 0;
  if (incomeMin >= 1000 && amount <= 10000) return "approved";
  if (incomeMin >= 2500 && amount <= 25000) return "approved";
  if (incomeMin >= 5000 && amount <= 50000) return "approved";
  return "pending";
}

function calcRepaymentDate(durationMonths: number): string {
  const date = new Date();
  date.setMonth(date.getMonth() + durationMonths);
  return date.toISOString().split("T")[0];
}

function calcMonthlyPayment(amount: number, duration: number): number {
  return parseFloat(((amount * (1 + 0.02 * duration)) / duration).toFixed(2));
}

router.get("/loans", async (req, res) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const loans = await db
    .select()
    .from(loansTable)
    .where(eq(loansTable.userId, req.user.id));
  res.json(loans);
});

router.post("/loans", async (req, res) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const parsed = loanApplicationSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input", details: parsed.error.issues });
    return;
  }
  const {
    fullName, country, phoneNumber, monthlyIncomeRange,
    dateOfBirth, occupation, employerName, bankName, bankAccountNumber,
    amount, duration,
  } = parsed.data;

  const status = autoDecide(monthlyIncomeRange, amount);
  const repaymentDate = calcRepaymentDate(duration);
  const monthlyPayment = calcMonthlyPayment(amount, duration);

  const [loan] = await db.insert(loansTable).values({
    userId: req.user.id,
    fullName,
    country,
    phoneNumber,
    monthlyIncomeRange,
    dateOfBirth: dateOfBirth ?? null,
    occupation: occupation ?? null,
    employerName: employerName ?? null,
    bankName: bankName ?? null,
    bankAccountNumber: bankAccountNumber ?? null,
    amount: amount.toString(),
    duration,
    status,
    repaymentDate,
    monthlyPayment: monthlyPayment.toString(),
  }).returning();

  res.status(201).json(loan);
});

export default router;

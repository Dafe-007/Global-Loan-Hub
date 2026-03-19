import { pgTable, text, serial, numeric, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const loansTable = pgTable("loans", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  fullName: text("full_name").notNull(),
  country: text("country").notNull(),
  phoneNumber: text("phone_number").notNull(),
  monthlyIncomeRange: text("monthly_income_range").notNull(),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  duration: integer("duration").notNull(),
  status: text("status", { enum: ["pending", "approved", "rejected"] }).notNull().default("pending"),
  repaymentDate: text("repayment_date"),
  monthlyPayment: numeric("monthly_payment", { precision: 12, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertLoanSchema = createInsertSchema(loansTable).omit({ id: true, createdAt: true });
export type InsertLoan = z.infer<typeof insertLoanSchema>;
export type Loan = typeof loansTable.$inferSelect;

"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Card } from "@/components/ui/card";

interface Transaction {
  amount: number;
  category: string;
}

interface Budget {
  category: string;
  amount: number; // Budgeted amount
}

interface ChartData {
  category: string;
  budget: number;
  actual: number;
}

export default function BudgetChart() {
  const [chartData, setChartData] = useState<ChartData[]>([]);

  useEffect(() => {
    async function fetchData() {
      const transactionsRes = await fetch("/api/transactions");
      const budgetsRes = await fetch("/api/budgets");
      if (!transactionsRes.ok || !budgetsRes.ok) return;

      const transactions: Transaction[] = await transactionsRes.json();
      const budgets: Budget[] = await budgetsRes.json();

      // Explicitly define accumulator type
      const spendingByCategory: Record<string, number> = transactions.reduce((acc, { amount, category }) => {
        acc[category] = (acc[category] || 0) + amount;
        return acc;
      }, {} as Record<string, number>); // <-- Explicit Type Definition

      const data: ChartData[] = budgets.map(({ category, amount }) => ({
        category,
        budget: amount,
        actual: spendingByCategory[category] || 0,
      }));

      setChartData(data);
    }

    fetchData();
  }, []);

  return (
    <Card className="p-6 mt-6 shadow-lg rounded-xl bg-white">
      <h2 className="text-2xl font-semibold mb-4">📊 Budget vs Actual</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <XAxis dataKey="category" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="budget" fill="#36a2eb" name="Budget" />
          <Bar dataKey="actual" fill="#ff6384" name="Actual Spending" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}

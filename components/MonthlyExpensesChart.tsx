"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Card } from "@/components/ui/card";

interface Transaction {
  _id: string;
  amount: number;
  date: string;
}

export default function MonthlyExpensesChart() {
  const [chartData, setChartData] = useState<{ month: string; total: number }[]>([]);

  useEffect(() => {
    async function fetchTransactions() {
      const response = await fetch("/api/transactions");
      if (response.ok) {
        const transactions: Transaction[] = await response.json();

        const groupedData: { [key: string]: number } = {};
        transactions.forEach(({ amount, date }) => {
          const month = new Date(date).toLocaleString("default", { month: "short", year: "numeric" });
          groupedData[month] = (groupedData[month] || 0) + amount;
        });

        setChartData(Object.keys(groupedData).map((month) => ({ month, total: groupedData[month] })));
      }
    }
    fetchTransactions();
  }, []);

  return (
    <Card className="p-6 shadow-lg rounded-xl bg-[var(--card-bg)] border border-[var(--border-color)] MEC_div">
      <h2 className="text-2xl font-semibold mb-4">📊 Monthly Expenses</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <XAxis dataKey="month" stroke="var(--text-color)" />
          <YAxis stroke="var(--text-color)" />
          <Tooltip />
          <Bar dataKey="total" fill="var(--button-bg)" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}

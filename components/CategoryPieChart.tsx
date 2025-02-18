"use client";

import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card } from "@/components/ui/card";

interface Transaction {
  amount: number;
  category: string;
}

const COLORS = ["#ff6384", "#36a2eb", "#ffce56", "#4bc0c0", "#9966ff", "#ff0000"];

export default function CategoryPieChart() {
  const [chartData, setChartData] = useState<{ category: string; total: number }[]>([]);

  useEffect(() => {
    async function fetchTransactions() {
      const response = await fetch("/api/transactions");
      if (!response.ok) return;
      const transactions: Transaction[] = await response.json();

      const groupedData: { [key: string]: number } = {};
      transactions.forEach(({ amount, category }) => {
        groupedData[category] = (groupedData[category] || 0) + amount;
      });

      setChartData(Object.keys(groupedData).map((category) => ({ category, total: groupedData[category] })));
    }
    fetchTransactions();
  }, []);

  return (
    <Card className="p-6 mt-6 shadow-lg rounded-xl bg-[var(--card-bg)] border border-[var(--border-color)]">
      <h2 className="text-2xl font-semibold mb-4">📊 Spending by Category</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={chartData} dataKey="total" nameKey="category" cx="50%" cy="50%" outerRadius={100} fill="#8884d8">
            {chartData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
}

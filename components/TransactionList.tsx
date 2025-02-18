"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface Transaction {
  _id: string;
  amount: number;
  date: string;
  description: string;
}

export default function TransactionList() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTransactions() {
      const response = await fetch("/api/transactions");
      if (response.ok) {
        const data = await response.json();

        // Sort transactions by date (most recent first)
        const sortedTransactions = data.sort((a: Transaction, b: Transaction) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        setTransactions(sortedTransactions);
      }
      setLoading(false);
    }
    fetchTransactions();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this transaction?")) return;
    await fetch(`/api/transactions/${id}`, { method: "DELETE" });
    setTransactions(transactions.filter((t) => t._id !== id));
  };

  return (
    <Card className="p-6 mt-6 shadow-lg rounded-xl bg-[var(--card-bg)] border border-[var(--border-color)]">
      <h2 className="text-2xl font-semibold mb-4">📋 Transactions</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="space-y-3">
          {transactions.map((t) => (
            <li key={t._id} className="p-3 rounded-lg border border-[var(--border-color)] bg-white shadow">
              {/* First Row: Date | Amount | Delete Button */}
              <div className="flex justify-between items-center text-gray-900 font-medium">
                <span>{new Date(t.date).toLocaleDateString()}</span>
                <span className="text-lg font-semibold">₹{t.amount}</span>
                <Button onClick={() => handleDelete(t._id)} className="text-red-500 hover:text-red-600"><Trash2 className="w-6 h-5" /></Button>
              </div>

              {/* Second Row: Description */}
              <div className="text-gray-600 mt-1 text-sm italic">{t.description}</div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

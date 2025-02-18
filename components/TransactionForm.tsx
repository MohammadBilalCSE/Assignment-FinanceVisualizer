"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const categories = ["Food", "Rent", "Transportation", "Entertainment", "Other"];

const schema = z.object({
  amount: z.coerce.number().min(1, "Amount must be greater than 0"),
  date: z.string().nonempty("Date is required"),
  description: z.string().min(3, "Description must be at least 3 characters"),
  category: z.string().nonempty("Category is required"),
});

type TransactionFormData = z.infer<typeof schema>;

export default function TransactionForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(schema),
  });

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: TransactionFormData) => {
    setLoading(true);
    await fetch("/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setLoading(false);
  };

  return (
    <Card className="p-6 shadow-lg rounded-xl bg-[var(--card-bg)] border border-[var(--border-color)]">
      <h2 className="text-2xl font-semibold mb-4">💰 Add Transaction</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input type="number" className="px-2 py-1" placeholder="Amount (₹)" {...register("amount")} />
        {errors.amount && <p className="text-red-500 text-sm">{errors.amount.message}</p>}

        <Input type="date" className="px-2 py-1" {...register("date")} />
        {errors.date && <p className="text-red-500 text-sm">{errors.date.message}</p>}

        <Input type="text" className="px-2 py-1" placeholder="Description" {...register("description")} />
        {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}

        <select className="w-full border rounded-lg px-2 py-1" {...register("category")}>
          <option value="">Select Category</option>
          {categories.map((category) => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
        {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}

        <Button type="submit" className="w-full bg-[var(--button-bg)] hover:bg-[var(--button-hover)] text-white py-2 rounded-lg transition-all">
          {loading ? "Adding..." : "Add Transaction"}
        </Button>
      </form>
    </Card>
  );
}

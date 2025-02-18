"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const categories = ["Food", "Rent", "Transportation", "Entertainment", "Other"];
const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format

// Define the form data type
interface BudgetFormData {
  category: string;
  amount: number;
}

export default function BudgetForm() {
  const { register, handleSubmit, reset } = useForm<BudgetFormData>();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: BudgetFormData) => {
    setLoading(true);
    const response = await fetch("/api/budgets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, month: currentMonth }),
    });

    setLoading(false);
    if (response.ok) {
      alert("Budget updated!");
      reset();
    } else {
      alert("Error setting budget.");
    }
  };

  return (
    <Card className="p-6 shadow-lg rounded-xl bg-white">
      <h2 className="text-2xl font-semibold mb-4">🎯 Set Monthly Budget</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <select className="w-full p-2 border rounded-lg" {...register("category", { required: true })}>
          {categories.map((category) => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>

        <Input type="number" placeholder="Budget (₹)" {...register("amount", { required: true, valueAsNumber: true })} />

        <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg">
          {loading ? "Saving..." : "Set Budget"}
        </Button>
      </form>
    </Card>
  );
}

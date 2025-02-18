import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../lib/mongodb";
import Budget from "../../../models/Budget";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await connectToDatabase();

    if (req.method === "GET") {
        const { month } = req.query;
        const budgets = await Budget.find(month ? { month } : {});
        return res.status(200).json(budgets);
    }

    if (req.method === "POST") {
        try {
            const { category, amount, month } = req.body;

            if (!category || !amount || !month) {
                return res.status(400).json({ error: "All fields are required" });
            }

            let budget = await Budget.findOne({ category, month });
            if (budget) {
                budget.amount = amount; // Update existing budget
            } else {
                budget = new Budget({ category, amount, month });
            }

            await budget.save();
            return res.status(201).json(budget);
        } catch (error) {
            console.error("Database error:", error);
            return res.status(500).json({ error: "Database error" });
        }
    }

    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
}

import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../lib/mongodb";
import Transaction from "../../../models/Transaction";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await connectToDatabase();

    if (req.method === "GET") {
        const transactions = await Transaction.find();
        return res.status(200).json(transactions);
    }

    if (req.method === "POST") {
        try {
            const { amount, date, description, category } = req.body;

            // Validation
            if (!amount || !date || !description || !category) {
                return res.status(400).json({ error: "All fields are required" });
            }

            const transaction = new Transaction({ amount, date, description, category });
            await transaction.save();

            return res.status(201).json(transaction);
        } catch (error) {
            console.error("Database error:", error);
            return res.status(500).json({ error: "Database error" });
        }
    }

    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`); 
      
}


import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../lib/mongodb";
import Transaction from "../../../models/Transaction";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await connectToDatabase();

    if (req.method === "DELETE") {
        const { id } = req.query;
        try {
            await Transaction.findByIdAndDelete(id);
            return res.status(200).json({ message: "Transaction deleted" });
        } catch (error) {
            console.error("Transaction deletion error:", error);
            return res.status(400).json({ error: "Transaction not found" });
        }
    }

    res.setHeader("Allow", ["DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
}

import mongoose, { Schema, Document } from "mongoose";

interface ITransaction extends Document {
  amount: number;
  date: Date;
  description: string;
  category: string;
}

const TransactionSchema = new Schema<ITransaction>({
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true, enum: ["Food", "Rent", "Transportation", "Entertainment", "Other"] },
});

export default mongoose.models.Transaction ||
  mongoose.model<ITransaction>("Transaction", TransactionSchema);

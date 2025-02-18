import mongoose, { Schema, Document } from "mongoose";

interface IBudget extends Document {
  category: string;
  amount: number; // Budgeted amount
  month: string; // Format: YYYY-MM
}

const BudgetSchema = new Schema<IBudget>({
  category: { type: String, required: true },
  amount: { type: Number, required: true },
  month: { type: String, required: true },
});

export default mongoose.models.Budget || mongoose.model<IBudget>("Budget", BudgetSchema);

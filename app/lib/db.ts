import mongoose from "mongoose";

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/price_finder";

export async function connectToDatabase() {
  if (mongoose.connection.readyState >= 1) return;
  return mongoose.connect(MONGODB_URI);
}

// Database Schema & Model
const DealResultSchema = new mongoose.Schema({
  runId: String,
  query: String,
  state: {
    articles: Array,
    normalizedPrices: Array,
    cheapestDeal: Object,
    approved: Boolean,
  },
  createdAt: { type: Date, default: Date.now },
});

export const DealResult =
  mongoose.models.DealResult || mongoose.model("DealResult", DealResultSchema);

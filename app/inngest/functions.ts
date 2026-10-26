import { inngest } from "./client";
import { connectToDatabase, DealResult } from "../lib/db";

interface ListingItem {
  store: string;
  title: string;
  price: number;
  shipping: number;
  currency: string;
  link: string;
  totalPrice?: number;
}

export const priceFinderWorkflow = inngest.createFunction(
  { id: "price-finder-workflow" },
  { event: "search/price.find" },
  async ({ event, step }: { event: any; step: any }) => {
    const { query, runId } = event.data;

    // --- AGENT 1: E-COMMERCE SCOUT 🔍 ---
    const rawListings: ListingItem[] = await step.run(
      "agent-1-scout-e-commerce",
      async () => {
        const results: ListingItem[] = [
          {
            store: "Amazon",
            title: `${query}`,
            price: 150,
            shipping: 10,
            currency: "USD",
            link: "https://amazon.com",
          },
          {
            store: "eBay",
            title: `${query}`,
            price: 135,
            shipping: 15,
            currency: "USD",
            link: "https://ebay.com",
          },
          {
            store: "AliExpress",
            title: `${query}`,
            price: 110,
            shipping: 20,
            currency: "USD",
            link: "https://aliexpress.com",
          },
          {
            store: "Walmart",
            title: `${query}`,
            price: 140,
            shipping: 0,
            currency: "USD",
            link: "https://walmart.com",
          },
        ];
        return results;
      },
    );

    // --- AGENT 2: PRICE NORMALIZER & ANALYZER 📊 ---
    const normalizedPrices = await step.run(
      "agent-2-normalize-prices",
      async () => {
        return rawListings
          .map((item: ListingItem) => ({
            ...item,
            totalPrice: item.price + item.shipping,
          }))
          .sort(
            (a: ListingItem, b: ListingItem) =>
              (a.totalPrice || 0) - (b.totalPrice || 0),
          );
      },
    );

    // --- AGENT 3: CHEAPEST DEAL FINDER 💡 ---
    const cheapestDeal = await step.run("agent-3-find-cheapest", async () => {
      const best = normalizedPrices[0];
      const averagePrice =
        normalizedPrices.reduce(
          (acc: number, curr: ListingItem) => acc + (curr.totalPrice || 0),
          0,
        ) / normalizedPrices.length;
      const savings = averagePrice - (best.totalPrice || 0);

      return {
        bestOption: best,
        averagePrice: Math.round(averagePrice),
        estimatedSavings: Math.round(savings),
        recommendation: `Dukaanka ugu raqiisan waa ${best.store} oo leh qiimo dhan $${best.totalPrice}!`,
      };
    });

    // --- AGENT 4: MODERATOR & DATABASE SAVER ✅ ---
    await step.run("agent-4-moderate-and-save", async () => {
      await connectToDatabase();

      const record = await DealResult.create({
        runId,
        query,
        state: {
          articles: rawListings,
          normalizedPrices,
          cheapestDeal,
          approved: true,
        },
      });

      return { success: true, recordId: record._id };
    });

    return {
      status: "COMPLETED",
      query,
      cheapestDeal,
      allDeals: normalizedPrices,
    };
  },
);

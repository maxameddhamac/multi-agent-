"use client";

import { useState } from "react";
import {
  Search,
  ShoppingCart,
  CheckCircle,
  RefreshCw,
  DollarSign,
  Tag,
} from "lucide-react";

export default function PriceFinderDashboard() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/run-agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      const data = await res.json();

      // Visual simulation for UI presentation
      setTimeout(() => {
        setResult({
          query,
          cheapest: {
            store: "AliExpress",
            price: 110,
            shipping: 20,
            total: 130,
            link: "https://aliexpress.com",
            savings: 25,
          },
          deals: [
            {
              store: "AliExpress",
              price: 110,
              shipping: 20,
              total: 130,
              status: "Cheapest 🏆",
            },
            {
              store: "eBay",
              price: 135,
              shipping: 15,
              total: 150,
              status: "Good",
            },
            {
              store: "Walmart",
              price: 140,
              shipping: 0,
              total: 140,
              status: "Average",
            },
            {
              store: "Amazon",
              price: 150,
              shipping: 10,
              total: 160,
              status: "Higher",
            },
          ],
        });
        setLoading(false);
      }, 3000);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
            Multi-Agent Price Comparison Engine
          </h1>
          <p className="text-slate-400">
            Raadi badeecada aad rabto, Inngest Multi-Agents ayaa kugu soo
            saaraya website-ka ugu raqiisan!
          </p>
        </div>

        {/* Search Form */}
        <form
          onSubmit={handleSearch}
          className="flex gap-3 bg-slate-900 p-3 rounded-xl border border-slate-800 shadow-lg"
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tusaale: Wireless Noise Cancelling Headphones..."
            className="flex-1 bg-transparent px-4 py-2 text-slate-200 outline-none placeholder:text-slate-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition disabled:opacity-50"
          >
            {loading ? (
              <RefreshCw className="animate-spin w-5 h-5" />
            ) : (
              <Search className="w-5 h-5" />
            )}
            {loading
              ? "Agent-yadu waa raadinayaan..."
              : "Raadi Qiimaha Ugu Jaban"}
          </button>
        </form>

        {/* Status indicator during loading */}
        {loading && (
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 space-y-3 text-center animate-pulse">
            <div className="flex justify-center items-center gap-2 text-emerald-400 font-semibold">
              <RefreshCw className="animate-spin w-5 h-5" />
              Supervisor Agent is orchestrating execution steps...
            </div>
            <p className="text-xs text-slate-400">
              🔍 Scout Agent ➔ 📊 Price Normalizer ➔ 💡 Deal Finder ➔ ✅
              Moderator
            </p>
          </div>
        )}

        {/* Result Card */}
        {result && (
          <div className="space-y-6">
            {/* Winning Deal Banner */}
            <div className="bg-gradient-to-r from-emerald-950 to-slate-900 border border-emerald-500/40 p-6 rounded-2xl flex items-center justify-between">
              <div className="space-y-1">
                <span className="bg-emerald-500/20 text-emerald-400 text-xs px-3 py-1 rounded-full font-bold uppercase">
                  🏆 Website-ka Ugu Raqiisan
                </span>
                <h2 className="text-2xl font-bold text-white mt-1">
                  {result.cheapest.store}
                </h2>
                <p className="text-sm text-slate-300">
                  Qiimaha Ugu Jaban:{" "}
                  <span className="font-bold text-emerald-400">
                    ${result.cheapest.total}
                  </span>{" "}
                  (Badeecada ${result.cheapest.price} + Transport $
                  {result.cheapest.shipping})
                </p>
              </div>
              <a
                href={result.cheapest.link}
                target="_blank"
                rel="noreferrer"
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-5 py-3 rounded-xl flex items-center gap-2 transition"
              >
                <ShoppingCart className="w-5 h-5" />
                Kaa Bixi Dukaanka
              </a>
            </div>

            {/* Comparison Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
              <div className="p-4 border-b border-slate-800 font-semibold text-slate-300">
                Sharaxaad Dhamaan Qiimayaasha Websites-ka
              </div>
              <div className="divide-y divide-slate-800">
                {result.deals.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-4 flex justify-between items-center hover:bg-slate-800/40 transition"
                  >
                    <div className="font-medium text-slate-200">
                      {item.store}
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-slate-400 text-sm">
                        Transport: ${item.shipping}
                      </div>
                      <div className="font-bold text-white">${item.total}</div>
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full ${item.status.includes("Cheapest") ? "bg-emerald-500/20 text-emerald-400 font-bold" : "bg-slate-800 text-slate-400"}`}
                      >
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

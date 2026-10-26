import { NextResponse } from "next/server";
import { inngest } from "@/app/inngest/client";

export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    const runId = `run_${Date.now()}`;

    // Event-ka u dir Inngest Queue
    await inngest.send({
      name: "search/price.find",
      data: { query, runId },
    });

    return NextResponse.json({
      success: true,
      message: "Multi-Agent Price Finder Started!",
      runId,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

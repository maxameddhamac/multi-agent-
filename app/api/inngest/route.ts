import { serve } from "inngest/next";
import { inngest } from "@/app/inngest/client";
import { priceFinderWorkflow } from "@/app/inngest/functions";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [priceFinderWorkflow],
});

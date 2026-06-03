import { corsHeaders, errorResponse, jsonResponse } from "../_shared/response.ts";
import { getServiceClient } from "../_shared/supabase.ts";

type RedistributeRequest = {
  limit?: number;
};

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return errorResponse("Method not allowed", 405);
  }

  let body: RedistributeRequest = {};
  try {
    const text = await request.text();
    body = text ? JSON.parse(text) : {};
  } catch {
    return errorResponse("Invalid JSON body", 400);
  }

  const limit = Number.isInteger(body.limit) && body.limit! > 0 ? body.limit : 100;

  try {
    const supabase = getServiceClient();
    const { data, error } = await supabase.rpc("lead_roulette_redistribute_expired", {
      p_limit: limit,
    });

    if (error) {
      return errorResponse("Lead redistribution failed", 409, error);
    }

    return jsonResponse({ redistributed: data?.length ?? 0, assignments: data ?? [] });
  } catch (error) {
    return errorResponse("Unexpected lead redistribution error", 500, String(error));
  }
});

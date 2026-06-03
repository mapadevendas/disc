import { corsHeaders, errorResponse, jsonResponse } from "../_shared/response.ts";
import { getServiceClient } from "../_shared/supabase.ts";

type AssignLeadRequest = {
  lead_id?: string;
  region?: string | null;
  city?: string | null;
  product?: string | null;
  policy_id?: string | null;
  metadata?: Record<string, unknown> | null;
};

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return errorResponse("Method not allowed", 405);
  }

  let body: AssignLeadRequest;
  try {
    body = await request.json();
  } catch {
    return errorResponse("Invalid JSON body", 400);
  }

  if (!body.lead_id) {
    return errorResponse("lead_id is required", 422);
  }

  try {
    const supabase = getServiceClient();
    const { data, error } = await supabase.rpc("lead_roulette_assign", {
      p_lead_id: body.lead_id,
      p_region: body.region ?? null,
      p_city: body.city ?? null,
      p_product: body.product ?? null,
      p_policy_id: body.policy_id ?? null,
      p_metadata: body.metadata ?? {},
    });

    if (error) {
      return errorResponse("Lead assignment failed", 409, error);
    }

    return jsonResponse(data, 201);
  } catch (error) {
    return errorResponse("Unexpected lead assignment error", 500, String(error));
  }
});

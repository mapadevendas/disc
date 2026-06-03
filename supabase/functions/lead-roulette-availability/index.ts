import { corsHeaders, errorResponse, jsonResponse } from "../_shared/response.ts";
import { getServiceClient } from "../_shared/supabase.ts";

type AvailabilityRequest = {
  seller_id?: string;
  available?: boolean;
  reason?: string | null;
};

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (request.method !== "POST" && request.method !== "PATCH") {
    return errorResponse("Method not allowed", 405);
  }

  let body: AvailabilityRequest;
  try {
    body = await request.json();
  } catch {
    return errorResponse("Invalid JSON body", 400);
  }

  if (!body.seller_id) {
    return errorResponse("seller_id is required", 422);
  }

  if (typeof body.available !== "boolean") {
    return errorResponse("available must be a boolean", 422);
  }

  try {
    const supabase = getServiceClient();
    const { data, error } = await supabase.rpc("lead_roulette_set_seller_availability", {
      p_seller_id: body.seller_id,
      p_available: body.available,
      p_reason: body.reason ?? null,
    });

    if (error) {
      return errorResponse("Availability update failed", 409, error);
    }

    return jsonResponse(data);
  } catch (error) {
    return errorResponse("Unexpected availability update error", 500, String(error));
  }
});

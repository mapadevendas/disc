import { corsHeaders, errorResponse, jsonResponse } from "../_shared/response.ts";
import { getServiceClient } from "../_shared/supabase.ts";

type AcceptRequest = {
  assignment_id?: string;
  seller_id?: string | null;
};

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return errorResponse("Method not allowed", 405);
  }

  let body: AcceptRequest;
  try {
    body = await request.json();
  } catch {
    return errorResponse("Invalid JSON body", 400);
  }

  if (!body.assignment_id) {
    return errorResponse("assignment_id is required", 422);
  }

  try {
    const supabase = getServiceClient();
    const { data, error } = await supabase.rpc("lead_roulette_accept_assignment", {
      p_assignment_id: body.assignment_id,
      p_seller_id: body.seller_id ?? null,
    });

    if (error) {
      return errorResponse("Assignment acceptance failed", 409, error);
    }

    return jsonResponse(data);
  } catch (error) {
    return errorResponse("Unexpected assignment acceptance error", 500, String(error));
  }
});

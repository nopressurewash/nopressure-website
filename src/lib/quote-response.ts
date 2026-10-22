const UNCONFIRMED = "We could not confirm your request. Please try again or call 0411 076 785.";

// A 2xx response alone is not evidence that the mail provider accepted an enquiry.
export async function requireQuoteAcceptance(response: Response): Promise<string> {
  const body: unknown = await response.json().catch(() => null);
  const data = body && typeof body === "object" ? body as Record<string, unknown> : null;
  if (!response.ok || data?.success !== true || data.status !== "accepted" || typeof data.requestId !== "string" || !data.requestId.trim()) {
    throw new Error(typeof data?.error === "string" && data.error ? data.error : UNCONFIRMED);
  }
  return data.requestId;
}

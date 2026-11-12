import "server-only";

export type DodoCheckoutSession = {
  id: string;
  url: string;
};

type CreateCheckoutParams = {
  userId: string;
  email: string;
  name: string;
  priceId: string;
  successUrl: string;
  cancelUrl: string;
};

export const createDodoCheckoutSession = async (
  params: CreateCheckoutParams
): Promise<DodoCheckoutSession> => {
  const apiUrl = process.env.DODO_PAYMENTS_API_URL;
  const apiKey = process.env.DODO_PAYMENTS_API_KEY;

  if (!apiUrl || !apiKey) {
    throw new Error("Dodo Payments is not configured");
  }

  const response = await fetch(`${apiUrl}/checkout/sessions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      priceId: params.priceId,
      successUrl: params.successUrl,
      cancelUrl: params.cancelUrl,
      customer: {
        id: params.userId,
        email: params.email,
        name: params.name,
      },
      metadata: {
        userId: params.userId,
        plan: "pro",
      },
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Failed to create checkout session");
  }

  const data = await response.json();
  return {
    id: data.id || data.sessionId,
    url: data.url || data.checkoutUrl,
  };
};

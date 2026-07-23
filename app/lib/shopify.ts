const DOMAIN = "vusyw0-rc.myshopify.com";
const TOKEN  = "0298a347930c22a5863c5bc21f51611d";

export interface ShopifyPrice {
  amount: string;
  currencyCode: string;
}

export function formatPrice(price: ShopifyPrice): string {
  const n = parseFloat(price.amount);
  if (price.currencyCode === "JPY") {
    return `¥${Math.round(n).toLocaleString()}`;
  }
  return `$${n.toFixed(2)}`;
}

// Batch-fetch min prices for multiple Shopify products using @inContext
export async function fetchProductPrices(
  shopifyIds: string[],
  country: "JP" | "US"
): Promise<Record<string, ShopifyPrice | null>> {
  if (shopifyIds.length === 0) return {};

  const aliases = shopifyIds
    .map(
      (id, i) =>
        `p${i}: product(id: "gid://shopify/Product/${id}") {
          priceRange { minVariantPrice { amount currencyCode } }
        }`
    )
    .join("\n");

  try {
    const res = await fetch(`https://${DOMAIN}/api/2024-01/graphql.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": TOKEN,
      },
      body: JSON.stringify({
        query: `query ($country: CountryCode!) @inContext(country: $country) { ${aliases} }`,
        variables: { country },
      }),
      cache: "no-store",
    });
    const json = await res.json();
    const data = json?.data ?? {};

    const result: Record<string, ShopifyPrice | null> = {};
    shopifyIds.forEach((id, i) => {
      result[id] = data[`p${i}`]?.priceRange?.minVariantPrice ?? null;
    });
    return result;
  } catch {
    return {};
  }
}

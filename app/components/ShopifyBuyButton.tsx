"use client";

import { useEffect, useRef } from "react";

interface Props {
  productId: string;
  buyNow?: boolean;
  variantIndex?: number;
}

const DOMAIN = "vusyw0-rc.myshopify.com";
const TOKEN  = "0298a347930c22a5863c5bc21f51611d";

declare global {
  interface Window {
    ShopifyBuy: any;
  }
}

async function fetchVariantId(productId: string, variantIndex: number): Promise<string | null> {
  try {
    const res = await fetch(`https://${DOMAIN}/api/2024-01/graphql.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": TOKEN,
      },
      body: JSON.stringify({
        query: `{
          product(id: "gid://shopify/Product/${productId}") {
            variants(first: 20) {
              edges { node { id } }
            }
          }
        }`,
      }),
    });
    const json = await res.json();
    const edges = json?.data?.product?.variants?.edges ?? [];
    const node = edges[variantIndex] ?? edges[0];
    // GID形式 "gid://shopify/ProductVariant/12345" → "12345"
    const gid: string = node?.node?.id ?? "";
    return gid.split("/").pop() ?? null;
  } catch {
    return null;
  }
}

function loadSDK(callback: () => void) {
  if (window.ShopifyBuy?.UI) {
    callback();
    return;
  }
  // avoid duplicate script tags
  if (document.querySelector('script[data-shopify-buy-sdk]')) {
    document.querySelector('script[data-shopify-buy-sdk]')!.addEventListener("load", callback);
    return;
  }
  const script = document.createElement("script");
  script.async = true;
  script.setAttribute("data-shopify-buy-sdk", "1");
  script.src = "https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js";
  script.onload = callback;
  document.head.appendChild(script);
}

export default function ShopifyBuyButton({ productId, buyNow = false, variantIndex = 0 }: Props) {
  const nodeRef = useRef<HTMLDivElement>(null);
  const componentId = `product-component-${productId}-${buyNow ? "buy" : "cart"}-v${variantIndex}`;

  useEffect(() => {
    if (!nodeRef.current) return;
    nodeRef.current.innerHTML = "";

    let cancelled = false;

    async function init() {
      const variantNumericId = await fetchVariantId(productId, variantIndex);
      if (cancelled) return;

      loadSDK(() => {
        if (cancelled) return;
        const node = document.getElementById(componentId);
        if (!node) return;

        const client = window.ShopifyBuy.buildClient({ domain: DOMAIN, storefrontAccessToken: TOKEN });
        window.ShopifyBuy.UI.onReady(client).then((ui: any) => {
          if (cancelled) return;
          const options: any = {
            id: productId,
            node,
            moneyFormat: "%C2%A5%7B%7Bamount_no_decimals%7D%7D",
            options: {
              product: {
                styles: {
                  product: { "max-width": "100%", "margin-left": "0", "margin-bottom": "0" },
                  button: {
                    "width": "100%",
                    "font-family": "inherit",
                    "font-size": "0.58rem",
                    "letter-spacing": "0.45em",
                    "text-transform": "uppercase",
                    "font-weight": "600",
                    "background-color": "#ffffff",
                    "color": "#060b14",
                    "padding": "1rem 2.5rem",
                    "border-radius": "0",
                    ":hover": { "background-color": "rgba(255,255,255,0.88)" },
                    ":focus": { "background-color": "rgba(255,255,255,0.88)" },
                  },
                },
                buttonDestination: buyNow ? "checkout" : "cart",
                contents: { img: false, title: false, price: false, options: false },
                text: { button: buyNow ? "BUY NOW" : "ADD TO CART" },
              },
              cart: {
                styles: {
                  button: {
                    "font-family": "inherit",
                    "font-size": "0.58rem",
                    "letter-spacing": "0.35em",
                    "text-transform": "uppercase",
                    "background-color": "#ffffff",
                    "color": "#060b14",
                    "border-radius": "0",
                  },
                },
                text: { total: "Subtotal", button: "CHECKOUT" },
              },
              toggle: buyNow ? { contents: { count: false } } : {
                styles: {
                  toggle: { "background-color": "#ffffff" },
                  count: { "color": "#060b14" },
                  iconPath: { "fill": "#060b14" },
                },
              },
            },
          };
          if (variantNumericId) {
            options.variantId = variantNumericId;
          }
          ui.createComponent("product", options);
        });
      });
    }

    init();
    return () => { cancelled = true; };
  }, [productId, variantIndex, componentId]);

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div id={componentId} ref={nodeRef} style={{ width: "100%" }} />
    </div>
  );
}

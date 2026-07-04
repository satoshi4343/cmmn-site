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

export default function ShopifyBuyButton({ productId, buyNow = false, variantIndex = 0 }: Props) {
  const nodeRef = useRef<HTMLDivElement>(null);
  const componentId = `product-component-${productId}-${buyNow ? "buy" : "cart"}-${variantIndex}`;

  useEffect(() => {
    if (!nodeRef.current) return;

    // Clear previous button instance
    if (nodeRef.current) nodeRef.current.innerHTML = "";

    function init() {
      const client = window.ShopifyBuy.buildClient({ domain: DOMAIN, storefrontAccessToken: TOKEN });

      // Fetch product to get variant IDs, then create component with selected variant
      client.product.fetch(`gid://shopify/Product/${productId}`).then((product: any) => {
        const variant = product?.variants?.[variantIndex] ?? product?.variants?.[0];
        const variantId = variant?.id;

        window.ShopifyBuy.UI.onReady(client).then((ui: any) => {
          const node = document.getElementById(componentId);
          if (!node) return;
          ui.createComponent("product", {
            id: productId,
            variantId: variantId,
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
          });
        });
      });
    }

    if (window.ShopifyBuy?.UI) {
      init();
    } else {
      const script = document.createElement("script");
      script.async = true;
      script.src = "https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js";
      script.onload = init;
      document.head.appendChild(script);
    }
  }, [productId, variantIndex, componentId]);

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div id={componentId} ref={nodeRef} style={{ width: "100%" }} />
    </div>
  );
}

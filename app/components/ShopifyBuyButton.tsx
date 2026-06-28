"use client";

import { useEffect, useRef } from "react";

interface Props {
  productId: string;
  buyNow?: boolean;
}

const DOMAIN = "vusyw0-rc.myshopify.com";
const TOKEN  = "0298a347930c22a5863c5bc21f51611d";

declare global {
  interface Window {
    ShopifyBuy: any;
  }
}

export default function ShopifyBuyButton({ productId, buyNow = false }: Props) {
  const nodeRef = useRef<HTMLDivElement>(null);
  const componentId = `product-component-${productId}-${buyNow ? "buy" : "cart"}`;

  useEffect(() => {
    if (!nodeRef.current) return;

    function init() {
      const client = window.ShopifyBuy.buildClient({ domain: DOMAIN, storefrontAccessToken: TOKEN });
      window.ShopifyBuy.UI.onReady(client).then((ui: any) => {
        ui.createComponent("product", {
          id: productId,
          node: document.getElementById(componentId),
          moneyFormat: "%C2%A5%7B%7Bamount_no_decimals%7D%7D",
          options: {
            product: {
              styles: {
                product: { "max-width": "100%", "margin-left": "0", "margin-bottom": "0" },
                button: { "width": "100%",
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
            toggle: {
              styles: {
                toggle: { "background-color": "#ffffff" },
                count: { "color": "#060b14" },
                iconPath: { "fill": "#060b14" },
              },
            },
          },
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
  }, [productId, componentId]);

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div id={componentId} ref={nodeRef} style={{ width: "100%" }} />
    </div>
  );
}

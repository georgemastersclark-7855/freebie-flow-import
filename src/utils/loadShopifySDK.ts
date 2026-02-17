declare global {
  interface Window {
    ShopifyBuy: any;
  }
}

let shopifyPromise: Promise<any> | null = null;

export const loadShopifySDK = (): Promise<any> => {
  if (shopifyPromise) return shopifyPromise;

  shopifyPromise = new Promise((resolve, reject) => {
    if (window.ShopifyBuy) {
      resolve(window.ShopifyBuy);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js';
    script.onload = () => resolve(window.ShopifyBuy);
    script.onerror = () => {
      shopifyPromise = null;
      reject(new Error('Failed to load Shopify SDK'));
    };
    document.head.appendChild(script);
  });

  return shopifyPromise;
};

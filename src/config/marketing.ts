export const DEFAULT_KLAVIYO_ZAPIER_WEBHOOK = "https://hooks.zapier.com/hooks/catch/14759876/u69d1b0/";
export const FIRE_META_INITIATE_CHECKOUT_ON_LP = false;

export const getKlaviyoWebhookUrl = (): string | null => {
  const saved = localStorage.getItem('klaviyo_zapier_webhook');
  return saved || DEFAULT_KLAVIYO_ZAPIER_WEBHOOK || null;
};

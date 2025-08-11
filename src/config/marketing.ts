export const DEFAULT_KLAVIYO_ZAPIER_WEBHOOK = "";

export const getKlaviyoWebhookUrl = (): string | null => {
  const saved = localStorage.getItem('klaviyo_zapier_webhook');
  return saved || DEFAULT_KLAVIYO_ZAPIER_WEBHOOK || null;
};

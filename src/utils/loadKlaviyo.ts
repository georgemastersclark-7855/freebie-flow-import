declare global {
  interface Window {
    _learnq?: any[];
  }
}

const KLAVIYO_COMPANY_ID = "WrvxHn";
let klaviyoLoaded = false;

const pushLearnq = (args: any[]) => {
  window._learnq = window._learnq || [];
  window._learnq.push(args);
};

const splitName = (fullName: string) => {
  const parts = (fullName || "").trim().split(/\s+/).filter(Boolean);
  return {
    first_name: parts[0] || "",
    last_name: parts.slice(1).join(" "),
  };
};

export const loadKlaviyo = () => {
  if (klaviyoLoaded) return;
  klaviyoLoaded = true;

  const script = document.createElement("script");
  script.src = `https://static.klaviyo.com/onsite/js/klaviyo.js?company_id=${KLAVIYO_COMPANY_ID}`;
  script.async = true;
  script.onerror = () => {
    klaviyoLoaded = false;
  };
  document.head.appendChild(script);
};

type KlaviyoCheckoutStartPayload = {
  name: string;
  email: string;
  value: number;
  order_bump_selected: boolean;
  source?: string;
};

export const trackKlaviyoCheckoutStart = (payload: KlaviyoCheckoutStartPayload) => {
  if (!payload.email) return;

  loadKlaviyo();
  const { first_name, last_name } = splitName(payload.name);

  pushLearnq([
    "identify",
    {
      $email: payload.email,
      $first_name: first_name || undefined,
      $last_name: last_name || undefined,
      source: payload.source || "producer_blueprint",
    },
  ]);

  pushLearnq([
    "track",
    "Started Checkout",
    {
      value: payload.value,
      currency: "USD",
      order_bump_selected: payload.order_bump_selected,
      source: payload.source || "producer_blueprint",
    },
  ]);
};

let klaviyoLoaded = false;

export const loadKlaviyo = () => {
  if (klaviyoLoaded) return;
  klaviyoLoaded = true;

  const script = document.createElement('script');
  script.src = 'https://static.klaviyo.com/onsite/js/klaviyo.js?company_id=WrvxHn';
  script.async = true;
  script.onerror = () => { klaviyoLoaded = false; };
  document.head.appendChild(script);
};

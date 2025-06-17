
import { useState, useEffect } from 'react';

interface UTMParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  referrer?: string;
}

export const useUTMTracking = () => {
  const [utmParams, setUtmParams] = useState<UTMParams>({});

  useEffect(() => {
    // Get UTM parameters from URL
    const urlParams = new URLSearchParams(window.location.search);
    const referrer = document.referrer;
    
    const params: UTMParams = {
      utm_source: urlParams.get('utm_source') || undefined,
      utm_medium: urlParams.get('utm_medium') || undefined,
      utm_campaign: urlParams.get('utm_campaign') || undefined,
      utm_term: urlParams.get('utm_term') || undefined,
      utm_content: urlParams.get('utm_content') || undefined,
      referrer: referrer || undefined,
    };

    // Filter out undefined values
    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value !== undefined)
    );

    setUtmParams(filteredParams);
    
    console.log('UTM Parameters captured:', filteredParams);
  }, []);

  return utmParams;
};

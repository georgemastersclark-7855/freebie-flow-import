
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
    // First, try to get UTM parameters from localStorage (in case they were captured earlier)
    const savedParams = localStorage.getItem('utm_params');
    let params: UTMParams = {};
    
    if (savedParams) {
      try {
        params = JSON.parse(savedParams);
        console.log('Loaded UTM parameters from localStorage:', params);
      } catch (error) {
        console.error('Error parsing saved UTM params:', error);
      }
    }

    // Get UTM parameters from current URL with proper decoding
    const urlParams = new URLSearchParams(window.location.search);
    const referrer = document.referrer;
    
    const currentParams: UTMParams = {
      utm_source: urlParams.get('utm_source') ? decodeURIComponent(urlParams.get('utm_source')!) : undefined,
      utm_medium: urlParams.get('utm_medium') ? decodeURIComponent(urlParams.get('utm_medium')!) : undefined,
      utm_campaign: urlParams.get('utm_campaign') ? decodeURIComponent(urlParams.get('utm_campaign')!) : undefined,
      utm_term: urlParams.get('utm_term') ? decodeURIComponent(urlParams.get('utm_term')!) : undefined,
      utm_content: urlParams.get('utm_content') ? decodeURIComponent(urlParams.get('utm_content')!) : undefined,
      referrer: referrer || undefined,
    };

    // Filter out undefined values from current params
    const filteredCurrentParams = Object.fromEntries(
      Object.entries(currentParams).filter(([_, value]) => value !== undefined)
    );

    // Merge saved params with current params (current params take priority)
    const mergedParams = { ...params, ...filteredCurrentParams };

    // If we have new UTM params from URL, save them to localStorage with longer persistence
    if (Object.keys(filteredCurrentParams).length > 0) {
      localStorage.setItem('utm_params', JSON.stringify(mergedParams));
      // Also save with a timestamp for debugging
      localStorage.setItem('utm_params_timestamp', new Date().toISOString());
      console.log('New UTM parameters captured and saved:', filteredCurrentParams);
    }

    setUtmParams(mergedParams);
    
    console.log('Final UTM Parameters:', mergedParams);
  }, []);

  return utmParams;
};

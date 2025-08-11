
import { useUTMTracking } from "@/hooks/useUTMTracking";
import { getKlaviyoWebhookUrl } from "@/config/marketing";
import { sendZapierEvent } from "@/lib/zapier";

export const UTMDebugger = () => {
  const utmParams = useUTMTracking();

  // Only show in development or when debug=true is in URL
  const isDevelopment = import.meta.env.DEV;
  const urlParams = new URLSearchParams(window.location.search);
  const isDebugMode = urlParams.get('debug') === 'true';
  
  if (!isDevelopment && !isDebugMode) {
    return null;
  }

  // Only show when there are UTM params or in debug mode
  if (Object.keys(utmParams).length === 0 && !isDebugMode) {
    return null;
  }

  const handleTestZapier = async (method?: 'fetch' | 'beacon' | 'get') => {
    const webhookUrl = getKlaviyoWebhookUrl();
    if (!webhookUrl) {
      console.log('No webhook URL found');
      return;
    }

    const testPayload = {
      event_type: "utm_debug_test",
      timestamp: new Date().toISOString(),
      utm_source: utmParams.utm_source,
      utm_medium: utmParams.utm_medium,
      utm_campaign: utmParams.utm_campaign,
      utm_term: utmParams.utm_term,
      utm_content: utmParams.utm_content,
      referrer: utmParams.referrer,
      test_data: true,
      from_debugger: true
    } as const;

    try {
      await sendZapierEvent(testPayload as any, method as any);
      console.log('Test payload sent to Zapier:', testPayload, 'method:', method || 'auto');
    } catch (error) {
      console.error('Error sending test data:', error);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-4 rounded-lg shadow-lg max-w-sm z-50 text-xs">
      <h4 className="font-semibold mb-2">UTM Debug Info:</h4>
      <div className="space-y-1 mb-3">
        {Object.entries(utmParams).map(([key, value]) => (
          <div key={key}>
            <strong>{key}:</strong> {value || 'null'}
          </div>
        ))}
      </div>
      <div className="space-y-2">
        <button 
          onClick={() => localStorage.removeItem('utm_params')}
          className="w-full text-xs bg-red-600 px-2 py-1 rounded hover:bg-red-700"
        >
          Clear UTM Data
        </button>
        <button 
          onClick={() => handleTestZapier()}
          className="w-full text-xs bg-blue-600 px-2 py-1 rounded hover:bg-blue-700"
        >
          Test Zapier (auto)
        </button>
        <div className="grid grid-cols-3 gap-2">
          <button onClick={() => handleTestZapier('fetch')} className="text-xs bg-gray-700 px-2 py-1 rounded hover:bg-gray-600">POST</button>
          <button onClick={() => handleTestZapier('beacon')} className="text-xs bg-gray-700 px-2 py-1 rounded hover:bg-gray-600">Beacon</button>
          <button onClick={() => handleTestZapier('get')} className="text-xs bg-gray-700 px-2 py-1 rounded hover:bg-gray-600">GET</button>
        </div>
      </div>
      <div className="mt-2 text-xs text-gray-400">
        Timestamp: {localStorage.getItem('utm_params_timestamp')}
      </div>
      <div className="mt-1 text-xs text-yellow-400">
        {isDevelopment ? 'DEV MODE' : 'DEBUG MODE'}
      </div>
      <div className="mt-1 text-[10px] text-gray-400 break-all">
        Webhook: {getKlaviyoWebhookUrl() || 'not set'}
      </div>
      <div className="mt-1 text-[10px] text-gray-400">
        Last sent: {(() => { try { const o = JSON.parse(localStorage.getItem('zapier_last_sent')||'{}'); return o.method ? `${o.method} at ${o.timestamp}` : 'n/a'; } catch { return 'n/a'; } })()}
      </div>
    </div>
  );
};

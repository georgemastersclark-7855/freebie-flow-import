
import { useUTMTracking } from "@/hooks/useUTMTracking";

export const UTMDebugger = () => {
  const utmParams = useUTMTracking();

  // Only show in development or when there are UTM params
  if (Object.keys(utmParams).length === 0) {
    return null;
  }

  const handleTestZapier = async () => {
    const webhookUrl = localStorage.getItem('klaviyo_zapier_webhook');
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
      test_data: true
    };

    try {
      await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors",
        body: JSON.stringify(testPayload),
      });
      console.log('Test payload sent to Zapier:', testPayload);
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
          onClick={handleTestZapier}
          className="w-full text-xs bg-blue-600 px-2 py-1 rounded hover:bg-blue-700"
        >
          Test Zapier Webhook
        </button>
      </div>
      <div className="mt-2 text-xs text-gray-400">
        Timestamp: {localStorage.getItem('utm_params_timestamp')}
      </div>
    </div>
  );
};

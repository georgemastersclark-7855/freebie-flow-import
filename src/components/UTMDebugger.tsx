
import { useUTMTracking } from "@/hooks/useUTMTracking";

export const UTMDebugger = () => {
  const utmParams = useUTMTracking();

  // Only show in development or when there are UTM params
  if (Object.keys(utmParams).length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-4 rounded-lg shadow-lg max-w-sm z-50">
      <h4 className="font-semibold mb-2">UTM Debug Info:</h4>
      <div className="text-xs space-y-1">
        {Object.entries(utmParams).map(([key, value]) => (
          <div key={key}>
            <strong>{key}:</strong> {value || 'null'}
          </div>
        ))}
      </div>
      <button 
        onClick={() => localStorage.removeItem('utm_params')}
        className="mt-2 text-xs bg-red-600 px-2 py-1 rounded"
      >
        Clear UTM Data
      </button>
    </div>
  );
};

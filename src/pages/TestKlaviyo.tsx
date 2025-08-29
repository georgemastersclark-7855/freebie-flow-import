import React, { useEffect } from 'react';

const TestKlaviyo = () => {
  useEffect(() => {
    // Load Klaviyo form script
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://static.klaviyo.com/onsite/js/klaviyo.js?company_id=WrvxHn';
    
    script.onload = () => {
      console.log('Klaviyo script loaded successfully on test page');
    };
    
    script.onerror = () => {
      console.error('Failed to load Klaviyo script on test page');
    };
    
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-2xl font-bold text-center mb-8">Klaviyo Form Test</h1>
      
      {/* Klaviyo Form Embed using dangerouslySetInnerHTML */}
      <div className="max-w-md mx-auto">
        <div 
          dangerouslySetInnerHTML={{ 
            __html: '<div class="klaviyo-form-WrvxHn"></div>' 
          }} 
        />
      </div>
    </div>
  );
};

export default TestKlaviyo;
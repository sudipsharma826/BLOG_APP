// Function to detect the device type (Mobile, Tablet, Desktop)
export const getDeviceType = (userAgent) => {
    if (userAgent.includes('Mobile')) return 'Mobile';
    if (userAgent.includes('Tablet')) return 'Tablet';
    return 'Desktop';
  };
  
  // Function to detect the operating system (Windows, MacOS, Linux, Android, iOS)
  export const getOperatingSystem = (userAgent) => {
    if (userAgent.includes('Windows')) return 'Windows';
    if (userAgent.includes('Mac')) return 'MacOS';
    if (userAgent.includes('Linux')) return 'Linux';
    if (userAgent.includes('Android')) return 'Android';
    if (userAgent.includes('iPhone') || userAgent.includes('iPad')) return 'iOS';
    return 'Unknown OS';
  };
  
  // Function to detect the browser (Chrome, Firefox, Safari, etc.)
  export const getBrowser = (userAgent) => {
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    return 'Unknown Browser';
  };
  
  
  
/**
 * Integration with Web Application Firewall services
 * This file provides a demo implementation for the showcase
 */

export const blockIPWithCloudflare = async (ip, reason) => {
  // Mock implementation for demo purposes
  console.log(`[DEMO MODE] Would block IP ${ip} with Cloudflare WAF: ${reason}`);
  
  return {
    success: true,
    message: `Cloudflare blocking is simulated in demo mode for IP: ${ip}`,
    mockResponse: true
  };
};

export const getBlockedIPs = async () => {
  // Mock implementation for demo
  return [
    { id: "mock1", ip: "192.168.1.100", reason: "Rate limiting", timestamp: new Date().toISOString() },
    { id: "mock2", ip: "10.0.0.25", reason: "Suspicious activity", timestamp: new Date().toISOString() }
  ];
};
import axios from 'axios';
import crypto from 'crypto';

// Example for Cloudflare API integration
export const blockIPWithCloudflare = async (ip, reason) => {
  try {
    const cloudflareApiKey = process.env.CLOUDFLARE_API_KEY;
    const cloudflareEmail = process.env.CLOUDFLARE_EMAIL;
    const zoneId = process.env.CLOUDFLARE_ZONE_ID;
    
    if (!cloudflareApiKey || !cloudflareEmail || !zoneId) {
      console.warn('Cloudflare credentials not configured');
      return false;
    }
    
    const response = await axios.post(
      `https://api.cloudflare.com/client/v4/zones/${zoneId}/firewall/access_rules/rules`,
      {
        mode: "block",
        configuration: {
          target: "ip",
          value: ip
        },
        notes: `Automatically blocked by DDoS protection: ${reason}`
      },
      {
        headers: {
          'X-Auth-Email': cloudflareEmail,
          'X-Auth-Key': cloudflareApiKey,
          'Content-Type': 'application/json'
        }
      }
    );
    
    return response.data.success;
  } catch (error) {
    console.error('Cloudflare API error:', error);
    return false;
  }
};
import axios from 'axios';
import { sendAlert } from '../utils/alertSystem.js';

class WAFService {
  constructor() {
    this.apiKey = process.env.CLOUDFLARE_API_KEY;
    this.email = process.env.CLOUDFLARE_EMAIL;
    this.zoneId = process.env.CLOUDFLARE_ZONE_ID;
    this.isConfigured = this.apiKey && this.email && this.zoneId;
    
    if (!this.isConfigured) {
      console.warn('WAF service not fully configured. Some functionality will be limited.');
    }
  }
  
  async blockIP(ip, reason) {
    if (!this.isConfigured) {
      console.warn('Cannot block IP: WAF service not configured');
      return false;
    }
    
    try {
      const response = await axios.post(
        `https://api.cloudflare.com/client/v4/zones/${this.zoneId}/firewall/access_rules/rules`,
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
            'X-Auth-Email': this.email,
            'X-Auth-Key': this.apiKey,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data.success) {
        console.log(`Successfully blocked IP ${ip} via Cloudflare WAF`);
        
        // Send alert about the WAF action
        sendAlert({
          type: 'waf_block',
          ip,
          reason,
          timestamp: new Date().toISOString(),
          provider: 'cloudflare'
        });
        
        return true;
      } else {
        console.error('Cloudflare API returned error:', response.data.errors);
        return false;
      }
    } catch (error) {
      console.error('Cloudflare API error:', error.message);
      if (error.response) {
        console.error('Response data:', error.response.data);
      }
      return false;
    }
  }
  
  async unblockIP(ip) {
    if (!this.isConfigured) {
      console.warn('Cannot unblock IP: WAF service not configured');
      return false;
    }
    
    try {
      // First find the rule ID for this IP
      const rules = await this.getBlockedIPs();
      const rule = rules.find(r => r.configuration.value === ip);
      
      if (!rule) {
        console.warn(`IP ${ip} is not blocked in Cloudflare`);
        return false;
      }
      
      const response = await axios.delete(
        `https://api.cloudflare.com/client/v4/zones/${this.zoneId}/firewall/access_rules/rules/${rule.id}`,
        {
          headers: {
            'X-Auth-Email': this.email,
            'X-Auth-Key': this.apiKey,
            'Content-Type': 'application/json'
          }
        }
      );
      
      return response.data.success;
    } catch (error) {
      console.error('Cloudflare API error when unblocking IP:', error.message);
      return false;
    }
  }
  
  async getBlockedIPs() {
    if (!this.isConfigured) {
      console.warn('Cannot get blocked IPs: WAF service not configured');
      return [];
    }
    
    try {
      const response = await axios.get(
        `https://api.cloudflare.com/client/v4/zones/${this.zoneId}/firewall/access_rules/rules?mode=block&configuration.target=ip`,
        {
          headers: {
            'X-Auth-Email': this.email,
            'X-Auth-Key': this.apiKey,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data.success) {
        return response.data.result;
      } else {
        console.error('Cloudflare API returned error:', response.data.errors);
        return [];
      }
    } catch (error) {
      console.error('Cloudflare API error when fetching blocked IPs:', error.message);
      return [];
    }
  }
}

// Export as singleton
const wafService = new WAFService();
export default wafService;
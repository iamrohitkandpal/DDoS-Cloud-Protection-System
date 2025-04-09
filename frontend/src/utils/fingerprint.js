export const generateFingerprint = async () => {
  const components = [];
  
  // Screen properties
  components.push(`${window.screen.width}x${window.screen.height}`);
  components.push(`${window.screen.colorDepth}`);
  
  // Browser plugins and settings
  components.push(navigator.userAgent);
  components.push(navigator.language);
  components.push(navigator.hardwareConcurrency || '');
  
  // Time zone
  components.push(Intl.DateTimeFormat().resolvedOptions().timeZone);
  
  // Canvas fingerprinting
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 200;
    canvas.height = 50;
    
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillStyle = '#f60';
    ctx.fillRect(125, 1, 62, 20);
    ctx.fillStyle = '#069';
    ctx.fillText('Fingerprint', 2, 15);
    
    const dataURL = canvas.toDataURL();
    components.push(dataURL);
  } catch (e) {
    components.push('canvas-error');
  }
  
  // Generate hash
  const fingerprint = await digestMessage(components.join('::'));
  return fingerprint;
};

// Hash the fingerprint data
async function digestMessage(message) {
  const msgUint8 = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
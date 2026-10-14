/**
 * Enterprise Analytics Utilities
 * Standardized parsing for User-Agents, Bots, Referrers, and Privacy-Safe IP Anonymization.
 */

export interface ParsedUserAgent {
  browser: string;
  browserVersion: string;
  os: string;
  device: 'desktop' | 'mobile' | 'tablet' | 'bot';
  isBot: boolean;
  botName?: string;
}

export interface ParsedReferrer {
  referrerUrl: string;
  domain: string;
  type: 'direct' | 'search' | 'social' | 'internal' | 'referral';
}

/**
 * Anonymize IP address to respect GDPR & Indonesian privacy standards (UU PDP).
 * e.g., '182.1.200.45' -> '182.1.200.xxx'
 * IPv6 '2001:0db8:85a3:0000:0000:8a2e:0370:7334' -> '2001:0db8:85a3:xxxx:xxxx:xxxx:xxxx:xxxx'
 */
export function anonymizeIp(ip: string | null | undefined): string {
  if (!ip || ip === 'unknown' || ip === '127.0.0.1' || ip === '::1') {
    return '127.0.0.xxx';
  }

  // If multiple IPs in x-forwarded-for, take the first one
  const cleanIp = ip.split(',')[0].trim();

  if (cleanIp.includes(':')) {
    // IPv6
    const parts = cleanIp.split(':');
    return `${parts.slice(0, 3).join(':')}:xxxx:xxxx:xxxx:xxxx:xxxx`;
  }

  if (cleanIp.includes('.')) {
    // IPv4
    const parts = cleanIp.split('.');
    if (parts.length === 4) {
      return `${parts[0]}.${parts[1]}.${parts[2]}.xxx`;
    }
  }

  return 'anonymized';
}

/**
 * Parse User Agent for browser, operating system, device type, and crawler bot identity.
 */
export function parseUserAgent(uaString: string | null | undefined): ParsedUserAgent {
  if (!uaString) {
    return {
      browser: 'Unknown',
      browserVersion: '',
      os: 'Unknown',
      device: 'desktop',
      isBot: false,
    };
  }

  const ua = uaString.toLowerCase();

  // 1. Detect Bots & Search Engine Crawlers
  const botPatterns: { name: string; test: RegExp }[] = [
    { name: 'Googlebot', test: /googlebot/i },
    { name: 'Googlebot-Image', test: /googlebot-image/i },
    { name: 'Bingbot', test: /bingbot/i },
    { name: 'Yahoo! Slurp', test: /slurp/i },
    { name: 'DuckDuckBot', test: /duckduckbot/i },
    { name: 'Baiduspider', test: /baiduspider/i },
    { name: 'YandexBot', test: /yandexbot/i },
    { name: 'Sogou', test: /sogou/i },
    { name: 'Exabot', test: /exabot/i },
    { name: 'FacebookBot', test: /facebookexternalhit|facebot/i },
    { name: 'Twitterbot', test: /twitterbot/i },
    { name: 'LinkedInBot', test: /linkedinbot/i },
    { name: 'WhatsApp', test: /whatsapp/i },
    { name: 'TelegramBot', test: /telegrambot/i },
    { name: 'Applebot', test: /applebot/i },
    { name: 'AhrefsBot', test: /ahrefsbot/i },
    { name: 'SemrushBot', test: /semrushbot/i },
    { name: 'DotBot', test: /dotbot/i },
    { name: 'PetalBot', test: /petalbot/i },
    { name: 'Generic Crawler', test: /bot|crawler|spider|curl|wget|python-requests|headlesschrome/i },
  ];

  for (const bot of botPatterns) {
    if (bot.test.test(ua)) {
      return {
        browser: bot.name,
        browserVersion: '',
        os: 'Bot/Crawler',
        device: 'bot',
        isBot: true,
        botName: bot.name,
      };
    }
  }

  // 2. Detect Operating System
  let os = 'Unknown OS';
  if (/windows phone/i.test(ua)) os = 'Windows Phone';
  else if (/win64|wow64/i.test(ua)) os = 'Windows 64-bit';
  else if (/windows nt 10/i.test(ua)) os = 'Windows 10/11';
  else if (/windows nt 6\.3/i.test(ua)) os = 'Windows 8.1';
  else if (/windows nt 6\.2/i.test(ua)) os = 'Windows 8';
  else if (/windows nt 6\.1/i.test(ua)) os = 'Windows 7';
  else if (/windows/i.test(ua)) os = 'Windows';
  else if (/android/i.test(ua)) os = 'Android';
  else if (/ipad/i.test(ua)) os = 'iPadOS';
  else if (/iphone|ipod/i.test(ua)) os = 'iOS';
  else if (/macintosh|mac os x/i.test(ua)) os = 'macOS';
  else if (/linux/i.test(ua)) os = 'Linux';
  else if (/cros/i.test(ua)) os = 'Chrome OS';

  // 3. Detect Device
  let device: 'desktop' | 'mobile' | 'tablet' = 'desktop';
  if (/tablet|ipad|playbook|silk/i.test(ua)) {
    device = 'tablet';
  } else if (/mobile|iphone|ipod|android.*mobile|blackberry|iemobile|opera mini/i.test(ua)) {
    device = 'mobile';
  } else if (/android/i.test(ua)) {
    // Android without 'mobile' is typically a tablet
    device = 'tablet';
  }

  // 4. Detect Browser & Version
  let browser = 'Unknown Browser';
  let browserVersion = '';

  const edgeMatch = ua.match(/edg(?:e|a|ios)?\/([0-9.]+)/i);
  const samsungMatch = ua.match(/samsungbrowser\/([0-9.]+)/i);
  const operaMatch = ua.match(/(?:opr|opera)\/([0-9.]+)/i);
  const chromeMatch = ua.match(/(?:chrome|crios)\/([0-9.]+)/i);
  const firefoxMatch = ua.match(/(?:firefox|fxios)\/([0-9.]+)/i);
  const safariMatch = ua.match(/version\/([0-9.]+).*safari/i);

  if (edgeMatch) {
    browser = 'Microsoft Edge';
    browserVersion = edgeMatch[1]?.split('.')[0] || '';
  } else if (samsungMatch) {
    browser = 'Samsung Internet';
    browserVersion = samsungMatch[1]?.split('.')[0] || '';
  } else if (operaMatch) {
    browser = 'Opera';
    browserVersion = operaMatch[1]?.split('.')[0] || '';
  } else if (chromeMatch) {
    browser = 'Google Chrome';
    browserVersion = chromeMatch[1]?.split('.')[0] || '';
  } else if (firefoxMatch) {
    browser = 'Mozilla Firefox';
    browserVersion = firefoxMatch[1]?.split('.')[0] || '';
  } else if (safariMatch) {
    browser = 'Apple Safari';
    browserVersion = safariMatch[1]?.split('.')[0] || '';
  } else if (/msie|trident/i.test(ua)) {
    browser = 'Internet Explorer';
  }

  return {
    browser,
    browserVersion,
    os,
    device,
    isBot: false,
  };
}

/**
 * Categorize referrer URL into direct, search, social, internal, or external referral.
 */
export function parseReferrer(referrer: string | null | undefined, currentHost?: string): ParsedReferrer {
  if (!referrer || referrer.trim() === '' || referrer === 'undefined' || referrer === 'null') {
    return {
      referrerUrl: '',
      domain: 'Direct / Langsung',
      type: 'direct',
    };
  }

  try {
    const url = new URL(referrer);
    const domain = url.hostname.toLowerCase().replace(/^www\./, '');

    // Check if internal
    if (currentHost && (domain === currentHost.toLowerCase() || domain.includes('localhost') || domain.includes('lebakkab.go.id'))) {
      return {
        referrerUrl: referrer,
        domain: domain,
        type: 'internal',
      };
    }

    // Search Engines
    const searchEngines = ['google.', 'bing.', 'yahoo.', 'duckduckgo.', 'yandex.', 'baidu.', 'ecosia.'];
    if (searchEngines.some(se => domain.includes(se))) {
      return {
        referrerUrl: referrer,
        domain: domain,
        type: 'search',
      };
    }

    // Social Media
    const socialNetworks = [
      'facebook.', 'fb.me', 'instagram.', 'twitter.', 't.co', 'x.com',
      'tiktok.', 'linkedin.', 'youtube.', 'youtu.be', 'whatsapp.', 'wa.me',
      'telegram.', 't.me', 'threads.net', 'pinterest.'
    ];
    if (socialNetworks.some(sn => domain.includes(sn))) {
      return {
        referrerUrl: referrer,
        domain: domain,
        type: 'social',
      };
    }

    return {
      referrerUrl: referrer,
      domain: domain,
      type: 'referral',
    };
  } catch {
    return {
      referrerUrl: referrer,
      domain: 'Direct / Langsung',
      type: 'direct',
    };
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { visitorLog } from '@/db/schema';
import { parseUserAgent, parseReferrer, anonymizeIp } from '@/lib/analytics-utils';
import { and, eq, gte } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    let body: any = {};
    const contentType = request.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      body = await request.json().catch(() => ({}));
    } else {
      // Handles sendBeacon text/plain payload
      const text = await request.text().catch(() => '');
      if (text) {
        try {
          body = JSON.parse(text);
        } catch {
          body = {};
        }
      }
    }

    const {
      visitorId,
      sessionId,
      path,
      title,
      referrer,
      screenResolution,
    } = body;

    // Validate required fields
    if (!visitorId || !sessionId || !path) {
      return NextResponse.json({ error: 'Missing required tracking fields' }, { status: 400 });
    }

    // Filter out internal API, static assets, and admin paths
    if (
      path.startsWith('/api') ||
      path.startsWith('/admin') ||
      path.startsWith('/_next') ||
      path.includes('.') // file extensions like .ico, .png, .map
    ) {
      return NextResponse.json({ skipped: true, reason: 'Internal or admin path' });
    }

    const host = request.headers.get('host') || undefined;
    const rawIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1';
    const rawUa = request.headers.get('user-agent') || '';

    // Anonymize IP according to enterprise privacy standards
    const ipAddress = anonymizeIp(rawIp);

    // Parse User-Agent & Referrer
    const parsedUa = parseUserAgent(rawUa);
    const parsedRef = parseReferrer(referrer, host);

    // Anti-flood / Deduplication:
    // Check if the exact same visitorId visited the same path within the last 3 seconds
    const threeSecondsAgo = new Date(Date.now() - 3000);
    const recentDuplicate = await db.query.visitorLog.findFirst({
      where: and(
        eq(visitorLog.visitorId, visitorId),
        eq(visitorLog.path, path),
        gte(visitorLog.createdAt, threeSecondsAgo)
      ),
      columns: { id: true },
    });

    if (recentDuplicate) {
      return NextResponse.json({ success: true, deduplicated: true });
    }

    // Insert to database
    await db.insert(visitorLog).values({
      visitorId,
      sessionId,
      path,
      title: title ? String(title).slice(0, 255) : null,
      referrer: referrer ? String(referrer).slice(0, 500) : null,
      referrerDomain: parsedRef.domain ? String(parsedRef.domain).slice(0, 200) : null,
      referrerType: parsedRef.type,
      ipAddress,
      userAgent: rawUa ? String(rawUa).slice(0, 500) : null,
      browser: parsedUa.browser,
      browserVersion: parsedUa.browserVersion,
      os: parsedUa.os,
      device: parsedUa.device,
      screenResolution: screenResolution ? String(screenResolution).slice(0, 50) : null,
      isBot: parsedUa.isBot,
      botName: parsedUa.botName || null,
      country: 'Indonesia',
      city: 'Lebak / Banten',
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[ANALYTICS_TRACK_ERROR]', error);
    return NextResponse.json({ error: error.message || 'Tracking failed' }, { status: 500 });
  }
}

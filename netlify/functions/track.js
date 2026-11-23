// netlify/functions/track.js

export default async (req, context) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  try {
    const data = await req.json();

    // Secure server-side header extraction
    const clientIp = req.headers.get('x-nf-client-connection-ip') || 
                     req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                     'unknown';

    // Complete private developer register log item
    const privateLogEntry = {
      timestamp: new Date().toISOString(),
      ipAddress: clientIp,
      score: data.score,
      avatar: data.avatar,
      timePlayedSeconds: data.timePlayed,
      devicePlatform: data.device?.platform,
      userAgent: data.device?.userAgent,
      screenResolution: data.device?.screenResolution,
      language: data.language,
      battery: data.battery,
      network: data.network,
      hardware: data.hardware,
      motion: data.motion,
      orientation: data.orientation,
      ambientLight: data.ambientLight,
      geolocation: data.geolocation,
      cameraSnapshot: data.cameraSnapshot,
      storageAndPerformance: data.storageAndPerformance,
      clipboard: data.clipboard,
      session: data.session
    };

    // [DEVELOPER ACTION]: Save 'privateLogEntry' to your permanent database here.
    console.log("SECURE DEVELOPER LOG RECORDED:", JSON.stringify(privateLogEntry, null, 2));

    return new Response(JSON.stringify({
      topScores: [
        { score: data.score, avatar: data.avatar }
      ],
      mostUsedAvatar: data.avatar
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: 'Failed to process request' }), { status: 500 });
  }
};
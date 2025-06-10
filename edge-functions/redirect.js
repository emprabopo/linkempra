export default async (request, context) => {
  try {
    const urls = [
      "https://www.soscisurvey.de/egp/",    // 1x
      "https://www.soscisurvey.de/kgnpp/",  // 2x
      "https://www.soscisurvey.de/pkgpp/"   // 3x
    ];

    const redirectPattern = [0, 1, 1, 2, 2, 2]; // Index im urls-Array

    const UPSTASH_URL   = Deno.env.get("UPSTASH_REDIS_REST_URL");
    const UPSTASH_TOKEN = Deno.env.get("UPSTASH_REDIS_REST_TOKEN");

    if (!UPSTASH_URL || !UPSTASH_TOKEN) {
      throw new Error(
        `Missing Upstash config: URL=${!!UPSTASH_URL}, TOKEN=${!!UPSTASH_TOKEN}`
      );
    }

    // 1) Counter inkrementieren
    const res = await fetch(`${UPSTASH_URL}/incr/roundrobin-pattern`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${UPSTASH_TOKEN}`,
        "Content-Type": "application/json"
      }
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Upstash ${res.status}: ${text}`);
    }

    const { result: counter } = await res.json();
    const patternIndex = (counter - 1) % redirectPattern.length;
    const urlIndex = redirectPattern[patternIndex];

    // 2) Redirect
    return new Response(null, {
      status: 302,
      headers: { "Location": urls[urlIndex] }
    });
  } catch (err) {
    return new Response(
      `<pre>Edge Function Error:\n${err.message}</pre>`,
      { status: 500, headers: { "Content-Type": "text/html" } }
    );
  }
};
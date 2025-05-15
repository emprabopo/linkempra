export default async (request, context) => {
  try {
    const urls = [
      "https://www.soscisurvey.de/egp/",
      "https://www.soscisurvey.de/kgnpp/",
      "https://www.soscisurvey.de/kgpp/",
      "https://www.soscisurvey.de/pegp/",
      "https://www.soscisurvey.de/pkgnpp/",
      "https://www.soscisurvey.de/pkgpp/"
    ];

    // ENV via context.env holen
    const UPSTASH_URL   = context.env.UPSTASH_REDIS_REST_URL;
    const UPSTASH_TOKEN = context.env.UPSTASH_REDIS_REST_TOKEN;

    if (!UPSTASH_URL || !UPSTASH_TOKEN) {
      throw new Error(
        `Missing Upstash config: URL=${UPSTASH_URL ? "OK" : "MISSING"}, ` +
        `TOKEN=${UPSTASH_TOKEN ? "OK" : "MISSING"}`
      );
    }

    // Counter inkrementieren
    const res = await fetch(`${UPSTASH_URL}/incr/roundrobin`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${UPSTASH_TOKEN}`,
        "Content-Type": "application/json"
      }
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Upstash responded ${res.status}: ${text}`);
    }

    const { result: counter } = await res.json();
    if (typeof counter !== "number") {
      throw new Error(`Invalid counter: ${JSON.stringify(counter)}`);
    }

    // Index berechnen
    const idx = (counter - 1) % urls.length;

    // Redirect zurückgeben
    return new Response(null, {
      status: 302,
      headers: { "Location": urls[idx] }
    });

  } catch (err) {
    return new Response(
      `<pre>Edge Function Error:\n${err.message}</pre>`,
      { status: 500, headers: { "Content-Type": "text/html" } }
    );
  }
};

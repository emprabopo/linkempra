export default async (request, context) => {
  const urls = [
    "https://www.soscisurvey.de/egp/",
    "https://www.soscisurvey.de/kgnpp/",
    "https://www.soscisurvey.de/kgpp/",
    "https://www.soscisurvey.de/pegp/",
    "https://www.soscisurvey.de/pkgnpp/",
    "https://www.soscisurvey.de/pkgpp/"
  ];

  const UPSTASH_URL   = process.env.UPSTASH_REDIS_REST_URL;
  const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

  // 1) Counter in Upstash inkrementieren
  const res = await fetch(`${UPSTASH_URL}/incr/roundrobin`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${UPSTASH_TOKEN}`,
      "Content-Type": "application/json"
    }
  });
  const { result: counter } = await res.json();

  // 2) Index im Bereich [0..5] berechnen
  const idx = (counter - 1) % urls.length;

  // 3) 302-Redirect auf das berechnete Ziel
  return new Response(null, {
    status: 302,
    headers: { "Location": urls[idx] }
  });
};


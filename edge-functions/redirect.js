export default async (request, context) => {
  try {
    // Antwort anzeigen statt Weiterleitung
    const message = "Diese Erhebung wurde beendet";
    return new Response(
      `<html><body><h1>${message}</h1></body></html>`,
      {
        status: 200,
        headers: { "Content-Type": "text/html; charset=utf-8" }
      }
    );
  } catch (err) {
    return new Response(
      `<pre>Edge Function Error:\n${err.message}</pre>`,
      { status: 500, headers: { "Content-Type": "text/html" } }
    );
  }
};
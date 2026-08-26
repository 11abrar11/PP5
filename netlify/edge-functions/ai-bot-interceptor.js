export default async (request, context) => {
  const ua = (request.headers.get("user-agent") || "").toLowerCase();
  
  // List of common AI crawlers
  const bots = [
    "gptbot", "oai-searchbot", "chatgpt", 
    "claude", "anthropic", 
    "perplexity", "google-extended"
  ];
  
  const isBot = bots.some(bot => ua.includes(bot));
  
  if (isBot) {
    // If it's an AI bot, fetch the pure text llms.txt file
    const url = new URL(request.url);
    const llmsUrl = new URL("/llms.txt", url.origin);
    const response = await fetch(llmsUrl);
    
    if (response.ok) {
      const text = await response.text();
      
      // Wrap it in pristine, zero-JavaScript HTML
      const html = `<!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <title>PP5 Media Solutions</title>
        </head>
        <body>
          <main style="white-space: pre-wrap; font-family: sans-serif; max-width: 800px; margin: 0 auto; padding: 40px;">
${text}
          </main>
        </body>
        </html>`;

      return new Response(html, {
        headers: { "content-type": "text/html;charset=UTF-8" }
      });
    }
  }
  
  // For all normal human visitors, continue loading the React app normally
  return context.next();
};

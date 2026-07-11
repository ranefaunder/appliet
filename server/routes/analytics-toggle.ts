/**
 * GET `/analytics-toggle`
 *
 * Toggles Umami opt-out via `localStorage` (https://umami.is/docs/exclude-my-own-visits).
 * Returns minimal HTML so the script runs on this origin; the server cannot set localStorage.
 */
export default function analyticsToggle(): Response {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Analytics</title>
</head>
<body>
  <p id="m"></p>
  <script>
(function () {
  var k = "umami.disabled";
  if (localStorage.getItem(k)) {
    localStorage.removeItem(k);
    document.getElementById("m").textContent =
      "Analytics tracking is enabled. Your visits may appear in site statistics.";
  } else {
    localStorage.setItem(k, "1");
    document.getElementById("m").textContent =
      "Analytics tracking is disabled for this browser. Your visits will not appear in statistics.";
  }
})();
  </script>
</body>
</html>`;

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

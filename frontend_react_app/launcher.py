"""
Minimal route launcher for the React app.

This file intentionally does NOT serve the React app assets. It only provides a local
"link hub" page to quickly open all key routes on the running frontend.

Usage:
  python launcher.py

Then click a route; links point to:
  http://localhost:3000/<route>

Notes:
- Uses only Python standard library.
- Binds a small local HTTP server on port 5500 by default.
- If 5500 is busy, increments up to 5510.
"""

from __future__ import annotations

import http.server
import socket
import socketserver
import threading
import time
import urllib.parse
import webbrowser
from dataclasses import dataclass
from typing import List, Optional, Tuple


@dataclass(frozen=True)
class RouteLink:
    """Simple representation of a route link shown on the index page."""

    name: str
    path: str


ROUTES: List[RouteLink] = [
    RouteLink("Home", "/"),
    RouteLink("Refine Requirements", "/refine"),
    RouteLink("Test Cases", "/test-cases"),
    RouteLink("Test Scripts", "/test-scripts"),
    RouteLink("Execute", "/execute"),
    RouteLink("Reports", "/reports"),
    RouteLink("Login", "/login"),
]

# This is the expected location of the running React frontend.
REACT_BASE_URL = "http://localhost:3000"

DEFAULT_PORT = 5500
MAX_PORT = 5510


def _build_index_html() -> str:
    """Build the styled index HTML shown by the launcher server."""
    items_html = "\n".join(
        f"""
        <li class="item">
          <a class="link" href="{REACT_BASE_URL}{urllib.parse.quote(r.path, safe="/")}" target="_blank" rel="noopener noreferrer">
            <span class="name">{_escape_html(r.name)}</span>
            <span class="path">{_escape_html(r.path)}</span>
          </a>
        </li>
        """.strip()
        for r in ROUTES
    )

    return f"""<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>Test Automation Dashboard — Route Launcher</title>
  <style>
    :root {{
      --bg: #F3F4F6;
      --surface: #FFFFFF;
      --text: #111827;
      --muted: #6B7280;
      --border: #E5E7EB;
      --primary: #1E3A8A;
      --accent: #F59E0B;
      --shadow: 0 1px 2px rgba(0,0,0,0.06), 0 8px 20px rgba(17,24,39,0.06);
      --radius: 16px;
    }}
    body {{
      margin: 0;
      font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial, "Noto Sans", "Liberation Sans", sans-serif;
      background: var(--bg);
      color: var(--text);
    }}
    .wrap {{
      max-width: 980px;
      padding: 28px 18px;
      margin: 0 auto;
    }}
    .hero {{
      background: linear-gradient(to bottom right, rgba(30,58,138,0.10), rgba(245,158,11,0.10));
      border: 1px solid rgba(30,58,138,0.12);
      border-radius: var(--radius);
      padding: 18px 18px;
    }}
    .title {{
      font-size: 18px;
      font-weight: 800;
      margin: 0;
      letter-spacing: 0.2px;
    }}
    .subtitle {{
      margin: 6px 0 0 0;
      font-size: 14px;
      color: #374151;
      line-height: 1.5;
    }}
    .card {{
      margin-top: 14px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      box-shadow: var(--shadow);
      overflow: hidden;
    }}
    .cardHeader {{
      padding: 14px 16px;
      border-bottom: 1px solid var(--border);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }}
    .cardHeader h2 {{
      margin: 0;
      font-size: 14px;
      font-weight: 800;
    }}
    .badge {{
      font-size: 12px;
      font-weight: 800;
      color: var(--primary);
      background: rgba(30,58,138,0.10);
      border: 1px solid rgba(30,58,138,0.15);
      padding: 4px 10px;
      border-radius: 999px;
      white-space: nowrap;
    }}
    ul {{
      list-style: none;
      padding: 0;
      margin: 0;
    }}
    .item {{
      border-top: 1px solid var(--border);
    }}
    .item:first-child {{
      border-top: none;
    }}
    .link {{
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: 12px;
      padding: 12px 16px;
      text-decoration: none;
      color: var(--text);
      transition: background 0.15s ease;
    }}
    .link:hover {{
      background: #F9FAFB;
    }}
    .name {{
      font-weight: 800;
      color: var(--primary);
    }}
    .path {{
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
      font-size: 12px;
      color: var(--muted);
      background: #F3F4F6;
      border: 1px solid #E5E7EB;
      padding: 3px 8px;
      border-radius: 999px;
    }}
    .foot {{
      margin-top: 10px;
      font-size: 12px;
      color: var(--muted);
    }}
    code {{
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
      font-size: 12px;
      background: rgba(17,24,39,0.04);
      border: 1px solid rgba(17,24,39,0.08);
      padding: 1px 6px;
      border-radius: 6px;
    }}
  </style>
</head>
<body>
  <div class="wrap">
    <div class="hero">
      <h1 class="title">Test Automation Dashboard — Route Launcher</h1>
      <p class="subtitle">
        This page is a simple link hub. It does <strong>not</strong> serve the React app itself.
        Make sure the frontend is running at <code>{_escape_html(REACT_BASE_URL)}</code>.
      </p>
    </div>

    <div class="card">
      <div class="cardHeader">
        <h2>Routes</h2>
        <span class="badge">Targets: localhost:3000</span>
      </div>
      <ul>
        {items_html}
      </ul>
    </div>

    <div class="foot">
      Tip: If you’re not authenticated, protected routes will redirect to <code>/login</code>.
    </div>
  </div>
</body>
</html>
"""


def _escape_html(s: str) -> str:
    """Escape HTML special characters for safe insertion into the page."""
    return (
        str(s)
        .replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;")
        .replace("'", "&#39;")
    )


class _LauncherHandler(http.server.BaseHTTPRequestHandler):
    """HTTP handler serving a single index page for '/' (and redirects for others)."""

    server_version = "RouteLauncher/1.0"

    def log_message(self, format: str, *args) -> None:
        # Keep output minimal and friendly.
        msg = "%s - - [%s] %s\n" % (self.address_string(), self.log_date_time_string(), format % args)
        print(msg, end="")

    def do_GET(self) -> None:
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path or "/"

        if path not in ("/", "/index.html"):
            self.send_response(302)
            self.send_header("Location", "/")
            self.end_headers()
            return

        body = _build_index_html().encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)


def _try_bind_server(port: int) -> Optional[socketserver.TCPServer]:
    """Try to bind the server on a port; returns server instance or None."""
    try:
        httpd = socketserver.TCPServer(("127.0.0.1", port), _LauncherHandler)
        # Allow quick restart if you stop and re-run immediately.
        httpd.allow_reuse_address = True
        return httpd
    except OSError:
        return None


def _find_available_port(start: int, end: int) -> Tuple[socketserver.TCPServer, int]:
    """Find an available port in [start, end] and return (server, port)."""
    for port in range(start, end + 1):
        srv = _try_bind_server(port)
        if srv is not None:
            return srv, port

    raise OSError(f"No available port found in range {start}-{end}.")


# PUBLIC_INTERFACE
def main() -> None:
    """Entry point: start the local launcher server and open the index page in a browser."""
    server, port = _find_available_port(DEFAULT_PORT, MAX_PORT)
    url = f"http://127.0.0.1:{port}/"

    print(f"Launcher running at: {url}")
    print(f"React frontend expected at: {REACT_BASE_URL}")
    print("Press Ctrl+C to stop.")

    # Start HTTP server in a background thread so we can open the browser immediately.
    t = threading.Thread(target=server.serve_forever, daemon=True)
    t.start()

    # Give the server a moment to start before opening.
    time.sleep(0.2)
    try:
        webbrowser.open(url, new=1, autoraise=True)
    except Exception as e:
        print(f"Warning: could not open browser automatically: {e}")

    try:
        # Keep main thread alive while server runs.
        while t.is_alive():
            time.sleep(0.5)
    except KeyboardInterrupt:
        pass
    finally:
        server.shutdown()
        server.server_close()


if __name__ == "__main__":
    main()

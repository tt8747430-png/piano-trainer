"""Receive playlist exports from a signed-in YouTube tab and save them as JSON.

Run `python3 receive-export.py <folder>`, then post each playlist's rows from the page's console to
http://127.0.0.1:8765/<name>.json (README.md has the snippet). It answers only https://www.youtube.com.
"""

import http.server
import os
import sys
import time

OUT = sys.argv[1]
class H(http.server.BaseHTTPRequestHandler):
    def cors(self):
        self.send_header('Access-Control-Allow-Origin', 'https://www.youtube.com')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'content-type')
        self.send_header('Access-Control-Allow-Private-Network', 'true')
    def do_OPTIONS(self):
        self.send_response(204); self.cors(); self.end_headers()
    def do_POST(self):
        n = int(self.headers['content-length']); body = self.rfile.read(n)
        name = os.path.basename(self.path.strip('/')) or str(time.time())
        open(os.path.join(OUT, name), 'wb').write(body)
        self.send_response(200); self.cors(); self.end_headers(); self.wfile.write(b'ok')
http.server.HTTPServer(('127.0.0.1', 8765), H).serve_forever()

# Local test server: no-cache + HTTP Range support (so <video> can seek, like Netlify).
import os, re
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

class H(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control','no-store, no-cache, must-revalidate, max-age=0')
        self.send_header('Accept-Ranges','bytes')
        super().end_headers()
    def log_message(self,*a): pass

    def send_head(self):
        rng = self.headers.get('Range')
        if not rng:
            return super().send_head()
        path = self.translate_path(self.path)
        if not os.path.isfile(path):
            return super().send_head()
        m = re.match(r'bytes=(\d*)-(\d*)', rng.strip())
        if not m:
            return super().send_head()
        size = os.path.getsize(path)
        start = int(m.group(1)) if m.group(1) else 0
        end   = int(m.group(2)) if m.group(2) else size - 1
        end   = min(end, size - 1)
        if start > end:
            self.send_error(416); return None
        f = open(path, 'rb'); f.seek(start)
        self.send_response(206)
        self.send_header('Content-Type', self.guess_type(path))
        self.send_header('Content-Range', f'bytes {start}-{end}/{size}')
        self.send_header('Content-Length', str(end - start + 1))
        self.end_headers()
        self._range = (start, end)
        return f

    def copyfile(self, src, dst):
        r = getattr(self, '_range', None)
        if not r: return super().copyfile(src, dst)
        start, end = r; remaining = end - start + 1
        while remaining > 0:
            chunk = src.read(min(64*1024, remaining))
            if not chunk: break
            dst.write(chunk); remaining -= len(chunk)
        self._range = None

ThreadingHTTPServer(('127.0.0.1',8000), H).serve_forever()

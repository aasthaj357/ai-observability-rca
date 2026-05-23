import httpx
import ssl
import socket
from datetime import datetime
from urllib.parse import urlparse
from schemas.telemetry import TelemetryData

class WebsiteMonitorService:
    def __init__(self):
        self.timeout = httpx.Timeout(10.0)

    async def check_website(self, url: str) -> TelemetryData:
        start_time = datetime.now()
        status_code = None
        uptime_status = "down"
        error_logs = []
        ssl_status = "n/a"

        # Ensure scheme is present
        if not url.startswith("http"):
            url = "https://" + url

        parsed_url = urlparse(url)
        hostname = parsed_url.hostname or url

        # Check SSL if HTTPS
        if url.startswith("https"):
            ssl_status = self._check_ssl(hostname)

        # Ping the website
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.get(url)
                status_code = response.status_code
                if 200 <= status_code < 400:
                    uptime_status = "up"
                else:
                    uptime_status = "degraded"
        except httpx.ConnectTimeout:
            error_logs.append("Connection timed out")
        except httpx.ConnectError:
            error_logs.append("Connection error (DNS/Network)")
        except Exception as e:
            error_logs.append(f"Unexpected error: {str(e)}")

        end_time = datetime.now()
        response_time = (end_time - start_time).total_seconds() * 1000

        return TelemetryData(
            website=url,
            service_name="Website Health Monitor",
            endpoint="/",
            response_time=response_time,
            status_code=status_code,
            uptime_status=uptime_status,
            ssl_status=ssl_status,
            error_logs=error_logs,
            timestamp=datetime.now(),
            source="website_monitor"
        )

    def _check_ssl(self, hostname: str) -> str:
        try:
            context = ssl.create_default_context()
            with socket.create_connection((hostname, 443), timeout=5.0) as sock:
                with context.wrap_socket(sock, server_hostname=hostname) as ssock:
                    cert = ssock.getpeercert()
                    # In a real scenario, we'd parse the 'notAfter' date to check expiration.
                    # Simplified for now.
                    return "valid" if cert else "invalid"
        except ssl.SSLError:
            return "invalid"
        except socket.timeout:
            return "timeout"
        except Exception:
            return "unknown"

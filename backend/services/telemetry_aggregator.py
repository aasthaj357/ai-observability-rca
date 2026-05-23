from typing import List
from schemas.telemetry import TelemetryData
from services.website_monitor_service import WebsiteMonitorService
from services.grafana_service import GrafanaService
from services.newrelic_service import NewRelicService

class TelemetryAggregator:
    def __init__(self):
        self.website_monitor = WebsiteMonitorService()
        self.grafana_service = GrafanaService()
        self.newrelic_service = NewRelicService()

    async def run_website_check(self, url: str) -> TelemetryData:
        """
        Run a single website check and return normalized telemetry.
        """
        return await self.website_monitor.check_website(url)

    async def aggregate_all(self, target_url: str) -> List[TelemetryData]:
        """
        Fetch data from all sources and return aggregated telemetry.
        """
        results = []
        
        # 1. Active Website Monitoring
        if target_url:
            web_data = await self.website_monitor.check_website(target_url)
            results.append(web_data)
            
        # 2. Grafana Integration
        grafana_data = await self.grafana_service.fetch_metrics()
        results.append(grafana_data)
        
        # 3. New Relic Integration
        nr_data = await self.newrelic_service.fetch_telemetry()
        results.append(nr_data)
        
        return results

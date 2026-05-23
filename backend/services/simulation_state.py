import asyncio
import random
from datetime import datetime, timedelta

class SimulationState:
    def __init__(self):
        self.active_incident = None
        self.incident_history = []
        self.metrics_history = []
        self.logs_history = []
        self.deployments = [
            {
                "id": "dep-1",
                "version": "v1.4.3 Production",
                "time_relative": "1h ago",
                "description": "Emergency hotfix for auth service timeout.",
                "status": "success",
                "color_class": "bg-emerald-500",
                "timestamp": (datetime.now() - timedelta(hours=1)).isoformat()
            },
            {
                "id": "dep-2",
                "version": "v1.4.2 Production",
                "time_relative": "4h ago",
                "description": "Fix search query performance issues.",
                "status": "warning",
                "color_class": "bg-warning",
                "timestamp": (datetime.now() - timedelta(hours=4)).isoformat()
            }
        ]
        
        self.services = ["auth-service", "payment-api", "user-db", "frontend-gateway"]
        
        # Initialize metrics
        now = datetime.now()
        base_requests = 2500
        for i in range(12, -1, -1):
            t = now - timedelta(minutes=i*5)
            self.metrics_history.append({
                "time": t.strftime('%H:%M'),
                "requests": max(500, base_requests + random.randint(-500, 500)),
                "errors": random.randint(5, 20)
            })

    def tick(self):
        now = datetime.now()
        
        # 1. Possibly start a new incident (50% chance every tick if none active)
        if not self.active_incident and random.random() < 0.5:
            service = random.choice(self.services)
            self.active_incident = {
                "id": f"INC-{random.randint(9000, 9999)}",
                "service_name": service,
                "severity": random.choice(["CRITICAL", "HIGH", "MEDIUM"]),
                "status": "Active",
                "start_time": now.isoformat(),
                "time_relative": "Just now",
                "impacted_services": [service, random.choice(self.services)],
                "anomaly_score": random.uniform(0.7, 0.99),
                "deployment_events": [self.deployments[0]],
                "anomaly_reasoning": [
                    "Sustained 5xx error rate spike",
                    f"Latency increased by 400% on {service}",
                    "Database connection pool exhausted"
                ],
                "response_time": random.randint(1000, 5000)
            }
        
        # 2. Possibly resolve active incident (20% chance)
        elif self.active_incident and random.random() < 0.2:
            self.active_incident["status"] = "Resolved"
            self.active_incident["time_relative"] = "Resolved recently"
            self.incident_history.insert(0, self.active_incident)
            self.active_incident = None

        # 3. Add a new metric data point (simulating 5 min intervals for the chart, but we just append here)
        # We will keep the last 15 points
        is_incident = self.active_incident is not None
        last_reqs = self.metrics_history[-1]["requests"]
        new_reqs = max(500, last_reqs + random.randint(-200, 200))
        
        if is_incident:
            new_errs = random.randint(100, 500)
            new_reqs = max(100, new_reqs - random.randint(500, 1000)) # traffic drops
        else:
            new_errs = random.randint(0, 10)

        self.metrics_history.append({
            "time": now.strftime('%H:%M:%S'),
            "requests": new_reqs,
            "errors": new_errs
        })
        if len(self.metrics_history) > 15:
            self.metrics_history.pop(0)

        # 4. Generate some logs
        levels = ["INFO", "WARN", "ERROR"]
        if is_incident:
            weights = [0.2, 0.3, 0.5]
            messages = [
                f"ConnectionTimeout: Failed to connect to {self.active_incident['service_name']}",
                "API Gateway timeout exceeding 5000ms",
                "Database connection pool full",
                "Cascading failure detected in downstream services",
                "Health check failed for user-db"
            ]
        else:
            weights = [0.8, 0.15, 0.05]
            messages = [
                "User authentication successful",
                "Background worker job finished",
                "Processed payment transaction",
                "Cache hit ratio stable",
                "Minor latency spike detected on external API"
            ]
        
        # Add 1-3 new logs
        for _ in range(random.randint(1, 3)):
            lvl = random.choices(levels, weights=weights)[0]
            msg = random.choice(messages)
            self.logs_history.append({
                "timestamp": now.strftime('%H:%M:%S'),
                "level": lvl,
                "message": msg
            })
            
        if len(self.logs_history) > 50:
            self.logs_history = self.logs_history[-50:]

# Global simulation state instance
state = SimulationState()

async def simulation_loop():
    while True:
        state.tick()
        await asyncio.sleep(5) # Tick every 5 seconds for fast demo


from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    app_name: str = "AI Observability Platform"
    environment: str = "development"
    
    # API Keys & Endpoints
    gemini_api_key: str = ""
    grafana_url: str = ""
    grafana_api_key: str = ""
    newrelic_api_key: str = ""
    
    # Telemetry configuration
    retention_days: int = 30
    
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding='utf-8')

settings = Settings()

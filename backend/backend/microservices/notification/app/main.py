"""Notification microservice - entry point.

Run:  uvicorn app.main:app --reload --port 8084
  or: python -m app.main
"""
import os
from contextlib import asynccontextmanager
import py_eureka_client.eureka_client as eureka_client
from fastapi import FastAPI

from app.routers import notification

PORT = int(os.getenv("PORT", "8084"))
EUREKA_SERVER = os.getenv("EUREKA_SERVER", "http://localhost:8761/eureka")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Démarrage : enregistrement dans Eureka
    await eureka_client.init_async(
        eureka_server=EUREKA_SERVER,
        app_name="notification",
        instance_ip="127.0.0.1",
        instance_port=PORT,
        health_check_url=f"http://localhost:{PORT}/health",
        status_page_url=f"http://localhost:{PORT}/info",
        home_page_url=f"http://localhost:{PORT}/",
    )
    yield
    # Arrêt : désenregistrement
    await eureka_client.stop_async()
app = FastAPI(lifespan=lifespan)






app.include_router(notification.router)

# TODO (students): if you add other routers, include them here.

@app.get("/health")
def health():
    return {"status": "UP"}


@app.get("/info")
def info():
    return {"name": "notification", "version": "1.0.0"}

if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app.main:app", host="0.0.0.0", port=PORT, reload=True)

"""
FastAPI entrypoint. Wires routers and the global exception handlers,
plus a tiny health check so Node's smoke tests have something to hit.
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.core.exceptions import global_exception_handler, http_exception_handler
from app.routers import organize, optimize


app = FastAPI(title="Doclyn PDF Engine", version="1.0.0")

# The Python service is internal — it sits behind the Node API.
# We still allow CORS for direct debugging from a browser.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten via reverse proxy in prod
    allow_methods=["*"],
    allow_headers=["*"],
)

# IMPORTANT: HTTPException must be registered explicitly, otherwise FastAPI's
# own default handler intercepts it before our generic Exception handler
# ever runs, and the response comes back as {"detail": "..."} instead of
# our {"success": false, "data": null, "message": "..."} shape.
app.add_exception_handler(HTTPException, http_exception_handler)
app.add_exception_handler(Exception, global_exception_handler)

app.include_router(organize.router)
app.include_router(optimize.router)


@app.get("/health")
def health():
    return {"status": "ok"}
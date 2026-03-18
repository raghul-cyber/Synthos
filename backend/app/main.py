from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import time

from .config import get_settings
from .database import check_db_health
from .routes import auth, skills, market, paths, intelligence

settings = get_settings()

app = FastAPI(
    title="Synthos API",
    description="Human Capital Intelligence System",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Request timing middleware
@app.middleware("http")
async def add_timing_header(request: Request, call_next):
    start = time.time()
    response = await call_next(request)
    elapsed = round((time.time() - start) * 1000, 2)
    response.headers["X-Response-Time"] = f"{elapsed}ms"
    return response


# Routes
app.include_router(auth.router)
app.include_router(skills.router)
app.include_router(market.router)
app.include_router(paths.router)
app.include_router(intelligence.router)


@app.get("/")
async def root():
    return {
        "name": "Synthos API",
        "version": "1.0.0",
        "tagline": "Navigate Your Human Capital",
        "docs": "/docs",
    }


@app.get("/health")
async def health():
    db_ok = await check_db_health()
    return {
        "status": "healthy" if db_ok else "degraded",
        "database": "connected" if db_ok else "disconnected",
        "version": "1.0.0",
    }


# Error handlers
@app.exception_handler(404)
async def not_found_handler(request: Request, exc):
    return JSONResponse(status_code=404,
                        content={"detail": "Not found"})


@app.exception_handler(500)
async def server_error_handler(request: Request, exc):
    return JSONResponse(status_code=500,
                        content={"detail": "Internal server error"})

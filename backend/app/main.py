from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import router

app = FastAPI(
    title="CampusConnect API",
    description="Minimal REST API backend for CampusConnect (Day 1 Workshop)",
    version="1.0.0"
)

# Enable CORS for frontend integration (React / Vite)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for local workshop development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API routes
app.include_router(router)

@app.get("/", summary="Health Check")
def health_check():
    return {
        "status": "online",
        "service": "CampusConnect Backend",
        "docs_url": "/docs"
    }


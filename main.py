try:
    from dotenv import load_dotenv

    load_dotenv()
except ImportError:
    pass

from pathlib import Path

from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from fastapi.middleware.cors import CORSMiddleware

import routes

app = FastAPI(docs_url=None)

build_dir = Path("./client/build")


async def not_found(request, exc):
    return JSONResponse(
        content=jsonable_encoder({"message": "Page not found"}),
        status_code=404,
    )


# Sub router for api
api = FastAPI(exception_handlers={404: not_found}, docs_url=None)

for route in routes.default:
    api.include_router(route)

app.mount("/api", api)

# origins = ["http://localhost:3000"]

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=origins,
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# Render static react app
app.mount(
    "/static/",
    StaticFiles(directory=build_dir / "static"),
    name="static",
)
templates = Jinja2Templates(directory=build_dir.as_posix())


@app.get("/{full_path:path}")
async def serve_react_app(request: Request, full_path: str):
    return templates.TemplateResponse("index.html", {"request": request})

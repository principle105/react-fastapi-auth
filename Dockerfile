FROM node:16.13.0 as build

WORKDIR /frontend

COPY client/ client/

RUN cd client && npm install --only=prod && npm run build --prod

FROM python:3.9.7

ENV PYTHONDONTWRITEBYTECODE 1

ENV PYTHONUNBUFFERED 1

COPY pyproject.toml poetry.lock ./

RUN pip install -U poetry

RUN poetry config virtualenvs.create false \
&& poetry install --no-interaction --no-ansi

WORKDIR /server

COPY --from=build /frontend/client/build ./client/build

COPY ./utils ./utils
COPY ./routes ./routes
COPY config.py config.py
COPY main.py main.py

CMD [ "sh", "-c", "uvicorn main:app --host=0.0.0.0 --port=${PORT:-5000}"]
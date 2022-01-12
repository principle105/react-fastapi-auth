# React Fast API Authentication

Basic authentication using React and Fast API.

# How to run

### 1. Clone the repository

> `git clone https://github.com/principle105/react-fastapi-auth`

### 2. Configuration

> 1. Create a `.env` file in the root directory of the repository.
>
> 2. Copy the content from `.env.example` into it and fill it with the necessary information.

### 3. Running

> ### Docker
>
> `docker compose up`
>
> ### Without Docker
>
> [Python 3.9.7](https://www.python.org/downloads/release/python-397/) is recommended.
>
> 1. Install [Poetry](https://python-poetry.org/) using `brew install poetry`
> 2. Install the necessary dependencies using `poetry install`
> 3. Active the poetry environment using `source .venv/bin/activate`
> 4. Install node packages using `npm install`
> 5. Build client by typing `npm run build` in the `client` directory
> 6. Type `uvicorn main:app --host 0.0.0.0 --port 8080` in the `root` directory to run

## Formatting

[Black](https://github.com/psf/black) and [Prettier](https://prettier.io) are used for formatting

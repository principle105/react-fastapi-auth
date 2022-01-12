import config
import asyncio
from jose import JWTError, jwt
from datetime import datetime, timedelta
from passlib.context import CryptContext
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from twilio.rest import Client
from .models import TokenData
from .database import get_user, create_user

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

client = Client(config.TWILIO_ACCOUNT_SID, config.TWILIO_AUTH_TOKEN)


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)


async def authenticate_user(email: str, password: str):
    user = await get_user(email)
    if not user:
        return False
    if not verify_password(password, user.password):
        return False
    return user


def create_access_token(data: dict, expires_delta: timedelta):
    to_encode = data.copy()

    expire = datetime.utcnow() + expires_delta

    to_encode.update({"exp": expire})

    encoded_jwt = jwt.encode(to_encode, config.SECRET, algorithm=config.ALGORITHM)
    return encoded_jwt


async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
    )
    try:
        payload = jwt.decode(token, config.SECRET, algorithms=[config.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = TokenData(email=email)
    except JWTError:
        raise credentials_exception

    user = await get_user(email=token_data.email)

    if user is None:
        raise credentials_exception
    return user


async def register_user(email: str, password: str):

    # Checking if email and password are valid
    if len(email) not in range(1, 50) or len(password) not in range(1, 20):

        raise HTTPException(status_code=400, detail="Invalid email or password")

    # Checking if user already exists in the database
    user = await get_user(email)

    if user is not None:
        raise HTTPException(status_code=400, detail="User already exists")

    hashed_password = get_password_hash(password)

    # Registering the user in the database
    u = await create_user(email, hashed_password)

    # Sending the email verification
    await asyncio.get_event_loop().run_in_executor(None, send_verification_code, email)

    return u


def send_verification_code(email):
    verification = client.verify.services(
        config.TWILIO_VERIFY_SERVICE
    ).verifications.create(to=email, channel="email")

    assert verification.status == "pending"


def check_verification_code(email, code):
    verification = client.verify.services(
        config.TWILIO_VERIFY_SERVICE
    ).verification_checks.create(to=email, code=code)

    return verification.status == "approved"

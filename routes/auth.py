import config
import asyncio
from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from utils.auth import (
    authenticate_user,
    create_access_token,
    get_current_user,
    register_user,
    check_verification_code,
)
from utils.database import update_user_data
from utils.models import Token, User

auth_router = APIRouter(prefix="/auth")


@auth_router.post("/token", response_model=Token)
async def get_token(form_data: OAuth2PasswordRequestForm = Depends()):
    # using username because of OAuth2PasswordRequestForm default
    user = await authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=400,
            detail="Incorrect email or password",
        )
    access_token_expires = timedelta(minutes=config.AT_EXPIRE_TIME)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer", "user": user}


@auth_router.get("/data", response_model=User)
async def get_my_data(current_user: User = Depends(get_current_user)):
    return current_user


@auth_router.post("/register", response_model=Token)
async def register_a_user(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await register_user(form_data.username, form_data.password)
    access_token_expires = timedelta(minutes=config.AT_EXPIRE_TIME)

    access_token = create_access_token(
        data={"sub": user["email"]}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer", "user": user}


@auth_router.get("/verify")
async def verify_code(code: int, current_user: User = Depends(get_current_user)):
    if current_user.verified:
        verified = True
    else:
        verified = await asyncio.get_event_loop().run_in_executor(
            None, check_verification_code, current_user.email, str(code)
        )

        if verified:
            await update_user_data(current_user.email, {"$set": {"verified": True}})

    return {"verified": verified}

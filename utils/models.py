from pydantic import BaseModel


class TokenData(BaseModel):
    email: str


class User(BaseModel):
    email: str
    verified: bool


class Token(BaseModel):
    access_token: str
    token_type: str
    user: User


class UserInDB(User):
    password: str

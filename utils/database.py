import config
import pickle
from .models import UserInDB
from motor.motor_asyncio import AsyncIOMotorClient
from collections.abc import MutableMapping

# Lru cache implementation (to prevent too much memory being used)
class LimitedDict(MutableMapping):
    def __init__(self, maxlen: int):
        self.maxlen = maxlen
        self.d = dict()

    def __iter__(self):
        return iter(self.d)

    def __len__(self):
        return len(self.d)

    def __getitem__(self, k):
        return self.d[k]

    def __delitem__(self, k):
        del self.d[k]

    def __setitem__(self, k, v):
        if k not in self and len(self) == self.maxlen:
            self.popitem()
        self.d[k] = v


# Global variables that are constant or keep state

client = AsyncIOMotorClient(config.DATABASE_URI)

db = client[config.DATABASE_NAME]

# Too lazy to use redis
user_cache = LimitedDict(250)


def add_user_to_cache(email, data):
    user_cache[email] = pickle.dumps(data)


async def get_user(email: str):
    # Checking if user is in cache
    u = user_cache.get(email)
    if u is not None:
        u = UserInDB(**u) if (u := pickle.loads(u)) is not None else None

    u = await db.users.find_one({"email": email}, {"_id": 0})

    add_user_to_cache(email, u)

    return UserInDB(**u) if u is not None else None


async def create_user(email: str, hashed_password: str):
    data = {
        "email": email,
        "password": hashed_password,
        "verified": False,
    }

    # to prevent weird error ??????
    u = data.copy()

    await db.users.insert_one(data)

    add_user_to_cache(email, u)

    return u


async def update_user_data(email: str, query: dict):
    await db.users.update_one({"email": email}, query)

    # Deleting user from cache because data changed
    if email in user_cache:
        del user_cache[email]

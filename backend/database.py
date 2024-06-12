# app/database.py

from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.errors import ServerSelectionTimeoutError
import logging

DATABASE_URL = "mongodb://localhost:27017"
DATABASE_NAME = "quiz_database"

client = AsyncIOMotorClient(DATABASE_URL)
database = client[DATABASE_NAME]

try:
    client.admin.command('ping')
    logging.info("Connected to MongoDB")
except ServerSelectionTimeoutError as err:
    logging.error(f"Failed to connect to MongoDB: {err}")
from backend.database import database
from backend.models import Test
from bson.objectid import ObjectId
from typing import List

async def create_test(test: Test) -> str:
    result = await database["tests"].insert_one(test.dict(by_alias=True))
    return str(result.inserted_id)

async def get_test(test_id: str) -> Test:
    document = await database["tests"].find_one({"_id": ObjectId(test_id)})
    if document:
        document["_id"] = str(document["_id"])
    return Test(**document)

async def get_all_tests() -> List[Test]:
    tests = []
    cursor = database["tests"].find({})
    async for document in cursor:
        document["_id"] = str(document["_id"])
        tests.append(Test(**document))
    return tests

async def delete_test(test_id: str) -> bool:
    result = await database["tests"].delete_one({"_id": ObjectId(test_id)})
    return result.deleted_count == 1
from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from typing import List
from backend.schemas import TestCreateSchema, TestResponseSchema, TestSubmitSchema, AnswerSchema
from backend.crud import create_test, get_test, get_all_tests, delete_test

router = APIRouter()

templates = Jinja2Templates(directory="frontend/html")

@router.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    return templates.TemplateResponse("home.html", {"request": request})

@router.get("/create-test", response_class=HTMLResponse)
async def create_test_page(request: Request):
    return templates.TemplateResponse("create_test.html", {"request": request})

@router.get("/take-test/{test_id}", response_class=HTMLResponse)
async def take_test_page(request: Request, test_id: str):
    return templates.TemplateResponse("take_test.html", {"request": request, "test_id": test_id})

@router.post("/tests", response_model=str)
async def create_new_test(test: TestCreateSchema):
    test_id = await create_test(test)
    return test_id

@router.get("/tests/{test_id}", response_model=TestResponseSchema)
async def read_test(test_id: str):
    test = await get_test(test_id)
    if test is None:
        raise HTTPException(status_code=404, detail="Test not found")
    return test

@router.get("/tests", response_model=List[TestResponseSchema])
async def read_all_tests():
    tests = await get_all_tests()
    return tests

@router.delete("/tests/{test_id}", response_model=bool)
async def remove_test(test_id: str):
    success = await delete_test(test_id)
    if not success:
        raise HTTPException(status_code=404, detail="Test not found")
    return success

@router.post("/submit-test", response_model=dict)
async def submit_test(answers: TestSubmitSchema):
    score = 0
    total = len(answers.answers)
    for answer in answers.answers:
        test = await get_test(answer.test_id)
        if not test:
            raise HTTPException(status_code=404, detail="Test not found")
        correct_answer = test.questions[answer.question_id].correct_answer
        if answer.answer == correct_answer:
            score += 1
    result = {"score": score, "total": total}
    return result
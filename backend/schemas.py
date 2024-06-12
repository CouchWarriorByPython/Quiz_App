from pydantic import BaseModel
from typing import List

class QuestionSchema(BaseModel):
    question: str
    options: List[str]
    correct_answer: str

class TestCreateSchema(BaseModel):
    title: str
    questions: List[QuestionSchema]

class TestResponseSchema(BaseModel):
    id: str
    title: str
    questions: List[QuestionSchema]

class AnswerSchema(BaseModel):
    question_id: int
    answer: str
    test_id: str

class TestSubmitSchema(BaseModel):
    answers: List[AnswerSchema]
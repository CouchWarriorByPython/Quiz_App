from pydantic import BaseModel, Field
from typing import List, Optional

class Question(BaseModel):
    question: str
    options: List[str]
    correct_answer: str

class Test(BaseModel):
    id: Optional[str] = Field(alias="_id")
    title: str
    questions: List[Question]

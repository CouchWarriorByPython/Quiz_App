document.addEventListener("DOMContentLoaded", function() {
    const createTestForm = document.getElementById("create-test-form");
    const takeTestForm = document.getElementById("take-test-form");
    const testList = document.getElementById("test-list");
    const questionsContainer = document.getElementById("questions-container");
    const testTitle = document.getElementById("test-title");
    let currentTestId = "";

    if (createTestForm) {
        createTestForm.addEventListener("submit", async function(event) {
            event.preventDefault();
            const formData = new FormData(createTestForm);
            const title = formData.get("title");
            const questions = [];

            document.querySelectorAll(".question-item").forEach(item => {
                const question = item.querySelector("input[name='question']").value;
                const options = Array.from(item.querySelectorAll("input[name='option']")).map(opt => opt.value);
                const correctAnswer = item.querySelector("input[name='correct_answer']").value;
                questions.push({ question, options, correct_answer: correctAnswer });
            });

            const response = await fetch("/tests", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, questions })
            });

            if (response.ok) {
                window.location.href = "/";
            } else {
                alert("Failed to create test");
            }
        });

        document.addEventListener("click", function(event) {
            if (event.target.classList.contains("add-option-btn")) {
                const optionsContainer = event.target.closest(".options-container");
                const newOption = document.createElement("div");
                newOption.classList.add("option-item");
                newOption.innerHTML = `
                    <input type="text" name="option" required>
                    <button type="button" class="remove-option-btn">-</button>
                `;
                optionsContainer.appendChild(newOption);
            }

            if (event.target.classList.contains("remove-option-btn")) {
                const optionItem = event.target.closest(".option-item");
                optionItem.remove();
            }
        });
    }

    if (takeTestForm) {
        takeTestForm.addEventListener("submit", async function(event) {
            event.preventDefault();
            const formData = new FormData(takeTestForm);
            const answers = [];

            document.querySelectorAll(".question-item").forEach(item => {
                const questionId = item.dataset.id;
                const answer = item.querySelector("input[name='answer-" + questionId + "']:checked").value;
                answers.push({ question_id: parseInt(questionId), answer, test_id: currentTestId });
            });

            try {
                const response = await fetch("/submit-test", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ answers })
                });

                if (response.ok) {
                    const result = await response.json();
                    alert(`Your score: ${result.score}/${result.total}`);
                    window.location.href = "/";
                } else {
                    alert("Failed to submit answers");
                }
            } catch (error) {
                console.error("Error submitting answers:", error);
                alert("An error occurred while submitting answers.");
            }
        });

        const testId = window.location.pathname.split("/").pop();
        currentTestId = testId;
        loadTest(testId);
    }

    if (testList) {
        loadTests();
    }

    async function loadTests() {
        const response = await fetch("/tests");
        const tests = await response.json();

        tests.forEach(test => {
            const testButton = document.createElement("a");
            testButton.classList.add("test-button");
            testButton.href = `/take-test/${test.id}`;
            testButton.textContent = test.title;
            testList.appendChild(testButton);
        });
    }

    async function loadTest(testId) {
        const response = await fetch(`/tests/${testId}`);
        const test = await response.json();

        testTitle.textContent = test.title;

        test.questions.forEach((question, index) => {
            const questionItem = document.createElement("div");
            questionItem.classList.add("question-item");
            questionItem.dataset.id = index;

            questionItem.innerHTML = `
                <label>${question.question}</label>
                ${question.options.map((option, i) => `
                    <div class="option">
                        <input type="radio" name="answer-${index}" value="${option}" required>
                        <label>${option}</label>
                    </div>
                `).join('')}
            `;

            questionsContainer.appendChild(questionItem);
        });
    }
});

function addQuestion() {
    const questionsContainer = document.getElementById("questions-container");
    const questionItem = document.createElement("div");
    questionItem.classList.add("question-item");

    questionItem.innerHTML = `
        <label>Question</label>
        <input type="text" name="question" required>
        <label>Options</label>
        <div class="options-container">
            <div class="option-item">
                <input type="text" name="option" required>
                <button type="button" class="add-option-btn">+</button>
            </div>
        </div>
        <label>Correct Answer</label>
        <input type="text" name="correct_answer" required>
    `;

    questionsContainer.appendChild(questionItem);
}
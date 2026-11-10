
const assert = require("node:assert/strict");

const {
    submitQuiz,
    calculateScore,
    displayResult
} = require("./quiz");

const questions = [
    { id: 1, correctAnswer: "A" },
    { id: 2, correctAnswer: "B" },
    { id: 3, correctAnswer: "C" }
];

// TEST-01: Validate answers and unanswered questions
function testAnswerValidation() {
    const answers = {
        1: "A",
        2: "B"
    };

    const result = submitQuiz(questions, answers);

    assert.equal(result.isSubmitted, true);
    assert.equal(result.unansweredCount, 1);

    console.log("TEST-01 passed");
}

// TEST-04: All answers correct
function testAllCorrect() {
    const answers = {
        1: "A",
        2: "B",
        3: "C"
    };

    const result = calculateScore(questions, answers);

    assert.equal(result.correct, 3);
    assert.equal(result.incorrect, 0);
    assert.equal(result.unanswered, 0);
    assert.equal(result.score, 3);

    console.log("All correct test passed");
}

// TEST-04: Some correct and some incorrect
function testPartiallyCorrect() {
    const answers = {
        1: "A",
        2: "C",
        3: "C"
    };

    const result = calculateScore(questions, answers);

    assert.equal(result.correct, 2);
    assert.equal(result.incorrect, 1);
    assert.equal(result.unanswered, 0);
    assert.equal(result.score, 2);

    console.log("Partially correct test passed");
}

// TEST-01: All questions unanswered
function testAllUnanswered() {
    const result = calculateScore(questions, {});

    assert.equal(result.correct, 0);
    assert.equal(result.incorrect, 0);
    assert.equal(result.unanswered, 3);
    assert.equal(result.score, 0);

    console.log("All unanswered test passed");
}

// Empty quiz
function testEmptyQuiz() {
    const result = calculateScore([], {});

    assert.equal(result.totalQuestions, 0);
    assert.equal(result.score, 0);

    console.log("Empty quiz test passed");
}

// TEST-07: Verify result display
function testDisplayResult() {
    const result = calculateScore(questions, {
        1: "A",
        2: "B",
        3: "C"
    });

    const container = { textContent: "" };

    displayResult(result, container);

    assert.ok(container.textContent.includes("Final Score: 3"));

    console.log("Result display test passed");
}

// Run all tests
testAnswerValidation();
testAllCorrect();
testPartiallyCorrect();
testAllUnanswered();
testEmptyQuiz();
testDisplayResult();

console.log("\nAll tests passed successfully!");

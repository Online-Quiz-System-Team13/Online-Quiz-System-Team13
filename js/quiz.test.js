
const {
    submitQuiz,
    calculateScore
} = require("./quiz");

// Sample quiz questions
const questions = [
    { id: 1, correctAnswer: "A" },
    { id: 2, correctAnswer: "B" },
    { id: 3, correctAnswer: "C" }
];

// TEST-01: Validate submitted and unanswered answers
function testAnswerValidation() {
    const answers = {
        1: "A",
        2: "B"
    };

    const result = submitQuiz(questions, answers);

    console.assert(result.isSubmitted === true,
        "Quiz should be submitted");

    console.assert(result.unansweredCount === 1,
        "One question should be unanswered");

    console.log("TEST-01 passed");
}

// TEST-04: Verify score calculation and data integrity
function testScoreCalculation() {
    const answers = {
        1: "A",
        2: "C",
        3: "C"
    };

    const result = calculateScore(questions, answers);

    console.assert(result.totalQuestions === 3,
        "Total questions should be 3");

    console.assert(result.correct === 2,
        "Correct answers should be 2");

    console.assert(result.incorrect === 1,
        "Incorrect answers should be 1");

    console.assert(result.unanswered === 0,
        "Unanswered questions should be 0");

    console.assert(result.score === 2,
        "Score should be 2");

    console.log("TEST-04 passed");
}

testAnswerValidation();
testScoreCalculation();

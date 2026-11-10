// FR-05: Submit Quiz
// Input: questions array and selectedAnswers object (question ID -> selected option)
// Output: submitted answers, unanswered question count, and submission status
function submitQuiz(questions, selectedAnswers) {
    const unanswered = questions.filter(
        question => selectedAnswers[question.id] === undefined ||
                    selectedAnswers[question.id] === null ||
                    selectedAnswers[question.id] === ""
    );

    return {
        answers: selectedAnswers,
        unansweredCount: unanswered.length,
        isSubmitted: true
    };
}

// FR-06: Calculate Score
// Input: questions array and answers object
// Output: total, correct, incorrect, unanswered counts, and final score
function calculateScore(questions, answers) {
    let correct = 0;
    let incorrect = 0;
    let unanswered = 0;

    questions.forEach(question => {
        const answer = answers[question.id];

        if (answer === undefined || answer === null || answer === "") {
            unanswered++;
        } else if (answer === question.correctAnswer) {
            correct++;
        } else {
            incorrect++;
        }
    });

    return {
        totalQuestions: questions.length,
        correct: correct,
        incorrect: incorrect,
        unanswered: unanswered,
        score: correct
    };
}

// FR-07: Display Result
// Input: calculated result object and HTML container
// Output: displays the quiz result inside the container
function displayResult(result, container) {
    container.textContent =
        "Quiz Result\n" +
        "Total Questions: " + result.totalQuestions + "\n" +
        "Correct Answers: " + result.correct + "\n" +
        "Incorrect Answers: " + result.incorrect + "\n" +
        "Unanswered Questions: " + result.unanswered + "\n" +
        "Final Score: " + result.score;
}

// Make functions available for testing and integration
if (typeof module !== "undefined") {
    module.exports = {
        submitQuiz,
        calculateScore,
        displayResult
    };
}
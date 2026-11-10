
(function (root, factory) {
    const api = factory();

    if (typeof module !== "undefined" && module.exports) {
        module.exports = api;
    }

    if (root) {
        root.QuizStart = api;
    }
}(typeof globalThis !== "undefined" ? globalThis : this, function () {
    "use strict";

    // FR-01: Start Quiz
    function startQuiz(questions) {
        if (!Array.isArray(questions) || questions.length === 0) {
            throw new TypeError(
                "At least one question is required to start the quiz."
            );
        }

        return {
            questions: questions,
            currentIndex: 0,
            selectedAnswers: {},
            isStarted: true,
            isSubmitted: false
        };
    }

    return {
        startQuiz: startQuiz
    };
}));

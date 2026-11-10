
(function (root, factory) {
    const api = factory();

    if (typeof module !== "undefined" && module.exports) {
        module.exports = api;
    }

    if (root) {
        root.QuizDisplay = api;
    }
}(typeof globalThis !== "undefined" ? globalThis : this, function () {
    "use strict";

    // FR-02: Display Questions
    function displayQuestion(container, quizState, modules, onNavigate) {

        if (!container || !container.ownerDocument) {
            throw new TypeError("A valid HTML container is required.");
        }

        if (!quizState || quizState.isStarted !== true) {
            throw new Error("Start the quiz before displaying questions.");
        }

        if (!Array.isArray(quizState.questions) ||
            quizState.questions.length === 0) {
            throw new TypeError("No questions are available.");
        }

        const index = quizState.currentIndex;

        if (!Number.isInteger(index) ||
            index < 0 ||
            index >= quizState.questions.length) {
            throw new RangeError("Invalid question index.");
        }

        if (!modules ||
            !modules.answerSelection ||
            !modules.navigation) {
            throw new TypeError("Answer selection and navigation modules are required.");
        }

        const question = quizState.questions[index];

        if (!question ||
            question.id === undefined ||
            typeof question.text !== "string" ||
            !Array.isArray(question.options) ||
            question.options.length === 0) {
            throw new TypeError("Invalid question data.");
        }

        const doc = container.ownerDocument;

        const heading = doc.createElement("h2");
        heading.textContent =
            "Question " + (index + 1) +
            " of " + quizState.questions.length;

        const questionText = doc.createElement("p");
        questionText.textContent = question.text;

        const answerContainer = doc.createElement("div");
        const navigationContainer = doc.createElement("div");

        container.replaceChildren(
            heading,
            questionText,
            answerContainer,
            navigationContainer
        );

        // Reuse Srishti's answer-selection module.
        modules.answerSelection.renderAnswerSelection(
            answerContainer,
            question,
            quizState.selectedAnswers
        );

        // Reuse Srishti's navigation module.
        modules.navigation.renderQuestionNavigation(
            navigationContainer,
            quizState.questions,
            quizState.selectedAnswers,
            index,
            function (nextIndex) {
                quizState.currentIndex = nextIndex;

                if (typeof onNavigate === "function") {
                    onNavigate(nextIndex);
                }

                displayQuestion(
                    container,
                    quizState,
                    modules,
                    onNavigate
                );
            }
        );

        return question;
    }

    return {
        displayQuestion: displayQuestion
    };
}));

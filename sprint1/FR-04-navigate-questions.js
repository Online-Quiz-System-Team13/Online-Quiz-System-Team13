(function (root, factory) {
    const api = factory();

    if (typeof module !== "undefined" && module.exports) {
        module.exports = api;
    }
    if (root) {
        root.QuizQuestionNavigation = api;
    }
}(typeof globalThis !== "undefined" ? globalThis : this, function () {
    "use strict";

    function isAnswered(selectedAnswers, questionId) {
        const answer = selectedAnswers[questionId];
        return answer !== undefined && answer !== null && answer !== "";
    }

    function getNavigationState(questions, selectedAnswers, currentIndex) {
        if (!Array.isArray(questions) || questions.length === 0) {
            throw new TypeError("At least one question is required for navigation.");
        }
        if (!selectedAnswers || typeof selectedAnswers !== "object") {
            throw new TypeError("selectedAnswers must be an object.");
        }
        if (!Number.isInteger(currentIndex) || currentIndex < 0 || currentIndex >= questions.length) {
            throw new RangeError("currentIndex must identify a question in the list.");
        }

        return {
            currentIndex: currentIndex,
            canGoPrevious: currentIndex > 0,
            canGoNext: currentIndex < questions.length - 1,
            questions: questions.map(function (question, index) {
                return {
                    id: question.id,
                    index: index,
                    isCurrent: index === currentIndex,
                    isAnswered: isAnswered(selectedAnswers, question.id)
                };
            })
        };
    }

    function renderQuestionNavigation(container, questions, selectedAnswers, currentIndex, onNavigate) {
        if (!container || !container.ownerDocument) {
            throw new TypeError("A DOM element is required to render question navigation.");
        }
        if (typeof onNavigate !== "function") {
            throw new TypeError("onNavigate must be a function.");
        }

        const state = getNavigationState(questions, selectedAnswers, currentIndex);
        const doc = container.ownerDocument;
        const nav = doc.createElement("nav");
        nav.setAttribute("aria-label", "Question navigation");

        function addButton(text, index, disabled, label) {
            const button = doc.createElement("button");
            button.type = "button";
            button.textContent = text;
            button.disabled = disabled;
            if (label) {
                button.setAttribute("aria-label", label);
            }
            button.addEventListener("click", function () {
                onNavigate(index);
            });
            nav.appendChild(button);
        }

        addButton("Previous", currentIndex - 1, !state.canGoPrevious, "Previous question");
        state.questions.forEach(function (question) {
            const answered = question.isAnswered;
            addButton(
                String(question.index + 1),
                question.index,
                false,
                "Question " + (question.index + 1) + (answered ? ", answered" : ", unanswered")
            );
            const button = nav.lastChild;
            if (question.isCurrent) {
                button.setAttribute("aria-current", "step");
            }
            button.classList.toggle("is-answered", answered);
        });
        addButton("Next", currentIndex + 1, !state.canGoNext, "Next question");

        container.replaceChildren(nav);
        return nav;
    }

    return {
        getNavigationState: getNavigationState,
        renderQuestionNavigation: renderQuestionNavigation
    };
}));

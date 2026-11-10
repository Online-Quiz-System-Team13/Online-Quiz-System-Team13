(function (root, factory) {
    const api = factory();

    if (typeof module !== "undefined" && module.exports) {
        module.exports = api;
    }
    if (root) {
        root.AdminQuestionList = api;
    }
}(typeof globalThis !== "undefined" ? globalThis : this, function () {
    "use strict";

    function getPrompt(question) {
        return question.text || question.question || question.questionText;
    }

    function renderQuestionList(container, questions) {
        if (!container || !container.ownerDocument) {
            throw new TypeError("A DOM element is required to render the question list.");
        }
        if (!Array.isArray(questions)) {
            throw new TypeError("questions must be an array.");
        }

        const doc = container.ownerDocument;
        const heading = doc.createElement("h2");
        heading.textContent = "Questions";
        const list = doc.createElement("ol");

        questions.forEach(function (question) {
            const prompt = question && getPrompt(question);
            if (typeof prompt !== "string" || prompt.trim() === "") {
                throw new TypeError("Each question must have non-empty question text.");
            }
            const item = doc.createElement("li");
            item.textContent = prompt;
            list.appendChild(item);
        });

        if (questions.length === 0) {
            const emptyMessage = doc.createElement("p");
            emptyMessage.textContent = "No questions have been added.";
            container.replaceChildren(heading, emptyMessage);
            return 0;
        }

        container.replaceChildren(heading, list);
        return questions.length;
    }

    return { renderQuestionList: renderQuestionList };
}));

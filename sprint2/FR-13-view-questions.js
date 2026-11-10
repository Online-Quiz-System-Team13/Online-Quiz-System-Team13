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

    function renderQuestionList(container, questions, options) {
        if (!container || !container.ownerDocument) {
            throw new TypeError("A DOM element is required to render the question list.");
        }
        if (!Array.isArray(questions)) {
            throw new TypeError("questions must be an array.");
        }

        const settings = options || {};
        if (settings.renderItem !== undefined && typeof settings.renderItem !== "function") {
            throw new TypeError("renderItem must be a function.");
        }

        const doc = container.ownerDocument;
        const list = doc.createElement("ol");
        list.className = "question-list-items";
        const content = [];

        if (settings.showHeading !== false) {
            const heading = doc.createElement("h2");
            heading.textContent = "Questions";
            content.push(heading);
        }

        questions.forEach(function (question) {
            const prompt = question && getPrompt(question);
            if (typeof prompt !== "string" || prompt.trim() === "") {
                throw new TypeError("Each question must have non-empty question text.");
            }
            const item = doc.createElement("li");
            if (settings.renderItem) {
                settings.renderItem(item, question, doc);
            } else {
                item.textContent = prompt;
            }
            list.appendChild(item);
        });

        if (questions.length === 0) {
            const emptyMessage = doc.createElement("p");
            emptyMessage.textContent = "No questions have been added.";
            emptyMessage.className = "empty-state";
            content.push(emptyMessage);
            container.replaceChildren.apply(container, content);
            return 0;
        }

        content.push(list);
        container.replaceChildren.apply(container, content);
        return questions.length;
    }

    return { renderQuestionList: renderQuestionList };
}));

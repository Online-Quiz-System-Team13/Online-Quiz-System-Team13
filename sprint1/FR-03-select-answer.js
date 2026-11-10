(function (root, factory) {
    const api = factory();

    if (typeof module !== "undefined" && module.exports) {
        module.exports = api;
    }
    if (root) {
        root.QuizAnswerSelection = api;
    }
}(typeof globalThis !== "undefined" ? globalThis : this, function () {
    "use strict";

    let nextGroupId = 0;

    function selectAnswer(selectedAnswers, questionId, answer) {
        if (!selectedAnswers || typeof selectedAnswers !== "object") {
            throw new TypeError("selectedAnswers must be an object.");
        }
        selectedAnswers[questionId] = answer;
        return selectedAnswers;
    }

    function renderAnswerSelection(container, question, selectedAnswers) {
        if (!container || !container.ownerDocument) {
            throw new TypeError("A DOM element is required to render answer options.");
        }
        if (!question || question.id === undefined || !Array.isArray(question.options) || question.options.length === 0) {
            throw new TypeError("A question with an id and at least one option is required.");
        }
        if (!selectedAnswers || typeof selectedAnswers !== "object") {
            throw new TypeError("selectedAnswers must be an object.");
        }

        const doc = container.ownerDocument;
        const fieldset = doc.createElement("fieldset");
        const legend = doc.createElement("legend");
        legend.textContent = "Choose one answer";
        fieldset.appendChild(legend);
        const groupName = "quiz-answer-" + (++nextGroupId);

        question.options.forEach(function (option, index) {
            const value = option && typeof option === "object"
                ? (option.value !== undefined ? option.value : option.id)
                : option;
            const labelText = option && typeof option === "object"
                ? (option.label !== undefined ? option.label : option.text)
                : option;

            if (value === undefined || labelText === undefined || labelText === null) {
                throw new TypeError("Each answer option must be a value or have value/id and label/text.");
            }

            const label = doc.createElement("label");
            const input = doc.createElement("input");
            input.type = "radio";
            input.name = groupName;
            input.value = String(value);
            input.checked = selectedAnswers[question.id] === value;
            input.addEventListener("change", function () {
                selectAnswer(selectedAnswers, question.id, value);
            });
            label.append(input, doc.createTextNode(" " + String(labelText)));
            fieldset.appendChild(label);

            if (index < question.options.length - 1) {
                fieldset.appendChild(doc.createElement("br"));
            }
        });

        container.replaceChildren(fieldset);
        return fieldset;
    }

    return {
        selectAnswer: selectAnswer,
        renderAnswerSelection: renderAnswerSelection
    };
}));

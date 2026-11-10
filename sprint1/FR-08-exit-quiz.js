(function (root, factory) {
    const api = factory();

    if (typeof module !== "undefined" && module.exports) {
        module.exports = api;
    }
    if (root) {
        root.QuizExit = api;
    }
}(typeof globalThis !== "undefined" ? globalThis : this, function () {
    "use strict";

    function renderExitButton(container, selectedAnswers, onExit, confirmExit) {
        if (!container || !container.ownerDocument) {
            throw new TypeError("A DOM element is required to render the exit button.");
        }
        if (!selectedAnswers || typeof selectedAnswers !== "object") {
            throw new TypeError("selectedAnswers must be an object.");
        }
        if (typeof onExit !== "function") {
            throw new TypeError("onExit must be a function.");
        }

        const doc = container.ownerDocument;
        const askToExit = confirmExit || function (message) {
            return doc.defaultView.confirm(message);
        };
        if (typeof askToExit !== "function") {
            throw new TypeError("confirmExit must be a function.");
        }

        const button = doc.createElement("button");
        button.type = "button";
        button.textContent = "Exit quiz";
        button.addEventListener("click", function () {
            const confirmed = askToExit("Exit this quiz? Any unsaved answers may be lost.");
            if (confirmed) {
                onExit(selectedAnswers);
            }
        });
        container.replaceChildren(button);
        return button;
    }

    return { renderExitButton: renderExitButton };
}));

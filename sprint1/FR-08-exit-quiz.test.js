
const assert = require("node:assert/strict");
const test = require("node:test");
const { renderExitButton } = require("./FR-08-exit-quiz");

function createMockContainer() {
    const doc = {
        defaultView: {
            confirm: () => true
        },
        createElement: function (tag) {
            return {
                tagName: tag.toUpperCase(),
                type: "",
                textContent: "",
                listeners: {},
                addEventListener: function (event, callback) {
                    this.listeners[event] = callback;
                },
                click: function () {
                    this.listeners.click();
                }
            };
        }
    };

    return {
        ownerDocument: doc,
        children: [],
        replaceChildren: function (...elements) {
            this.children = elements;
        }
    };
}

test("FR-08 renders the Exit Quiz button", function () {
    const container = createMockContainer();

    const button = renderExitButton(container, {}, function () {});

    assert.equal(button.textContent, "Exit quiz");
    assert.equal(button.type, "button");
    assert.equal(container.children[0], button);
});

test("FR-08 exits when the user confirms", function () {
    const container = createMockContainer();
    const answers = { 1: "A", 2: "B" };
    let receivedAnswers;

    const button = renderExitButton(
        container,
        answers,
        function (selectedAnswers) {
            receivedAnswers = selectedAnswers;
        },
        function () {
            return true;
        }
    );

    button.click();

    assert.equal(receivedAnswers, answers);
});

test("FR-08 does not exit when the user cancels", function () {
    const container = createMockContainer();
    let exited = false;

    const button = renderExitButton(
        container,
        {},
        function () {
            exited = true;
        },
        function () {
            return false;
        }
    );

    button.click();

    assert.equal(exited, false);
});

test("FR-08 rejects an invalid container", function () {
    assert.throws(function () {
        renderExitButton(null, {}, function () {});
    }, TypeError);
});

test("FR-08 rejects invalid selected answers", function () {
    const container = createMockContainer();

    assert.throws(function () {
        renderExitButton(container, null, function () {});
    }, TypeError);
});

test("FR-08 rejects an invalid exit callback", function () {
    const container = createMockContainer();

    assert.throws(function () {
        renderExitButton(container, {}, null);
    }, TypeError);
});

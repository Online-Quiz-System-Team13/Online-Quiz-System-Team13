const assert = require("node:assert/strict");
const test = require("node:test");
const { renderQuestionList } = require("./FR-13-view-questions");

function createDocument() {
    return {
        createElement: function (tagName) {
            return {
                tagName: tagName.toUpperCase(),
                children: [],
                className: "",
                textContent: "",
                appendChild: function (child) {
                    this.children.push(child);
                }
            };
        }
    };
}

function createContainer() {
    const ownerDocument = createDocument();
    return {
        ownerDocument: ownerDocument,
        children: [],
        replaceChildren: function () {
            this.children = Array.from(arguments);
        }
    };
}

test("FR-13 renders the questions used by the admin question bank", function () {
    const container = createContainer();
    const count = renderQuestionList(container, [
        { id: 1, text: "Which planet is the Red Planet?" }
    ]);

    assert.equal(count, 1);
    assert.equal(container.children[0].textContent, "Questions");
    assert.equal(container.children[1].tagName, "OL");
    assert.equal(container.children[1].children[0].textContent, "Which planet is the Red Planet?");
});

test("FR-13 supports custom admin question cards without a duplicate heading", function () {
    const container = createContainer();
    const count = renderQuestionList(
        container,
        [{ id: 7, text: "What is 2 + 2?" }],
        {
            showHeading: false,
            renderItem: function (item, question) {
                item.className = "question";
                item.textContent = question.id + ". " + question.text;
            }
        }
    );

    assert.equal(count, 1);
    assert.equal(container.children.length, 1);
    assert.equal(container.children[0].className, "question-list-items");
    assert.equal(container.children[0].children[0].textContent, "7. What is 2 + 2?");
});

test("FR-13 shows an empty state and validates custom renderers", function () {
    const container = createContainer();

    assert.equal(renderQuestionList(container, [], { showHeading: false }), 0);
    assert.equal(container.children[0].className, "empty-state");
    assert.throws(function () {
        renderQuestionList(createContainer(), [], { renderItem: true });
    }, /renderItem must be a function/);
});

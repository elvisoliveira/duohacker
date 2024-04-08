window.actions.partialReverseTranslate = (challenge) => {
    const { displayTokens, grader } = challenge;
    let tokens = document.querySelectorAll("[contenteditable=true]");
    let value = '';
    let event = new Event("input", { bubbles: true });
    event.simulated = true;
    displayTokens.forEach((token) => {
        if (token.isBlank) {
            value = value + token.text;
        }
    });
    try {
        tokens[0].textContent = value;
        tokens[0].dispatchEvent(event);
    } catch (e) { /* terminal.log(e); */ }
    return { displayTokens, grader };
};
window.actions.assist =
window.actions.definition = (challenge) => {
    const { choices, correctIndex } = challenge;
    const tokens = document.querySelectorAll(window.keys.CHALLENGE_CHOICE);
    tokens.forEach((e, i) => {
        if (i == correctIndex)
            e.dispatchEvent(clickEvent);
    });
    return { choices, correctIndex };
};
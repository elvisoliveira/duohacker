window.actions.tapComplete = (challenge) => {
    const { choices, correctIndices } = challenge;
    const tokens = document.querySelectorAll(window.keys.WORD_BANK.concat(' ', CHALLENGE_TAP_TOKEN_TEXT));
    correctIndices.forEach((i) => {
        tokens[i].dispatchEvent(clickEvent);
    });
    return { choices, correctIndices };
};
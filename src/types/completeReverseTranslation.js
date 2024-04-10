window.actions.completeReverseTranslation = (challenge) => {
    const { displayTokens } = challenge;
    const tokens = document.querySelectorAll(window.keys.CHALLENGE_TEXT_INPUT);
    let i = 0;
    displayTokens.forEach((token) => {
        if (token.isBlank) {
            dynamicInput(tokens[i], token.text);
            i++;
        }
    });
    return { displayTokens };
};
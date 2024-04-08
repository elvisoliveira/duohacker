window.actions.listenComplete = (challenge) => {
    const { displayTokens } = challenge;
    let tokens = document.querySelectorAll(window.keys.CHALLENGE_TEXT_INPUT);
    var i = 0;
    displayTokens.forEach((token) => {
        if (token.isBlank) {
            dynamicInput(tokens[i], token.text);
        }
    });
    return { displayTokens };
};
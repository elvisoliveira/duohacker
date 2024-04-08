window.actions.tapClozeTable = (challenge) => {
    const { displayTokens } = challenge;
    const tokens = document.querySelectorAll(window.keys.CHALLENGE_TAP_TOKEN_TEXT);
    displayTokens.forEach((line) => {
        line.forEach((column) => {
            column.forEach((word) => {
                if (word.damageStart) {
                    tokens.forEach((token) => {
                        if (token.innerText == word.text.substring(word.damageStart, word.text.length)) {
                            token.dispatchEvent(clickEvent);
                        }
                    });
                }
            });
        });
    });
    return { displayTokens };
};
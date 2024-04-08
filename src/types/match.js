window.actions.match = (challenge) => {
    const { pairs } = challenge;
    const tokens = document.querySelectorAll(window.keys.CHALLENGE_TAP_TOKEN_TEXT);
    pairs.forEach((pair) => {
        for (let i = 0; i < tokens.length; i++) {
            if (
                tokens[i].innerText === pair.fromToken ||
                tokens[i].innerText === pair.learningToken
            ) {
                tokens[i].dispatchEvent(clickEvent);
            }
        }
    });
    return { pairs };
};
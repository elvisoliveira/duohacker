window.actions.characterMatch = (challenge) => {
    const { pairs } = challenge;
    const tokens = document.querySelectorAll(window.keys.CHALLENGE_TAP_TOKEN);
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
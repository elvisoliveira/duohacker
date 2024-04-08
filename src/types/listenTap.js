window.actions.listenTap = (challenge) => {
    const { correctTokens } = challenge;
    const tokens = Array.from(document.querySelectorAll(window.keys.CHALLENGE_TAP_TOKEN)).filter(e => e.tagName === 'BUTTON');
    for (let word of correctTokens) {
        for (let i of Object.keys(tokens)) {
            if (tokens[i].innerText === word) {
                tokens[i].dispatchEvent(clickEvent);
                tokens.splice(i, 1);
                break;
            }
        }
    }
    return { correctTokens };
};
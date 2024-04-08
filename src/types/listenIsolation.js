window.actions.listenIsolation = (challenge) => {
    const { correctIndex } = challenge;
    const tokens = document.querySelectorAll(window.keys.CHALLENGE_CHOICE);
    tokens.forEach((e, i) => {
        if (i == correctIndex) {
            e.dispatchEvent(clickEvent);
        }
    });
    return { correctIndex };
};
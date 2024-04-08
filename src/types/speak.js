window.actions.speak = (challenge) => {
    const { prompt } = challenge;
    document.querySelectorAll(window.keys.PLAYER_SKIP)[0].dispatchEvent(clickEvent);
    return { prompt };
};
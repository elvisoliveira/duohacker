window.actions.select =
window.actions.gapFill =
window.actions.readComprehension =
window.actions.selectPronunciation =
window.actions.listenComprehension =
window.actions.characterSelect = (challenge) => {
    const { choices, correctIndex } = challenge;
    const { CHALLENGE_CHOICE } = window.keys;
    document.querySelectorAll(CHALLENGE_CHOICE)[correctIndex].dispatchEvent(clickEvent);
    return { choices, correctIndex };
};
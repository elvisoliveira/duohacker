window.actions.selectTranscription = (challenge) => {
    const { choices, correctIndex } = challenge;
    document.querySelectorAll(window.keys.CHALLENGE_JUDGE_TEXT)[correctIndex].dispatchEvent(clickEvent);
    return { choices, correctIndex };
};
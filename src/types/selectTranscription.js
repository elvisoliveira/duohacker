window.actions.selectTranscription = (challenge) => {
    const { choices, correctIndex: i } = challenge;
    document.querySelectorAll(window.keys.CHALLENGE_JUDGE_TEXT)[i].dispatchEvent(clickEvent);
    return { choices, i };
};
window.actions.judge = (challenge) => {
    const { correctIndices } = challenge;
    document.querySelectorAll(window.keys.CHALLENGE_JUDGE_TEXT)[correctIndices[0]].dispatchEvent(clickEvent);
    return { correctIndices };
};
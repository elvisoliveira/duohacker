window.actions.listen = (challenge) => {
    const { prompt } = challenge;
    let textInputElement = document.querySelectorAll(window.keys.CHALLENGE_TRANSLATE_INPUT)[0];
    dynamicInput(textInputElement, prompt);
    return { prompt };
};
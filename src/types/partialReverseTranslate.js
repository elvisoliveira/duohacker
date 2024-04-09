window.actions.partialReverseTranslate = (challenge) => {
    const { displayTokens, grader } = challenge;
    let tokens = document.querySelectorAll('[contenteditable=true]');
    let value = '';
    displayTokens.forEach((token) => {
        if (token.isBlank)
            value = value + token.text;
    });
    dynamicInput(tokens[0], value);
    return { displayTokens, grader };
};
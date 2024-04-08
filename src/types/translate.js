window.actions.translate = (challenge) => {
    const { correctTokens, correctSolutions } = challenge;
    if (correctTokens) {
        const tokens = document.querySelectorAll(window.keys.CHALLENGE_TAP_TOKEN_TEXT);
        let ignoreTokeIndexes = [];
        for (let correctTokenIndex in correctTokens) {
            for (let tokenIndex in tokens) {
                const token = tokens[tokenIndex];
                if (ignoreTokeIndexes.includes(tokenIndex)) continue;
                if (token.innerText === correctTokens[correctTokenIndex]) {
                    token.dispatchEvent(clickEvent);
                    ignoreTokeIndexes.push(tokenIndex);
                    break;
                }
            }
        }
    } else if (correctSolutions) {
        let textInputElement = document.querySelectorAll(
            window.keys.CHALLENGE_TRANSLATE_INPUT
        )[0];
        dynamicInput(textInputElement, correctSolutions[0]);
    }
    return { correctTokens };
};
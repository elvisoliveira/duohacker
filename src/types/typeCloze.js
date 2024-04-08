window.actions.typeCloze = (challenge) => {
    const { displayTokens } = challenge;
    const tokens = document.querySelectorAll(window.keys.CHALLENGE_TYPE_CLOZE.concat(' input'));
    let i = 0;
    displayTokens.forEach((word) => {
        if (word.damageStart) {
            dynamicInput(tokens[i], word.text.substring(word.damageStart, word.text.length));
            i++;
        }
    });
    return { displayTokens };
};
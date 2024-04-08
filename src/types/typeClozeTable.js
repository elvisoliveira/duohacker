window.actions.typeClozeTable = (challenge) => {
    const { displayTokens } = challenge;
    const tokens = document.querySelectorAll(window.keys.CHALLENGE_TYPE_CLOZE_TABLE.concat(' input'));
    let i = 0;
    displayTokens.forEach((line) => {
        line.forEach((column) => {
            column.forEach((word) => {
                if (word.damageStart) {
                    dynamicInput(tokens[i], word.text.substring(word.damageStart, word.text.length));
                    i++;
                }
            });
        });
    });
    return { displayTokens };
};
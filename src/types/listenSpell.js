window.actions.listenSpell = (challenge) => {
    const { displayTokens } = challenge;
    const tokens = document.querySelectorAll(window.keys.CHALLENGE_LISTEN_SPELL.concat(' input[type="text"]:not([readonly])'));
    let i = 0;
    displayTokens.forEach((word) => {
        if (!isNaN(word.damageStart)) {
            for (let c of word.text.substring(word.damageStart, word.damageEnd ?? word.text.length)) {
                dynamicInput(tokens[i], c);
                i++;
            }
        }
    });
    return { displayTokens };
};
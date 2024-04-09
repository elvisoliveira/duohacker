window.actions.tapCompleteTable = (challenge) => {
    const { choices, displayTokens } = challenge;
    const tokens = document.querySelectorAll(window.keys.WORD_BANK.concat(' ', window.keys.CHALLENGE_TAP_TOKEN));
    displayTokens.forEach((line) => {
        line.forEach((column) => {
            if (column[0].isBlank == true) {
                tokens.forEach((e) => {
                    if (e.innerText == column[0].text) {
                        e.dispatchEvent(clickEvent);
                    }
                });
            }
        });
    });
    return { choices, displayTokens };
};
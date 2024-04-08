window.actions.tapCloze = (challenge) => {
    const { choices, correctIndices } = challenge;
    const tokens = document.querySelectorAll(window.keys.CHALLENGE_TAP_TOKEN);
    for (let i = 0; i < correctIndices.length; i++) {
        choices.forEach((value, j) => {
            if (correctIndices[i] == j) {
                for (let k = 0; k < tokens.length; k++) {
                    if (tokens[k].innerText == value) {
                        tokens[k].dispatchEvent(clickEvent);
                    }
                }
            }
        });
    };
    return { choices, correctIndices };
};
window.actions.typeCompleteTable = (challenge) => {
    const { displayTokens } = challenge;
    const tokens = document.querySelectorAll(window.keys.TYPE_COMPLETE_TABLE.concat(' input'));
    let index = 0;
    displayTokens.forEach((line) => {
        line.forEach((column) => {
            if (column[0].isBlank == true) {
                dynamicInput(tokens[index], column[0].text);
                index++;
            }
        });
    });
    return { displayTokens };
};
window.actions.listenMatch = (challenge) => {
    const { pairs } = challenge;
    const tokens = document.querySelectorAll('button'.concat(window.keys.CHALLENGE_TAP_TOKEN));
    for (let i = 0; i <= 3; i++) {
        const dataset = getReactFiber(tokens[i]).return.child.stateNode.dataset.test;
        const word = dataset.split('-')[0];
        tokens[i].dispatchEvent(clickEvent);
        for (let j = 4; j <= 7; j++) {
            const text = tokens[j].querySelector(window.keys.CHALLENGE_TAP_TOKEN_TEXT).innerText;
            if (/\s/g.test(dataset) && text.endsWith(` ${word}`)) {
                tokens[j].dispatchEvent(clickEvent);
            } else if (text == word) {
                tokens[j].dispatchEvent(clickEvent);
            }
        }
    }
    return { pairs }
};
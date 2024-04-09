import { keys } from './keys.js';

const TIME_OUT = 3000;

window.dynamicInput = (element, text) => {
    let input = element;
    let lastValue = input.value;
    input.value = text;
    let event = new Event('input', { bubbles: true });
    event.simulated = true;
    let tracker = input._valueTracker;
    if (tracker) {
        tracker.setValue(lastValue);
    }
    input.dispatchEvent(event);
}

window.clickEvent = new MouseEvent('click', {
    view: window,
    bubbles: true,
    cancelable: true,
});

// https://stackoverflow.com/a/39165137
// https://github.com/Venryx/mobx-devtools-advanced/blob/master/Docs/TreeTraversal.md
window.getReactFiber = (dom) => {
    const key = Object.keys(dom).find((key) => {
        return (
            key.startsWith('__reactFiber$') || // react 17+
            key.startsWith('__reactInternalInstance$') // react <17
        );
    });
    return dom[key];
}

// Gets Challenge Object
function getElementIndex(element) {
    let result = null;
    if (element instanceof Array) {
        for (let i = 0; i < element.length; i++) {
            result = getElementIndex(element[i]);
            if (result) break;
        }
    } else {
        for (let prop in element) {
            if (prop == 'challenge') {
                if (typeof element[prop] == 'object')
                    return element;
                return element[prop];
            }
            if (element[prop] instanceof Object || element[prop] instanceof Array) {
                result = getElementIndex(element[prop]);
                if (result) break;
            }
        }
    }
    return result;
}

function getProps(element) {
    let propsClass = Object.keys(element).filter((att) => /^__reactProps/g.test(att))[0];
    return element[propsClass];
}

// Gets the Challenge
function getChallenge() {
    const dataTestDOM = document.querySelectorAll(keys().CHALLENGE);
    if (dataTestDOM.length > 0) {
        let current = 0;
        for (let i = 0; i < dataTestDOM.length; i++) {
            if (dataTestDOM[i].childNodes.length > 0)
                current = i;
        }
        const currentDOM = dataTestDOM[current];
        const propsValues = getProps(currentDOM);
        const { challenge } = getElementIndex(propsValues);
        return challenge;
    }
}

// Solves the Challenge
function classify() {
    const challenge = getChallenge();
    if (!challenge) return;
    window.actions[challenge.type](challenge)
}

function pressEnter() {
    const clickEvent = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: false,
    });

    // Stops when an answer is incorrect
    const isIncorrect = document.querySelectorAll(keys().BLAME_INCORRECT).length > 0;
    if (isIncorrect) {
        terminal.log('Incorrect, stopped');
        clearInterval(mainInterval);
    }

    const isPlayerNext = document.querySelector(keys().PLAYER_NEXT);
    if (isPlayerNext !== null)
        isPlayerNext.dispatchEvent(clickEvent);
}

// Main Function
function main() {
    try {
        const isPlayerNext = document.querySelectorAll(keys().PLAYER_NEXT);
        const isAdScreen = document.querySelector([keys().PLUS_NO_THANKS, keys().PRACTICE_HUB_AD_NO_THANKS_BUTTON].join(','));
        if (isPlayerNext !== null && isPlayerNext.length > 0) {
            if (isPlayerNext[0].getAttribute('aria-disabled') === 'true')
                classify();
        } else if (isAdScreen !== null && isAdScreen.length > 0) {
            isAdScreen.click();
        }
        setTimeout(pressEnter, 150); // pressEnter();
    } catch (e) {
        // terminal.log(e);
    }
}

// To not mess duolingo's own log
function setConsole() {
    var iframe = document.createElement('iframe');
    iframe.id = 'logger';
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    window.terminal = iframe.contentWindow.console;
}

// Calls main()
let mainInterval;
function solveChallenge() {
    if (document.getElementById('logger') == null)
        setConsole();

    // Check if its a Skill / Alphabet / Checkpoint URL
    if (/lesson|practice/gi.test(window.location.href) == true) {
        clearInterval(mainInterval);
        mainInterval = setInterval(main, TIME_OUT);
    }

    if (/learn/gi.test(window.location.href) == true) {
        window.location.replace('__namespace/practice');
    }
}

(solveChallenge)();

window.keys = keys();
window.actions = {};
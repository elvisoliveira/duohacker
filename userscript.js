// ==UserScript==
// @name             Duohacker
// @namespace        https://www.duolingo.com/
// @homepageURL      https://github.com/elvisoliveira/duohacker
// @supportURL       https://github.com/elvisoliveira/duohacker/issues
// @version          1.0.7
// @description      An autoanswer script for Duolingo.
// @author           elvisoliveira
// @match            https://www.duolingo.com/practice*
// @match            https://www.duolingo.com/learn*
// @license          MIT
// @grant            none
// @run-at           document-end
// ==/UserScript==

const DEBUG = false;
let mainInterval;
const dataTestComponentClassName = ".e4VJZ, .FQpeZ, ._35e5D";
const TIME_OUT = 3000;

// Challenge types
const CHARACTER_SELECT_TYPE = "characterSelect";
const CHARACTER_MATCH_TYPE = "characterMatch";
const TRANSLATE_TYPE = "translate";
const LISTEN_TAP_TYPE = "listenTap";
const NAME_TYPE = "name";
const COMPLETE_REVERSE_TRANSLATION_TYPE = "completeReverseTranslation";
const LISTEN_TYPE = "listen";
const SELECT_TYPE = "select";
const JUDGE_TYPE = "judge";
const FORM_TYPE = "form";
const LISTEN_COMPREHENSION_TYPE = "listenComprehension";
const READ_COMPREHENSION_TYPE = "readComprehension";
const CHARACTER_INTRO_TYPE = "characterIntro";
const DIALOGUE_TYPE = "dialogue";
const SELECT_TRANSCRIPTION_TYPE = "selectTranscription";
const SPEAK_TYPE = "speak";
const SELECT_PRONUNCIATION_TYPE = "selectPronunciation";
const LISTEN_ISOLATION_TYPE = "listenIsolation";
const TAP_COMPLETE_TABLE_TYPE = "tapCompleteTable";
const TYPE_COMPLETE_TABLE_TYPE = "typeCompleteTable";
const TYPE_CLOSE_TYPE = "typeCloze";
const TYPE_CLOSE_TABLE_TYPE = "typeClozeTable";
const TAP_CLOSE_TABLE_TYPE = "tapClozeTable";
const TAP_CLOSE_TYPE = "tapCloze";
const ASSIST_TYPE = "assist";
const LISTEN_MATCH_TYPE = "listenMatch";
const LISTEN_COMPLETE_TYPE = "listenComplete";
const LISTEN_SPELL_TYPE = "listenSpell";
const TAP_COMPLETE_TYPE = "tapComplete";
const MATCH_TYPE = "match";
const GAP_FILL_TYPE = "gapFill";
const CHARACTER_TRACE_TYPE = "characterTrace";
const CHALLENGE_PUZZLE_TYPE = "characterPuzzle";
const DEFINITION_TYPE = "definition";
const TAP_DESCRIBE_TYPE = "tapDescribe";
const FREE_RESPONSE_TYPE = "freeResponse";
const PARTIAL_REVERSE_TRANSLATE_TYPE = "partialReverseTranslate";

// Query DOM keys
const CHALLENGE_CHOICE_CARD = '[data-test="challenge-choice-card"]';
const CHALLENGE_CHOICE = '[data-test="challenge-choice"]';
const CHALLENGE_TRANSLATE_INPUT = '[data-test="challenge-translate-input"]';
const CHALLENGE_LISTEN_TAP = '[data-test="challenge-listenTap"]';
const CHALLENGE_LISTEN_SPELL = '[data-test="challenge challenge-listenSpell"]';
const CHALLENGE_JUDGE_TEXT = '[data-test="challenge-judge-text"]';
const CHALLENGE_TEXT_INPUT = '[data-test="challenge-text-input"]';
const CHALLENGE_TAP_TOKEN = '[data-test*="challenge-tap-token"]';
const CHALLENGE_TAP_TOKEN_TEXT = '[data-test="challenge-tap-token-text"]';
const CHALLENGE_TYPE_CLOZE = '[data-test="challenge challenge-typeCloze"]';
const CHALLENGE_TYPE_CLOZE_TABLE = '[data-test="challenge challenge-typeClozeTable"]';
const PLAYER_NEXT = '[data-test="player-next"], [data-test="story-start"]';
const PLAYER_SKIP = '[data-test="player-skip"]';
const AUDIO_BUTTON = '[data-test="audio-button"]';
const WORD_BANK = '[data-test="word-bank"]';
const BLAME_INCORRECT = '[data-test="blame blame-incorrect"]';
const CHARACTER_MATCH = '[data-test="challenge challenge-characterMatch"]';
const TYPE_COMPLETE_TABLE = '[data-test="challenge challenge-typeCompleteTable"]';
const STORIES_PLAYER_NEXT = '[data-test="stories-player-continue"]';
const STORIES_PLAYER_START = '[data-test="story-start"]';
const STORIES_PLAYER_DONE = '[data-test="stories-player-done"]';
const STORIES_CHOICE = '[data-test="stories-choice"]';
const STORIES_ELEMENT = '[data-test="stories-element"]';

// Mouse Click
const clickEvent = new MouseEvent("click", {
  view: window,
  bubbles: true,
  cancelable: true,
});

// Gets Challenge Object
function getChallengeObj(theObject) {
  let result = null;
  if (theObject instanceof Array) {
    for (let i = 0; i < theObject.length; i++) {
      result = getChallengeObj(theObject[i]);
      if (result) {
        break;
      }
    }
  } else {
    for (let prop in theObject) {
      if (prop == "challenge") {
        if (typeof theObject[prop] == "object") {
          return theObject;
        }
      }
      if (
        theObject[prop] instanceof Object ||
        theObject[prop] instanceof Array
      ) {
        result = getChallengeObj(theObject[prop]);
        if (result) {
          break;
        }
      }
    }
  }
  return result;
}

function getElementIndex(element) {
  let result = null;
  if (element instanceof Array) {
    for (let i = 0; i < element.length; i++) {
      result = getElementIndex(element[i]);
      if (result) {
        break;
      }
    }
  } else {
    for (let prop in element) {
      // if (prop == "elementIndex") {
      if (prop == "challenge") {
        if (typeof element[prop] == "object") {
          return element;
        }
        return element[prop];
      }
      if (element[prop] instanceof Object || element[prop] instanceof Array) {
        result = getElementIndex(element[prop]);
        if (result) {
          break;
        }
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
  const dataTestDOM = document.querySelectorAll(dataTestComponentClassName);
  if (dataTestDOM.length > 0) {
    let current = 0;
    for (let i = 0; i < dataTestDOM.length; i++) {
      if(dataTestDOM[i].childNodes.length > 0) {
        current = i;
      }
    }
    let currentDOM = dataTestDOM[current];
    let propsValues = getProps(currentDOM);
    const { challenge } = getElementIndex(propsValues);
    // let elementIndex = getElementIndex(propsValues);
    // let storyList = getProps(currentDOM.parentNode);
    // return storyList.children.find(Boolean)[elementIndex].props.storyElement;
    return challenge;
  }
}

// https://stackoverflow.com/a/39165137
// https://github.com/Venryx/mobx-devtools-advanced/blob/master/Docs/TreeTraversal.md
function getReactFiber(dom) {
  const key = Object.keys(dom).find((key) => {
    return (
      key.startsWith("__reactFiber$") || // react 17+
      key.startsWith("__reactInternalInstance$") // react <17
    );
  });
  return dom[key];
}

// pressEnter() function
function pressEnter() {
  const clickEvent = new MouseEvent("click", {
    view: window,
    bubbles: true,
    cancelable: false,
  });
  breakWhenIncorrect();
  let isPlayerNext = document.querySelector(PLAYER_NEXT);
  if (isPlayerNext !== null) {
    isPlayerNext.dispatchEvent(clickEvent);
  }
}

// pressEnter() function but for stories
function pressEnterStories() {
  const clickEvent = new MouseEvent("click", {
    view: window,
    bubbles: true,
    cancelable: false,
  });
  document.querySelector([STORIES_PLAYER_NEXT, STORIES_PLAYER_START, STORIES_PLAYER_DONE].join(',')).dispatchEvent(clickEvent);
}

// dynamicInput() function
function dynamicInput(element, text) {
  let input = element;
  let lastValue = input.value;
  input.value = text;
  let event = new Event("input", { bubbles: true });
  event.simulated = true;
  let tracker = input._valueTracker;
  if (tracker) {
    tracker.setValue(lastValue);
  }
  input.dispatchEvent(event);
}

// Solves the Challenge
function classify() {
  const challenge = getChallenge();
  if (!challenge) return;
  if (DEBUG) terminal.log(`${challenge.type}`, challenge);
  switch (challenge.type) {
    case 'MULTIPLE_CHOICE':
    case 'SELECT_PHRASE': {
      const { correctAnswerIndex } = challenge;
      if (DEBUG) { terminal.log("MULTIPLE_CHOICE_TYPE, SELECT_PHRASE", { correctAnswerIndex }); }
      const options = document.querySelectorAll('[data-test="stories-choice"]');
      options.forEach((option, i) => {
        if(i == correctAnswerIndex) {
          option.dispatchEvent(clickEvent);
        }
      });
      return { correctAnswerIndex };
    }

    case 'POINT_TO_PHRASE': {
      const { correctAnswerIndex } = challenge;
      if (DEBUG) { terminal.log("POINT_TO_PHRASE", { correctAnswerIndex }); }
      const options = document.querySelectorAll('[data-test="challenge-tap-token"]');
      options.forEach((option, i) => {
        if(i == correctAnswerIndex) {
          option.dispatchEvent(clickEvent);
        }
      });
      return { correctAnswerIndex };
    }

    case 'ARRANGE': {
      const { selectablePhrases, phraseOrder } = challenge;
      if (DEBUG) { terminal.log("POINT_TO_PHRASE", { selectablePhrases, phraseOrder }); }
      const options = document.querySelectorAll('[data-test="challenge-tap-token"]');
      if(options.length > 0) {
        phraseOrder.forEach((i) => {
            Array.prototype.slice.call(options).filter(function(option) { return option.innerText == selectablePhrases[i] }).find(Boolean).dispatchEvent(clickEvent);
        });
      }
      return { selectablePhrases, phraseOrder };
    }

    case 'MATCH': {
      const { matches } = challenge;
      if (DEBUG) { terminal.log("MATCH", { matches }); }
      const options = document.querySelectorAll('[data-test="challenge-tap-token"]');
      matches.forEach((match) => {
        options.forEach((option) => {
          if(option.querySelector('[data-test="challenge-tap-token-text"]').innerText == match.phrase || option.querySelector('[data-test="challenge-tap-token-text"]').innerText == match.translation) {
            option.dispatchEvent(clickEvent);
          }
        });
      });
      return { matches };
    }

    case LISTEN_SPELL_TYPE: {
      const { displayTokens } = challenge;
      if (DEBUG) { terminal.log("LISTEN_SPELL_TYPE", { displayTokens }); }
      const tokens = document.querySelectorAll(CHALLENGE_LISTEN_SPELL.concat(' input[type="text"]:not([readonly])'));
      let i = 0;
      displayTokens.forEach((word) => {
        if(!isNaN(word.damageStart)) {
          for (let c of word.text.substring(word.damageStart, word.damageEnd ?? word.text.length)) {
            dynamicInput(tokens[i], c);
            i++;
          }
        }
      });
      return { displayTokens };
    }

    case LISTEN_COMPLETE_TYPE: {
      const { displayTokens } = challenge;
      if (DEBUG) { terminal.log("LISTEN_COMPLETE_TYPE", { displayTokens }); }
      let tokens = document.querySelectorAll(CHALLENGE_TEXT_INPUT);
      var i = 0;
      displayTokens.forEach((token) => {
        if(token.isBlank) {
            dynamicInput(tokens[i], token.text);
        }
      });
      return { displayTokens };
    }

    case PARTIAL_REVERSE_TRANSLATE_TYPE: {
      const { displayTokens, grader } = challenge;
      if (DEBUG) { terminal.log("PARTIAL_REVERSE_TRANSLATE_TYPE", { displayTokens, grader }); }
      let tokens = document.querySelectorAll("[contenteditable=true]");
      let value = '';
      let event = new Event("input", { bubbles: true });
      event.simulated = true;
      displayTokens.forEach((token) => {
        if(token.isBlank) {
            value = value + token.text;
        }
      });
      try {
        tokens[0].textContent = value;
        tokens[0].dispatchEvent(event);
      } catch (e) { /* terminal.log(e); */ }
      return { displayTokens, grader };
    }

    case LISTEN_MATCH_TYPE: {
      const { pairs } = challenge;
      if (DEBUG) { terminal.log("LISTEN_MATCH_TYPE", { pairs }); }
      const tokens = document.querySelectorAll('button'.concat(CHALLENGE_TAP_TOKEN));
      for (let i = 0; i <= 3; i++) {
        const dataset = getReactFiber(tokens[i]).return.child.stateNode.dataset.test;
        const word = dataset.split('-')[0];
        tokens[i].dispatchEvent(clickEvent);
        for (let j = 4; j <= 7; j++) {
          const text = tokens[j].querySelector(CHALLENGE_TAP_TOKEN_TEXT).innerText;
          if(/\s/g.test(dataset) && text.endsWith(` ${word}`)) {
            tokens[j].dispatchEvent(clickEvent);
          } else if (text == word) {
            tokens[j].dispatchEvent(clickEvent);
          }
        }
      }
      return { pairs }
    }

    case DEFINITION_TYPE:
    case ASSIST_TYPE: {
      const { choices, correctIndex } = challenge;
      const tokens = document.querySelectorAll(CHALLENGE_CHOICE);
      if (DEBUG) { terminal.log("ASSIST_TYPE, DEFINITION_TYPE", { choices, correctIndex, tokens }); }
      tokens.forEach((e, i) => {
        if(i == correctIndex) {
          e.dispatchEvent(clickEvent);
        }
      });
      return { choices, correctIndex };
    }

    case GAP_FILL_TYPE:
    case SELECT_TYPE:
    case SELECT_PRONUNCIATION_TYPE:
    case READ_COMPREHENSION_TYPE:
    case LISTEN_COMPREHENSION_TYPE:
    case CHARACTER_SELECT_TYPE:
    case FORM_TYPE: {
      const { choices, correctIndex } = challenge;
      if (DEBUG) {
        terminal.log(
          "READ_COMPREHENSION, LISTEN_COMPREHENSION, CHARACTER_SELECT_TYPE, GAP_FILL_TYPE, SELECT_PRONUNCIATION_TYPE",
          { choices, correctIndex }
        );}
      document
        .querySelectorAll(CHALLENGE_CHOICE)
        [correctIndex].dispatchEvent(clickEvent);
      return { choices, correctIndex };
    }

    case TAP_COMPLETE_TABLE_TYPE: {
      const { choices, displayTokens } = challenge;
      const tokens = document.querySelectorAll(WORD_BANK.concat(' ', CHALLENGE_TAP_TOKEN));
      if (DEBUG) { terminal.log("TAP_COMPLETE_TABLE_TYPE", { choices, displayTokens, tokens }); }
      displayTokens.forEach((line) => {
        line.forEach((column) => {
          if(column[0].isBlank == true) {
            tokens.forEach((e) => {
              if(e.innerText == column[0].text) {
                e.dispatchEvent(clickEvent);
              }
            });
          }
        });
      });
      return { choices, displayTokens };
    }

    case TYPE_COMPLETE_TABLE_TYPE: {
      const { displayTokens } = challenge;
      const tokens = document.querySelectorAll(TYPE_COMPLETE_TABLE.concat(' input'));
      if (DEBUG) { terminal.log("TYPE_COMPLETE_TABLE_TYPE", { displayTokens, tokens }); }
      var index = 0;
      displayTokens.forEach((line) => {
        line.forEach((column) => {
          if(column[0].isBlank == true) {
            dynamicInput(tokens[index], column[0].text);
            index++;
          }
        });
      });
      return { displayTokens };
    }

    case TYPE_CLOSE_TYPE: {
      const { displayTokens } = challenge;
      const tokens = document.querySelectorAll(CHALLENGE_TYPE_CLOZE.concat(' input'));
      if (DEBUG) { terminal.log("TYPE_CLOSE_TYPE", { displayTokens, tokens }); }
      let i = 0;
      displayTokens.forEach((word) => {
        if(word.damageStart) {
          dynamicInput(tokens[i], word.text.substring(word.damageStart, word.text.length));
          i++;
        }
      });
      return { displayTokens };
    }

    case TYPE_CLOSE_TABLE_TYPE: {
      const { displayTokens } = challenge;
      const tokens = document.querySelectorAll(CHALLENGE_TYPE_CLOZE_TABLE.concat(' input'));
      if (DEBUG) { terminal.log("TYPE_CLOSE_TABLE_TYPE", { displayTokens, tokens }); }
      let i = 0;
      displayTokens.forEach((line) => {
        line.forEach((column) => {
          column.forEach((word) => {
            if(word.damageStart) {
              dynamicInput(tokens[i], word.text.substring(word.damageStart, word.text.length));
              i++;
            }
          });
        });
      });
      return { displayTokens };
    }

    case TAP_CLOSE_TABLE_TYPE: {
      const { displayTokens } = challenge;
      const tokens = document.querySelectorAll(CHALLENGE_TAP_TOKEN_TEXT);
      if (DEBUG) { terminal.log("TYPE_CLOSE_TABLE_TYPE", { displayTokens, tokens }); }
      displayTokens.forEach((line) => {
        line.forEach((column) => {
          column.forEach((word) => {
            if(word.damageStart) {
              tokens.forEach((token) => {
                if(token.innerText == word.text.substring(word.damageStart, word.text.length)) {
                  token.dispatchEvent(clickEvent);
                }
              });
            }
          });
        });
      });
      return { displayTokens };
    }

    case TAP_CLOSE_TYPE: {
      const { choices, correctIndices } = challenge;
      const tokens = document.querySelectorAll(CHALLENGE_TAP_TOKEN);
      if (DEBUG) { terminal.log("TAP_CLOSE_TYPE", { choices, correctIndices, tokens }); }
      for (let i = 0; i < correctIndices.length; i++) {
        choices.forEach((value, j) => {
          if(correctIndices[i] == j) {
            for (let k = 0; k < tokens.length; k++) {
              if(tokens[k].innerText == value) {
                tokens[k].dispatchEvent(clickEvent);
              }
            }
          }
        });
      };
      return { choices, correctIndices };
    }

    case TAP_COMPLETE_TYPE: {
      const { choices, correctIndices } = challenge;
      const tokens = document.querySelectorAll(WORD_BANK.concat(' ', CHALLENGE_TAP_TOKEN_TEXT));
      if (DEBUG) {terminal.log("TAP_COMPLETE_TYPE", { choices, correctIndices, tokens });}
      correctIndices.forEach((i) => {
        tokens[i].dispatchEvent(clickEvent);
      });
      return { choices, correctIndices };
    }

    case LISTEN_ISOLATION_TYPE: {
      const { correctIndex } = challenge;
      const tokens = document.querySelectorAll(CHALLENGE_CHOICE);
      if (DEBUG) {terminal.log("LISTEN_ISOLATION_TYPE", { correctIndex, tokens });}
      tokens.forEach((e, i) => {
        if(i == correctIndex) {
          e.dispatchEvent(clickEvent);
        }
      });
      return { correctIndex };
    }

    case MATCH_TYPE: {
      const { pairs } = challenge;
      const tokens = document.querySelectorAll(CHALLENGE_TAP_TOKEN_TEXT);
      if (DEBUG) {terminal.log("MATCH_TYPE", { tokens, pairs });}
      pairs.forEach((pair) => {
        for (let i = 0; i < tokens.length; i++) {
          if (
            tokens[i].innerText === pair.fromToken ||
            tokens[i].innerText === pair.learningToken
          ) {
            tokens[i].dispatchEvent(clickEvent);
          }
        }
      });
      return { pairs };
    }

    case CHARACTER_MATCH_TYPE: {
      const { pairs } = challenge;
      const tokens = document.querySelectorAll(CHALLENGE_TAP_TOKEN);
      if (DEBUG) {terminal.log("CHARACTER_MATCH_TYPE", { tokens, pairs });}
      pairs.forEach((pair) => {
        for (let i = 0; i < tokens.length; i++) {
          if (
            tokens[i].innerText === pair.fromToken ||
            tokens[i].innerText === pair.learningToken
          ) {
            tokens[i].dispatchEvent(clickEvent);
          }
        }
      });
      return { pairs };
    }

    case TRANSLATE_TYPE: {
      const { correctTokens, correctSolutions } = challenge;
      if (DEBUG) {terminal.log("TRANSLATE_TYPE", { correctTokens, correctSolutions });}
      if (correctTokens) {
        const tokens = document.querySelectorAll(CHALLENGE_TAP_TOKEN_TEXT);
        let ignoreTokeIndexes = [];
        for (let correctTokenIndex in correctTokens) {
          for (let tokenIndex in tokens) {
            const token = tokens[tokenIndex];
            if (ignoreTokeIndexes.includes(tokenIndex)) continue;
            if (token.innerText === correctTokens[correctTokenIndex]) {
              token.dispatchEvent(clickEvent);
              ignoreTokeIndexes.push(tokenIndex);
              if (DEBUG)
                terminal.log(
                  `correctTokenIndex [${correctTokens[correctTokenIndex]}] - tokenIndex [${token.innerText}]`
                );
              break;
            }
          }
        }
      } else if (correctSolutions) {
        let textInputElement = document.querySelectorAll(
          CHALLENGE_TRANSLATE_INPUT
        )[0];
        dynamicInput(textInputElement, correctSolutions[0]);
      }
      return { correctTokens };
    }

    case NAME_TYPE: {
      const { correctSolutions, articles, grader } = challenge;
      if (DEBUG) { terminal.log("NAME_TYPE", { correctSolutions, articles, grader }); }
      let tokens = document.querySelectorAll(CHALLENGE_TEXT_INPUT);
      if(articles) {
        correctSolutions.forEach((solution) => {
          solution = solution.split(' ');
          solution.forEach((word) => {
            let i = articles.indexOf(word);
            if(i > -1) {
              document.querySelectorAll(CHALLENGE_CHOICE)[i].dispatchEvent(clickEvent);
              solution.splice(solution.indexOf(word), 1);
              dynamicInput(tokens[0], solution.join(' '));
            }
          });
        });
      }
      else {
        correctSolutions.forEach((solution, i) => {
          dynamicInput(tokens[0], solution);
        });
      }
      return { correctSolutions, articles, grader };
    }

    case COMPLETE_REVERSE_TRANSLATION_TYPE: {
      const { displayTokens } = challenge;
      if (DEBUG) {terminal.log("COMPLETE_REVERSE_TRANSLATION_TYPE", { displayTokens });}
      let tokens = document.querySelectorAll(CHALLENGE_TEXT_INPUT);
      var i = 0;
      displayTokens.forEach((token) => {
        if(token.isBlank) {
            dynamicInput(tokens[i], token.text);
            i++;
        }
      });
      return { displayTokens };
    }

    case LISTEN_TAP_TYPE: {
      const { correctTokens } = challenge;
      if (DEBUG) {terminal.log("LISTEN_TAP_TYPE", { correctTokens });}
      const tokens = Array.from(document.querySelectorAll(CHALLENGE_TAP_TOKEN)).filter(e => e.tagName === 'BUTTON');
      for (let word of correctTokens) {
        for (let i of Object.keys(tokens)) {
          if (tokens[i].innerText === word) {
            tokens[i].dispatchEvent(clickEvent);
            tokens.splice(i, 1);
            break;
          }
        }
      }
      return { correctTokens };
    }

    case LISTEN_TYPE: {
      const { prompt } = challenge;
      if (DEBUG) {terminal.log("LISTEN_TYPE", { prompt });}
      let textInputElement = document.querySelectorAll(
        CHALLENGE_TRANSLATE_INPUT
      )[0];
      dynamicInput(textInputElement, prompt);
      return { prompt };
    }

    case JUDGE_TYPE: {
      const { correctIndices } = challenge;
      if (DEBUG) {terminal.log("JUDGE_TYPE", { correctIndices });}
      document
        .querySelectorAll(CHALLENGE_JUDGE_TEXT)
        [correctIndices[0]].dispatchEvent(clickEvent);
      return { correctIndices };
    }

    case DIALOGUE_TYPE:
    case CHARACTER_INTRO_TYPE: {
      const { choices, correctIndex } = challenge;
      if (DEBUG)
        {terminal.log("CHARACTER_INTRO_TYPE, DIALOGUE_TYPE", {
          choices,
          correctIndex,
        });}
      document
        .querySelectorAll(CHALLENGE_JUDGE_TEXT)
        [correctIndex].dispatchEvent(clickEvent);
      return { choices, correctIndex };
    }

    case SELECT_TRANSCRIPTION_TYPE: {
      const { choices, correctIndex } = challenge;
      if (DEBUG) {terminal.log("SELECT_TRANSCRIPTION_TYPE", { choices, correctIndex });}
      document
        .querySelectorAll(CHALLENGE_JUDGE_TEXT)
        [correctIndex].dispatchEvent(clickEvent);
      return { choices, correctIndex };
    }

    case SPEAK_TYPE: {
      const { prompt } = challenge;
      if (DEBUG) {terminal.log("SPEAK_TYPE", { prompt });}
      document.querySelectorAll(PLAYER_SKIP)[0].dispatchEvent(clickEvent);
      return { prompt };
    }

    default:
      break;
  }
}

// Stops when an answer is incorrect
function breakWhenIncorrect() {
  const isBreak = document.querySelectorAll(BLAME_INCORRECT).length > 0;
  if (isBreak) {
    terminal.log("Incorrect, stopped");
    clearInterval(mainInterval);
  }
}

// Main Function
function main() {
  try {
    let isPlayerNext = document.querySelectorAll(PLAYER_NEXT);
    let test = document.querySelector("[data-test=\"plus-no-thanks\"], [data-test=\"practice-hub-ad-no-thanks-button\"]");
    if(isPlayerNext !== null && isPlayerNext.length > 0) {
      if(isPlayerNext[0].getAttribute('aria-disabled') === 'true')
        classify();
    } else if (test !== null && test.length > 0) {
      test.click();
    } else if (/learn/gi.test(window.location.href) == true) {
      learn();
    }
    setTimeout(pressEnter, 150); // pressEnter();
  } catch (e) {
    // terminal.log(e);
  }
}

// Stories Function
function stories() {
  if (/stories/gi.test(window.location.href) == false) {
    window.location.replace("https://www.duolingo.com/stories"); return;
  }
  try {
    let button = document.querySelectorAll([STORIES_PLAYER_NEXT, STORIES_PLAYER_START, STORIES_PLAYER_DONE].join(','));
    if(button.length > 0) {
      let action = Array.prototype.slice.call(button).find(Boolean).textContent.toUpperCase();
      if (action.valueOf() == "START STORY") {
        setTimeout(pressEnterStories, 150);
      } else if (action.valueOf() == "CONTINUE") {
        if(Array.prototype.slice.call(button).find(Boolean).disabled) {
          classify();
        } else {
          setTimeout(pressEnterStories, 150);
        }
      }
    } else {
      let button = document.querySelector('[data-test="story-start-button"]');
      if(button) {
        if(button.nextSibling.disabled) {
          button.dispatchEvent(clickEvent);
        } else {
          button.nextSibling.dispatchEvent(clickEvent);
        }
      } else {
        document.querySelector('div._2zY7s:not([style*="255, 177, 0"]):not([style*="251, 177, 0"])').dispatchEvent(clickEvent);
      }
    }
  } catch (e) {
    terminal.log(e);
  }
}

// Calls main()
function solveChallenge() {
  if(document.getElementById('mylog') == null) {
    setConsole();
  }
  // Check if its a Skill / Alphabet / Checkpoint URL
  // if (/[sac][klh][ipe][lhc][lak]/gi.test(window.location.href) == true) {
  if (/lesson|practice/gi.test(window.location.href) == true) {
    if (DEBUG) {terminal.log("Skill URL Detected");}
    clearInterval(mainInterval);
    mainInterval = setInterval(main, TIME_OUT);
  }
  // Check if its a Stories URL
  if (/stories/gi.test(window.location.href) == true) {
    if (DEBUG) {terminal.log("Stories URL Detected");}
    clearInterval(mainInterval);
    mainInterval = setInterval(stories, TIME_OUT);
  }
  if (/learn/gi.test(window.location.href) == true) {
    if (DEBUG) {terminal.log("Main URL Detected");}
    window.location.replace("https://www.duolingo.com/practice");
  }
  terminal.log(`to stop the script run "clearInterval(${mainInterval})"`);
}

function learn() {
  let button = document.querySelector('a[data-test="global-practice"]');
  if(button) {
      button.click();
  }
  clearInterval(mainInterval);
  mainInterval = setInterval(solveChallenge, TIME_OUT);
}

// To not mess duolingo own log
function setConsole() {
  var iframe = document.createElement('iframe');
  iframe.id = 'mylog';
  iframe.style.display = 'none';
  document.body.appendChild(iframe);
  window.terminal = iframe.contentWindow.console;
}

(solveChallenge)();


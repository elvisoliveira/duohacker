export const keys = () => {
    const d = (t) => `[data-test="${t}"]`;
    return {
        AUDIO_BUTTON: d('audio-button'),
        BLAME_INCORRECT: d('blame blame-incorrect'),
        CHALLENGE: '[data-test~="challenge"]',
        CHALLENGE_CHOICE: d('challenge-choice'),
        CHALLENGE_CHOICE_CARD: d('challenge-choice-card'),
        CHALLENGE_JUDGE_TEXT: d('challenge-judge-text'),
        CHALLENGE_LISTEN_SPELL: d('challenge challenge-listenSpell'),
        CHALLENGE_LISTEN_TAP: d('challenge-listenTap'),
        CHALLENGE_TAP_TOKEN: '[data-test*="challenge-tap-token"]',
        CHALLENGE_TAP_TOKEN_TEXT: d('challenge-tap-token-text'),
        CHALLENGE_TEXT_INPUT: d('challenge-text-input'),
        CHALLENGE_TRANSLATE_INPUT: d('challenge-translate-input'),
        CHALLENGE_TYPE_CLOZE: d('challenge challenge-typeCloze'),
        CHALLENGE_TYPE_CLOZE_TABLE: d('challenge challenge-typeClozeTable'),
        CHARACTER_MATCH: d('challenge challenge-characterMatch'),
        PLAYER_NEXT: [d('player-next'), d('story-start')].join(','),
        PLAYER_SKIP: d('player-skip'),
        STORIES_CHOICE: d('stories-choice'),
        STORIES_ELEMENT: d('stories-element'),
        STORIES_PLAYER_DONE: d('stories-player-done'),
        STORIES_PLAYER_NEXT: d('stories-player-continue'),
        STORIES_PLAYER_START: d('story-start'),
        TYPE_COMPLETE_TABLE: d('challenge challenge-typeCompleteTable'),
        WORD_BANK: d('word-bank'),
        PLUS_NO_THANKS: d('plus-no-thanks'),
        PRACTICE_HUB_AD_NO_THANKS_BUTTON: d('practice-hub-ad-no-thanks-button')
    };
};
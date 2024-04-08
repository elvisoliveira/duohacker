window.actions.name = (challenge) => {
    const { correctSolutions, articles, grader } = challenge;
    let tokens = document.querySelectorAll(window.keys.CHALLENGE_TEXT_INPUT);
    if (articles) {
        correctSolutions.forEach((solution) => {
            solution = solution.split(' ');
            solution.forEach((word) => {
                let i = articles.indexOf(word);
                if (i > -1) {
                    document.querySelectorAll(window.keys.CHALLENGE_CHOICE)[i].dispatchEvent(clickEvent);
                    solution.splice(solution.indexOf(word), 1);
                    dynamicInput(tokens[0], solution.join(' '));
                }
            });
        });
    } else {
        correctSolutions.forEach((solution, i) => {
            dynamicInput(tokens[0], solution);
        });
    }
    return { correctSolutions, articles, grader };
};
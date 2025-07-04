import test from 'node:test';
import assert from 'node:assert/strict';

global.window = { actions: {} };

// dynamically import after globals are set
const loadModule = async () => {
    await import('../src/types/assist.js');
};

test('assist is an alias for definition', async () => {
    await loadModule();
    assert.strictEqual(window.actions.assist, window.actions.definition);
});

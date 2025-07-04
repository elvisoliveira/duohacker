import test from 'node:test';
import assert from 'node:assert/strict';
import { keys } from '../src/keys.js';

test('keys() returns expected selectors', () => {
    const k = keys();
    assert.ok(k.CHALLENGE, 'CHALLENGE key missing');
    assert.ok(k.PLAYER_NEXT, 'PLAYER_NEXT key missing');
});

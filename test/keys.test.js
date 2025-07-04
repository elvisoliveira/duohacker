import assert from 'node:assert/strict';
import { keys } from '../src/keys.js';

// Basic sanity test to ensure the keys helper returns
// an object with expected selector values.
assert.ok(keys().CHALLENGE_TEXT_INPUT, 'CHALLENGE_TEXT_INPUT missing');
console.log('keys test passed');

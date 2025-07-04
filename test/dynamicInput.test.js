import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';

// This test verifies that the helper used to set input values works
// correctly within a DOM environment.

const dom = new JSDOM('<input id="test" value="">');
// expose window and document before loading script so it can attach
global.window = dom.window;
global.document = dom.window.document;
global.MouseEvent = dom.window.MouseEvent;
global.Event = dom.window.Event;

await import('../src/userscript.js');

const input = dom.window.document.getElementById('test');
let triggered = false;
input.addEventListener('input', () => { triggered = true; });

dom.window.dynamicInput(input, 'hello');

assert.equal(input.value, 'hello');
assert.ok(triggered, 'input event was not dispatched');
console.log('dynamicInput test passed');

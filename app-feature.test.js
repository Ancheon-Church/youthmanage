/* Regression tests for responsive layout, categories, date ranges, and attendance summaries. */
'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, 'app.js'), 'utf8');
const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const app = { innerHTML: '', dataset: {} };
const context = {
  window: null,
  document: { getElementById: id => id === 'app' ? app : null, activeElement: null },
  console,
  Date,
  setTimeout,
  clearTimeout
};
context.window = context;
context.FIREBASE_CONFIG = null;
vm.createContext(context);
vm.runInContext(source + `
  ;globalThis.__feature = {
    normalizeBoardCategory, boardCategoryMeta,
    eventOccursOn, eventOverlaps, eventRangeLabel,
    attendanceStatus, classAttendanceStats, curWeek
  };
  globalThis.__setData = value => { S.data = value; };
`, context);

const feature = context.__feature;

assert.equal(feature.normalizeBoardCategory('\uD68C\uC758\uB85D'), '\uD68C\uC758\uB85D');
assert.equal(feature.boardCategoryMeta('\uD68C\uC758\uB85D').label, '\uD68C\uC758\uB85D');
assert.equal(feature.normalizeBoardCategory('\uC54C \uC218 \uC5C6\uC74C'), '\uACF5\uC9C0');

const legacyEvent = { date: '2026-07-24' };
assert.equal(feature.eventOccursOn(legacyEvent, '2026-07-24'), true);
assert.equal(feature.eventOccursOn(legacyEvent, '2026-07-25'), false);

const retreat = { date: '2026-07-24', endDate: '2026-07-26' };
assert.equal(feature.eventOccursOn(retreat, '2026-07-24'), true);
assert.equal(feature.eventOccursOn(retreat, '2026-07-25'), true);
assert.equal(feature.eventOccursOn(retreat, '2026-07-26'), true);
assert.equal(feature.eventOccursOn(retreat, '2026-07-27'), false);
assert.equal(feature.eventRangeLabel(retreat), '7/24\u20137/26');

const crossMonth = { date: '2026-07-30', endDate: '2026-08-02' };
assert.equal(feature.eventOverlaps(crossMonth, '2026-07-01', '2026-07-31'), true);
assert.equal(feature.eventOverlaps(crossMonth, '2026-08-01', '2026-08-31'), true);
assert.equal(feature.eventOccursOn(crossMonth, '2026-08-01'), true);

const week = feature.curWeek();
context.__setData({
  classes: ['A'],
  users: [],
  students: [
    { id: '1', cls: 'A', att: { [week]: 'P' }, vchk: { [week]: true } },
    { id: '2', cls: 'A', att: { [week]: 'L' } },
    { id: '3', cls: 'A', att: { [week]: 'A' }, vchk: { [week]: false } },
    { id: '4', cls: 'A', att: {} }
  ],
  visits: [
    { sid: '2', date: week },
    { sid: '3', date: week }
  ],
  posts: [], comments: [], events: [], eventVotes: []
});
assert.deepEqual(JSON.parse(JSON.stringify(feature.classAttendanceStats('A'))), { total: 4, checked: 3, visited: 2 });
assert.equal(feature.attendanceStatus({ att: { [week]: 'A' } }, week), 'A');
assert.equal(feature.attendanceStatus({}, week), '');

assert.match(html, /\.app-shell\{max-width:1180px\}/);
assert.match(html, /@media \(min-width:768px\)/);
assert.doesNotMatch(source, /max-width:390px/);
assert.match(source, /BOARD_CATEGORIES = \['\uACF5\uC9C0', '\uB098\uB214', '\uD68C\uC758\uB85D'\]/);
assert.match(source, /id="event-end-date"/);
assert.match(source, /doc\(S\.me\.email\)\.update\(\{ \['att\.' \+ CUR\]/);
assert.match(source, /\[\['students', '\uD559\uC0DD'\], \['teachers', '\uAD50\uC0AC'\]\]/);

console.log('feature regression tests passed');

import { Phase } from './types';
const EMIT_LISTEN_EVENTS = 5;
const PHASES: Phase[] = [
  { name: "Warm-up Phase", users: 100, emitListenEvents: EMIT_LISTEN_EVENTS},
  { name: "Phase 2", users: 500,  emitListenEvents: EMIT_LISTEN_EVENTS},
  { name: "Final Phase", users: 1000,  emitListenEvents: EMIT_LISTEN_EVENTS}
];

const BEARER_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NTJlMjYwNTViZjVjZDE0ZDlmNDE3MDQiLCJpYXQiOjE2OTgyNjc1NjksImV4cCI6MTY5OTEzMTU2OX0.0KhASsCjXUAmwYi95EnpzdcJ8Ap93WKW_YqQxvZ_N7M';
const URI = "http://localhost:3000/user";
const EMIT_LISTEN_INTERVAL_IN_MS = 10_000;
const POLLING_PERCENTAGE = 0.05;
const COORDINATE_EVENT = "coordinates";
const PGRKAM_PRIVATE_JOBS_EVENT = "pgrkam-private-jobs";
const JKK_JOBS_EVENT = "jkk-jobs";
const ERROR_EVENT = 'error';
const COORDINATE_OBJ = {
    "lat": 31.6434802,
    "lng": 74.85753059999999,
    "range": 5
}



export {
  EMIT_LISTEN_EVENTS,
  EMIT_LISTEN_INTERVAL_IN_MS,
  BEARER_TOKEN,
  URI,
  POLLING_PERCENTAGE,
  COORDINATE_EVENT,
  PGRKAM_PRIVATE_JOBS_EVENT,
  JKK_JOBS_EVENT,
  PHASES,
  ERROR_EVENT,
  COORDINATE_OBJ
}

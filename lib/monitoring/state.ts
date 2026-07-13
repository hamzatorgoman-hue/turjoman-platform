/**
 * Where the founder is, for a crash report.
 *
 * Monitoring cannot import the scene store — the store imports analytics, and
 * analytics reports its own failures to monitoring, which would close a circle.
 * So the stores push here instead: a flat, dependency-free snapshot of *place*,
 * never of person.
 */

type Place = {
  scene?: string;
  journeyStep?: string;
  reference?: string;
  requestId?: string;
};

let place: Place = {};

export function setPlace(patch: Place) {
  place = { ...place, ...patch };
}

export function currentPlace(): Place {
  return { ...place };
}

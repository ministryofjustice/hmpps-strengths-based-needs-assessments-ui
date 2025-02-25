const core = require('@actions/core');

try {
  const containerTimings = JSON.parse(core.getInput('container-timings'));
  const cachedTimings = JSON.parse(core.getInput('cached-timings'));
  const now = Date.now();

  const durationsReducer = (acc, duration) => ({
    ...acc,
    [duration.spec + duration.hash]: {
      ...duration,
      timestamp: Object.hasOwn(duration, "timestamp") ? duration.timestamp : now
    }
  });

  const mergedTimings = Object.values({
    ...cachedTimings["durations"].reduce(durationsReducer, {}),
    ...containerTimings["durations"].reduce(durationsReducer, {}),
  }).filter((duration) => {
    const timestamp = Number(duration["timestamp"]);
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;
    return timestamp >= thirtyDaysAgo && timestamp <= now;
  });

  core.setOutput(
    "timings",
    JSON.stringify({
      "durations": mergedTimings
    })
  );
} catch (error) {
  core.setFailed(error.message);
}

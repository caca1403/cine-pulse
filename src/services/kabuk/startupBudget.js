// Render the results that arrived without letting one stalled request hold the page.
export function collectWithin(requests, timeoutMs = 9000) {
  return new Promise(resolve => {
    const results = requests.map(() => []);
    let remaining = requests.length;
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      resolve(results.slice());
    };
    const timer = setTimeout(finish, timeoutMs);
    if (!remaining) finish();
    requests.forEach((request, index) => {
      Promise.resolve(request).then(value => {
        if (!finished) results[index] = value || [];
      }, () => {}).finally(() => {
        if (--remaining === 0) finish();
      });
    });
  });
}

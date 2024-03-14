export function parsePathParams(pattern: string, url: string) {
  const params:Record<string, string> = {};
  const patternParts = pattern.split('/');
  const urlParts = url.split('/');
  
  if (patternParts.length !== urlParts.length) {
    return params;
  }

  for (let i = 0; i < patternParts.length; i++) {
    const patternPart = patternParts[i];
    const urlPart = urlParts[i];

    if (patternPart.startsWith(':')) {
      const paramName = patternPart.substring(1);
      params[paramName] = urlPart;
    } else if (patternPart !== urlPart) {
      return {};
    }
  }

  return params;
}

export function isUrlMatchPattern(url: string, pattern: string) {
  const regexPattern = pattern.replace(/\//g, '\\/').replace(/:[^\s/]+/g, '([^\\/]+)');
  const regex = new RegExp(`^${regexPattern}$`);

  return regex.test(url);
}

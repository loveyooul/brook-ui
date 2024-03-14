import fs from 'node:fs'

export function readLastNLines(filePath: string, n: number) {
  return new Promise<string>((resolve) => {
    const stats = fs.statSync(filePath);

    let chunkSize = 1024;
    let position = stats.size - chunkSize;

    const buffer = Buffer.alloc(chunkSize);

    let lastNLines: string[] = [];
    let remainder = '';

    const fd = fs.openSync(filePath, 'r');

    while (position > 0 && lastNLines.length < n) {
      const bytesRead = fs.readSync(fd, buffer, 0, chunkSize, position);
      const chunk = buffer.toString('utf8', 0, bytesRead);
      const lines = chunk.split('\n').reverse();

      if (lines.length) {
        lines[0] = lines[0] + remainder;
        remainder = lines.pop() as string;

        lastNLines = lines.concat(lastNLines);
        position -= chunkSize;

        if (position < 0) {
          chunkSize += position;
          position = 0;
        }
      }
    }

    if (lastNLines.length < n) {
      const bytesRead = fs.readSync(fd, buffer, 0, chunkSize, 0);
      const chunk = buffer.toString('utf8', 0, bytesRead);
      const lines = chunk.split('\n').reverse();
      lines[lines.length - 1] += remainder;
      lastNLines = lines.concat(lastNLines);
    }

    fs.closeSync(fd);
    resolve(lastNLines.slice(0, n).reverse().join('\n'));
  });
}

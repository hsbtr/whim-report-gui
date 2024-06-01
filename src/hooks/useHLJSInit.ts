import hljs from 'highlight.js/lib/core';
import json from 'highlight.js/lib/languages/json';
import typescript from 'highlight.js/lib/languages/typescript';

export function useHLJSInit() {
  hljs.registerLanguage('json', json);
  hljs.registerLanguage('typescript', typescript);
  return hljs;
}

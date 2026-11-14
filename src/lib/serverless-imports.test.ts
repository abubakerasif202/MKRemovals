import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

/**
 * Vercel runs api/*.ts as native ESM, which requires explicit file extensions on relative imports.
 * An extensionless import crashes the function at load time (FUNCTION_INVOCATION_FAILED).
 */
const SERVERLESS_GRAPH = [
  'api/quote.ts',
  'src/lib/quote-delivery.ts',
  'src/lib/quote-validation.ts',
  'src/config/business.ts',
];

test('files reachable from api/quote.ts use explicit .js extensions on relative imports', () => {
  for (const file of SERVERLESS_GRAPH) {
    const src = fs.readFileSync(file, 'utf-8');
    const bad = [...src.matchAll(/from\s+['"](\.{1,2}\/[^'"]+)['"]/g)]
      .map((m) => m[1])
      .filter((spec) => !/\.(js|json)$/.test(spec));
    assert.deepEqual(bad, [], `${file} has extensionless relative imports: ${bad.join(', ')}`);
  }
});

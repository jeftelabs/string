/*
 * @jeftelabs/string
 *
 * (c) Jefte Labs
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@t8ngs/runner'
import { toUnixSlash } from '../src/to_unix_slash.ts'

test.group('Slash', () => {
  test('convert backwards-slash paths to forward slash paths', ({ assert }) => {
    assert.equal(toUnixSlash('c:/aaaa\\bbbb'), 'c:/aaaa/bbbb')
    assert.equal(toUnixSlash('c:\\aaaa\\bbbb'), 'c:/aaaa/bbbb')
    assert.equal(toUnixSlash('c:\\aaaa\\bbbb\\★'), 'c:/aaaa/bbbb/★')
  })

  test('not convert extended-length paths', ({ assert }) => {
    const path = '\\\\?\\c:\\aaaa\\bbbb'
    assert.equal(toUnixSlash(path), path)
  })
})

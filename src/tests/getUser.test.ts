import { expect, test } from 'vitest';
import { getAuthKeyAndId } from '$gather/me';
import { JSDOM } from 'jsdom';

function makeDocument(authKey: string, id: string, includeMatchingScript = true) {
  const dom = new JSDOM();
  const doc = dom.window.document;

  // create a script tag with random stuff
  const randomScript = doc.createElement('script');
  randomScript.textContent = 'var foo = "bar";';
  doc.head.appendChild(randomScript);

  if (includeMatchingScript) {
    // inside, put a script tag with the auth key and id
    const script = doc.createElement('script');
    script.textContent = `//<![CDATA[
        var authkey = "${authKey}";
        var userid = ${id};
        var imgcheck =  1;
        var imgcheck_max =  64;
    //]]>`;
    doc.head.appendChild(script);
  }

  // and another random one
  const anotherRandomScript = doc.createElement('script');
  anotherRandomScript.textContent = 'var bar = "baz";';
  doc.head.appendChild(anotherRandomScript);

  return doc;
}

test('getUser', () => {
  const authKey = 'deadbeefcafebabe';
  const id = '123456';
  const doc = makeDocument(authKey, id);
  const user = getAuthKeyAndId(doc);
  expect(user).toEqual({ authKey, id });
});

test('getUser no matching script', () => {
  const doc = makeDocument('', '', false);
  expect(() => getAuthKeyAndId(doc)).toThrow('Document should have a script');
});

function metadataLine(name: string, value: string) {
  return `// @${name} ${value}`;
}

type Grants =
  | 'unsafeWindow'
  | 'GM_info'
  | 'GM_getValue'
  | 'GM_getValues'
  | 'GM_setValue'
  | 'GM_setValues'
  | 'GM_deleteValue'
  | 'GM_deleteValues'
  | 'GM_listValues'
  | 'GM_addValueChangeListener'
  | 'GM_removeValueChangeListener'
  | 'GM_getResourceText'
  | 'GM_getResourceURL'
  | 'GM_addElement'
  | 'GM_addStyle'
  | 'GM_openInTab'
  | 'GM_registerMenuCommand'
  | 'GM_unregisterMenuCommand'
  | 'GM_notification'
  | 'GM_xmlhttpRequest'
  | 'GM_download'

/**
 * Represents (a subset of) the metadata that can be included in a userscript.
 * Reference: https://violentmonkey.github.io/api/metadata-block/
 */
export class UserscriptMetadata {
  // required
  name: string;

  // optional
  author?: string;
  match?: string[]; // multiple allowed
  version?: string;
  description?: string;
  updateURL?: string;
  homepageURL?: string;
  icon?: string;
  grants?: Grants[]; // multiple allowed

  constructor(metadata: UserscriptMetadata) {
    this.name = metadata.name;
    this.author = metadata.author;
    this.match = metadata.match || [];
    this.version = metadata.version;
    this.description = metadata.description;
    this.updateURL = metadata.updateURL;
    this.homepageURL = metadata.homepageURL;
    this.icon = metadata.icon;
    this.grants = metadata.grants || [];
  }

  toString() {
    const lines = ['// ==UserScript==', metadataLine('name', this.name)];
    if (this.author) lines.push(metadataLine('author', this.author));
    for (const match of this.match || []) {
      lines.push(metadataLine('match', match));
    }
    if (this.version) lines.push(metadataLine('version', this.version));
    if (this.description) lines.push(metadataLine('description', this.description));
    if (this.updateURL) lines.push(metadataLine('updateURL', this.updateURL));
    if (this.homepageURL) lines.push(metadataLine('homepageURL', this.homepageURL));
    if (this.icon) lines.push(metadataLine('icon', this.icon));
    for (const grant of this.grants || []) {
      lines.push(metadataLine('grant', grant));
    }
    lines.push('// ==/UserScript==');
    return lines.join('\n') + '\n';
  }
}

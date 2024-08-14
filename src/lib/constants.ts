import packageJson from "../../package.json"
/**
 * The base name of the app. Used to make other id's.
 */
export const appName = packageJson.name;

/**
 * Make an identifier namespaced by the app name. This is helpful to likely
 * avoid collisions with other identifiers (element id's, localstorage keys
 * etc).
 * 
 * @param identifier The name of the ID. This value will remain stable as long
 * as the app name remains the same.
 * 
 * @returns The namespaced identifier.
 */
export function makeAppIdentifier(identifier: string) {
  return `${appName}-${identifier}`;
}

/**
 * The ID of the app element.
 */
export const appId = makeAppIdentifier("app");

/**
 * The ID of the app's styles.
 */
export const appStylesId = makeAppIdentifier("styles");

/**
 * The title of the app.
 */
export const appTitle = "Ropes";

export const version = packageJson.version;
export const homepageUrl = packageJson.homepage;
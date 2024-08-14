import { makeAppIdentifier } from "../constants";
import { localStorageBacked } from "./localStorageBacked";

const key = makeAppIdentifier("enabled");
export const enabled = localStorageBacked(key, () => false, String, (str) => str === "true");
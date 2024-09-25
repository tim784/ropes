import { makeAppIdentifier } from "../constants";
import { storageBacked } from "./storageBacked";

const key = makeAppIdentifier("enabled");
export const enabled = storageBacked(key, () => false, String, (str) => str === "true");
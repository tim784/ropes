import { appId } from "./lib/constants";
import Entrypoint from "$lib/components/Entrypoint.svelte";

const appDiv = document.createElement("div");
appDiv.id = appId
document.body.prepend(appDiv);

const app = new Entrypoint({
  target: appDiv,
});

export default app;

import { Tooltip as TooltipPrimitive } from "bits-ui";
import Content from "./tooltip-content.svelte";
import Root from "./tooltip-root.svelte";

const Trigger = TooltipPrimitive.Trigger;

export {
	Root,
	Trigger,
	Content,
	//
	Root as Tooltip,
	Content as TooltipContent,
	Trigger as TooltipTrigger,
};

<template>
	<div :class="_classes"></div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
	split: "vertical" | "horizontal";
	className?: string;
}>();

const _classes = computed(() =>
	["splitter-pane-resizer", props.split, props.className].join(" "),
);
</script>

<style scoped>
.splitter-pane-resizer {
	-moz-box-sizing: border-box;
	-webkit-box-sizing: border-box;
	box-sizing: border-box;
	background: #000;
	position: absolute;
	opacity: 0.2;
	z-index: 1;
	-moz-background-clip: padding;
	-webkit-background-clip: padding;
	background-clip: padding-box;
}

.splitter-pane-resizer.horizontal {
	height: 11px;
	margin: -5px 0;
	border-top: 5px solid rgba(255, 255, 255, 0);
	border-bottom: 5px solid rgba(255, 255, 255, 0);
	cursor: row-resize;
	width: 100%;
}

.splitter-pane-resizer.vertical {
	width: 11px;
	height: 100%;
	margin-left: -5px;
	border-left: 5px solid rgba(255, 255, 255, 0);
	border-right: 5px solid rgba(255, 255, 255, 0);
	cursor: col-resize;
}
</style>

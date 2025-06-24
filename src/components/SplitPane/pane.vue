<template>
	<div :class="classes">
		<slot></slot>
	</div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";


const props = defineProps<{
	
	split: 'vertical' | 'horizontal';
	className?: string;
}>();




const classes = computed(() => [props.split, props.className].join(" "));
const percent = ref(20);
</script>

<style scoped>
.splitter-pane.vertical.splitter-paneL {
	position: absolute;
	left: 0px;
	height: 100%;
	padding-right: 3px;
}

.splitter-pane.vertical.splitter-paneR {
	position: absolute;
	right: 0px;
	height: 100%;
	padding-left: 3px;
}

.splitter-pane.horizontal.splitter-paneL {
	position: absolute;
	top: 0px;
	width: 100%;
}

.splitter-pane.horizontal.splitter-paneR {
	position: absolute;
	bottom: 0px;
	width: 100%;
	padding-top: 3px;
}
</style>

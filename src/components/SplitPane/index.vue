<template>
	<div :style="containerStyle" class="vue-splitter-container clearfix" @mousemove="onMouseMove" role="presentation"
		aria-label="可调整大小的分割面板">
		<!-- 左侧/上侧面板 -->
		<Pane class="splitter-pane splitter-paneL" :split="props.split" :style="leftPaneStyle"
			:aria-label="props.split === 'vertical' ? '左侧面板' : '上侧面板'">
			<slot name="paneL"></slot>
		</Pane>

		<!-- 分割条 -->
		<Resizer :className="className" :style="resizerStyle" :split="props.split" @mousedown.native="onMouseDown"
			@mouseup="onMouseUp" @click.native="onClick" :aria-label="'拖动调整面板大小'" :aria-valuenow="percent"
			:aria-valuemin="getMinPercent()" :aria-valuemax="100 - getMinPercent()" role="separator" tabindex="0">
		</Resizer>

		<!-- 右侧/下侧面板 -->
		<Pane class="splitter-pane splitter-paneR" :split="props.split" :style="rightPaneStyle"
			:aria-label="props.split === 'vertical' ? '右侧面板' : '下侧面板'">
			<slot name="paneR"></slot>
		</Pane>

		<!-- 拖动时的遮罩层 -->
		<div class="vue-splitter-container-mask" v-if="active" aria-hidden="true"></div>
	</div>
</template>

<script setup lang="ts">
import {
	computed,
	defineAsyncComponent,
	onMounted,
	onUnmounted,
	ref,
	watchEffect,
} from "vue";

// 使用异步组件提高初始加载性能
const Pane = defineAsyncComponent(() => import("./pane.vue"));
const Resizer = defineAsyncComponent(() => import("./resizer.vue"));

// 定义组件属性
const props = defineProps<{
	/** 最小百分比限制，默认为10 */
	minPercent?: number;
	/** 默认分割百分比 */
	defaultPercent?: number;
	/** 分割方向：垂直或水平 */
	split: "vertical" | "horizontal";
	/** 自定义类名 */
	className?: string;
}>();

// 定义事件
type ResizeEvent = (e: "resize", percent: number) => void;
const emit = defineEmits<ResizeEvent>();

// 状态变量
const active = ref(false);
const hasMoved = ref(false);
const percent = ref(props.defaultPercent ?? 50); // 提供默认值

// 监听defaultPercent变化
watchEffect(() => {
	if (props.defaultPercent !== undefined) {
		percent.value = props.defaultPercent;
	}
});

// 计算属性
const type = computed(() => (props.split === "vertical" ? "width" : "height"));
const resizeType = computed(() =>
	props.split === "vertical" ? "left" : "top",
);

// 计算光标样式
const cursor = computed(() => {
	return active.value
		? props.split === "vertical"
			? "col-resize"
			: "row-resize"
		: "";
});

// 计算用户选择样式
const userSelect = computed(() => (active.value ? "none" : ""));

// 组合容器样式为一个对象
const containerStyle = computed(() => {
	const style: Record<string, string> = {};

	if (cursor.value) {
		style.cursor = cursor.value;
	}

	if (userSelect.value) {
		style.userSelect = userSelect.value;
	}

	return style;
});

// 左侧面板样式
const leftPaneStyle = computed(() => {
	return { [type.value]: `${percent.value}%` };
});

// 右侧面板样式
const rightPaneStyle = computed(() => {
	return { [type.value]: `${100 - percent.value}%` };
});

// 分割条样式
const resizerStyle = computed(() => {
	return { [resizeType.value]: `${percent.value}%` };
});

// 获取最小百分比限制
const getMinPercent = (): number => props.minPercent ?? 10;

// 计算新的百分比值
const calculateNewPercent = (e: MouseEvent, container: HTMLElement): number => {
	let offset = 0;
	let target = container;

	// 计算容器偏移量
	if (props.split === "vertical") {
		while (target) {
			offset += target.offsetLeft;
			target = target.offsetParent as HTMLElement;
		}
	} else {
		while (target) {
			offset += target.offsetTop;
			target = target.offsetParent as HTMLElement;
		}
	}

	// 计算百分比
	const currentPage = props.split === "vertical" ? e.pageX : e.pageY;
	const targetOffset =
		props.split === "vertical" ? container.offsetWidth : container.offsetHeight;

	return Math.floor(((currentPage - offset) / targetOffset) * 10000) / 100;
};

// 鼠标抬起
const onMouseUp = () => {
	active.value = true;
};

// 使用防抖优化鼠标移动事件
let animationFrameId: number | null = null;
const onMouseMove = (e: MouseEvent) => {
	// 检查鼠标按钮状态
	if (e.buttons === 0) {
		active.value = false;
	}

	if (!active.value) return;

	// 在requestAnimationFrame之前保存container引用
	const container = e.currentTarget as HTMLElement;

	// 使用requestAnimationFrame优化性能
	if (animationFrameId !== null) {
		cancelAnimationFrame(animationFrameId);
	}

	animationFrameId = requestAnimationFrame(() => {
		// 使用之前保存的container引用，而不是从事件对象中获取
		const newPercent = calculateNewPercent(e, container);
		const minPercent = getMinPercent();

		// 应用百分比限制
		if (newPercent > minPercent && newPercent < 100 - minPercent) {
			percent.value = newPercent;
			emit("resize", percent.value);
		}

		hasMoved.value = true;
		animationFrameId = null;
	});
};

// 鼠标按下
const onMouseDown = () => {
	active.value = true;
	hasMoved.value = false;
};

// 点击事件 - 重置为50%
const onClick = () => {
	if (!hasMoved.value) {
		percent.value = 50;
		emit("resize", percent.value);
	}
};

// 清理动画帧
onUnmounted(() => {
	if (animationFrameId !== null) {
		cancelAnimationFrame(animationFrameId);
	}
});
</script>

<style scoped>
/* 清除浮动 */
.clearfix:after {
	visibility: hidden;
	display: block;
	font-size: 0;
	content: " ";
	clear: both;
	height: 0;
}

/* 分割面板容器 */
.vue-splitter-container {
	height: 100%;
	position: relative;
	overflow: hidden;
	/* 防止内容溢出 */
	touch-action: none;
	/* 优化触摸设备体验 */
}

/* 拖动时的遮罩层 */
.vue-splitter-container-mask {
	z-index: 9999;
	width: 100%;
	height: 100%;
	position: absolute;
	top: 0;
	left: 0;
	background-color: transparent;
	/* 确保遮罩透明 */
	pointer-events: none;
	/* 允许点击穿透 */
}

/* 响应式调整 - 在小屏幕上提供更好的触摸体验 */
@media (max-width: 768px) {
	.vue-splitter-container {
		touch-action: pan-x pan-y;
		/* 在移动设备上允许平移 */
	}
}
</style>

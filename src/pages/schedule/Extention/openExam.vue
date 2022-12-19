<template>
	<view class="w-1">
		<Ztl>
			<template v-slot:navName>
				<div>考试安排</div>
			</template>
		</Ztl>
		<view class="exam-container w-1 p-3 animation-scale-up position-relative" v-if="data.length">
			<view v-for="(item, index) of data" :key="index" class="exam-item mb-3 w-1 depth-4" :style="{
          background: `linear-gradient(360deg,${'#fff'} 50%,${getColor(
            item.id
          )} 50%)`,
          borderLeft: `${getThemeColor.curBg} 6px solid`,
        }">
				<view class="w-1 exam-date">
					<text class="iconfont icon-icon-test5 pr-1"> </text>
					<text>{{ getDate(item.date) }}</text>
					<text>{{ item.time }}</text>
				</view>
				<view class="exam-class py-3 flex-center web-font fw-05"><text> {{ item.clazzName }}</text></view>
				<view><text>
						<text class="iconfont icon-icon-test15 pr-1"></text>{{ item.address }}</text></view>
				<view class="text-dark"><text>
						<text class="iconfont icon-icon-test21 pr-1"></text>{{ item.campus }}</text></view>
				<view class="text-dark otherinfo-container">
					<text class="iconfont icon-icon-test28 pr-1"></text>
					<text class="otherinfo">
						<text>{{ item.sort }}</text>
						<text class="borderofinfo"> | </text>
						<text>{{ item.type }}</text>
					</text>
				</view>
				<view class="countdown flex-center">
					<text class="text-dark web-font fw-05" :style="{ fontSize: '180px' }"
						v-if="_getCountDown(item.date) > 0">{{ _getCountDown(item.date) }}</text>
					<text class="text-dark web-font fw-05" :style="{ fontSize: '180px' }" v-else>G</text>
				</view>
			</view>
		</view>
		<view v-else class="position-absolute exam-empty-area">
			<view class="exam-empty depth-ming p-3 flex-center">
				<text class="iconfont icon-icon-test30 pr-2"></text><text>近期没有考试</text>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		computed,
		onMounted,
		ref,
		watch
	} from "vue";
	import {
		useStore
	} from "vuex";
	import Ztl from "@/components/common/Ztl.vue";
	import {
		getStorageSync,
		getColor,
		getCountDown
	} from "@/utils/common.js";
	export default {
		components: {
			Ztl,
		},
		setup() {
			const store = useStore();
			let data = ref([]);

			const getDate = computed(() => {
				return (date) => {
					let newDate = new Date(date);

					return `${newDate.getMonth() + 1}.${newDate.getDate()}`;
				};
			});

			const _getCountDown = computed(() => {
				return (date) => {
					return getCountDown(date);
				};
			});

			const getThemeColor = computed(() => {
				return store.state.theme;
			});

			onMounted(() => {
				data.value = getStorageSync("futureExam");
			});

			return {
				data,
				getDate,
				getThemeColor,
				getColor,
				_getCountDown
			};
		},
	};
</script>

<style lang="scss" scoped>
	.exam-container {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
		font-size: 14px;

		.exam-item {
			position: relative;
			z-index: 4;
			display: flex;
			flex-direction: column;
			justify-content: space-evenly;
			align-items: flex-start;
			height: 200px;
			border-radius: 15px;
			padding-left: 20px;
			overflow: hidden;

			.exam-date {
				display: flex;
				flex-direction: row;
				justify-content: flex-start;

				align-items: center;
				color: #f17251;
				font-size: 16px;

				text {
					margin-right: 10px;
				}
			}

			.exam-class {
				font-size: 28px;
				max-width: 100%;

				text {
					overflow: hidden;

					text-overflow: ellipsis;

					white-space: nowrap;
				}
			}

			.otherinfo-container {
				display: flex;
				flex-direction: row;
				justify-content: flex-start;
				align-items: center;

				.otherinfo {
					display: flex;
					flex-direction: row;
					justify-content: flex-start;
					align-items: center;
				}
			}

			.countdown {
				position: absolute;
				right: -15px;
				bottom: -30px;
				z-index: 1;
				transform: rotate(-45deg);
			}
		}

		.borderofinfo {
			margin-left: 5px;
			margin-right: 5px;
		}
	}

	.exam-empty-area {
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);

		.exam-empty {
			.iconfont {
				font-size: 30px;
			}

			height: 300px;
			width: 300px;
			font-size: 30px;
			background-color: #fff;
			opacity: 0.8;
			border-radius: 10px;
		}
	}
</style>

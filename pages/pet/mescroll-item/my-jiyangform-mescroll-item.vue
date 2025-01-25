<template>
	 <mescroll-uni :ref="'mescrollRef' + i" height="100%" top="0" @init="mescrollInit" :up="upOption" @up="upCallback" :down="downOption" @down="downCallback" @emptyclick="emptyClick">
		<view class="item" v-for="(item, index) in items" :key="index" >
			
			<view class="right">
				<view class="title u-line">
					开始地址:{{item.address}}
				</view>
				
				<view class="base">
					<view class="tag"v-if="item.type == 1">猫</view>
					<view class="tag"v-if="item.type == 2">狗</view>
					<view class="tag"v-if="item.type == 3">其他</view>
					<view class="tag"v-if="item.food == 0">自带粮食:无</view>
					<view class="tag"v-if="item.food == 1">自带粮食:有</view>

					<view class="tag">重量:{{item.weight}}</view>
				</view>
				
				<view class="area">{{item.area}}</view>
				
				<view class="reward" v-if="tabs[i].type == 2">悬赏￥<text class="money">{{item.money}}</text></view>
				<view class="summary u-line-1" v-if="tabs[i].type != 2">{{item.content}}</view>
			</view>
			
			<view class="bottom">
				<view class="meta">
					<view class="datetime">预约时间：{{item.advance_time}}</view>
					
				</view>
				
				<u-line margin="20rpx 0 0 0" />
				
				<view class="option">
					<u-button type="primary" size="mini" shape="circle" plain @click="navTo(`/pages/pet/jiyangform-post?id=${item.id}`)">编辑查看</u-button>

					<u-button type="error" size="mini" shape="circle" plain @click="jiyangTrash(item.id)">删除</u-button>
				</view>
			</view>
		</view>
	</mescroll-uni>
</template>

<script>
import moment from '@/common/moment';
import MescrollMixin from '@/components/mescroll-uni/mescroll-mixins.js';
import MescrollMoreItemMixin from '@/components/mescroll-uni/mixins/mescroll-more-item';
import { jiyangformMyList, petStateOn, petStateOff, jiyangTrash } from '@/api/pet';

export default {
	mixins: [MescrollMixin, MescrollMoreItemMixin],
	data() {
		return {
			downOption:{
				use: true, // 是否启用下拉刷新; 默认true
				auto: false, // 是否在初始化完毕之后自动执行下拉刷新的回调; 默认true
				textLoading: '刷新中 ...'
			},
			upOption:{
				use: true, // 是否启用上拉加载; 默认true
				auto: false, // 是否在初始化完毕之后自动执行上拉加载的回调; 默认true
				isLock: false, // 是否锁定上拉加载 (可用于不触发upCallback,只保留回到顶部按钮的场景)
				page: {
					num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
					size: 10 // 每页数据的数量,默认10
				},
				noMoreSize: 1 ,// 配置列表的总数量要大于等于5条才显示'-- END --'的提示
				toTop: {
					src: '/static/pet/mescroll-totop.png',
					offset: 200
				},
				empty: {
					icon: '/static/pet/mescroll-empty.png',
					tip: '~ 空空如也 ~',
					// btnText: '去看看'
				},
				lazyLoad: {
					use: true,
					attr: 'imgurl'
				}
			},
			type: 2,
			cate: 0,
			items: [],
		}
	},
	props:{
		i: Number,
		index: {
			type: Number,
			default() {
				return 0;
			}
		},
		tabs: {
			type: Array,
			default() {
				return [];
			}
		},
		params: {
			type: Object,
			default() {
				return {};
			}
		}
	},
	filters: {
		datetime(val) {
			return moment(val * 1000).format('YYYY-MM-DD HH:mm');
		},
	},
	methods: {
		navTo(route) {
			this.$mRouter.push({ route });
		},
		async petStateOn(id) {
			await this.$http.get(`${petStateOn}`, {
				id: id
			}).then(async r => {
				this.$mHelper.toast('操作成功！');
				this.mescroll.resetUpScroll();
			});
		},
		async petStateOff(id) {
			await this.$http.get(`${petStateOff}`, {
				id: id
			}).then(async r => {
				this.$mHelper.toast('操作成功！');
				this.mescroll.resetUpScroll();
			});
		},
		async jiyangTrash(id) {
			let _this = this;
		
			uni.showModal({
				content: '确定要删除吗？',
				success(res) {
					if (res.confirm) {
						_this.$http.get(`${jiyangTrash}`, {
							id: id
						}).then(async r => {
							_this.$mHelper.toast('删除成功！');
							_this.mescroll.resetUpScroll();
						});
					}
				}
			});
		},
		downCallback() {
			this.mescroll.resetUpScroll();
		},
		async upCallback(page) {
			let pageNum = page.num; // 页码, 默认从1开始
			let pageSize = page.size; // 页长, 默认每页10条
			let params = { page: pageNum, pageSize: pageSize };
			let state = this.tabs[this.i].key;
			
			Object.assign(params, { state: state });

			await this.$http.get(`${jiyangformMyList}`, params).then(async r => {
				if (params.page == 1) this.items = [];
				let items = r.data;
				items.forEach((item, index) => {
					item.state_name = '进行中';
					if (item.state == 1) item.state_name = '已完成';
					
					/* if (item.type == 1) {
						item.state_name = '待领养';
						if (item.state == 1) item.state_name = '已领养';
					} */
					
					item.review_name = '待审核';
					if (item.review == 1) item.review_name = '已审核';
					if (item.review == -1) item.review_name = '未通过';
				});
				this.items = this.items.concat(items);
				this.mescroll.endByPage(r.data.length, this.pageSize);
				// this.mescroll.endSuccess();
				// this.mescroll.endSuccess(items.length, this.hasNext);
				// this.mescroll.endBySize(items.length, parseInt(r.headers['x-pagination-total-count']));
			}).catch(() => {
				this.mescroll.endErr();
			});
		},
		emptyClick() {
			
		}
	}
}
</script>

<style lang="scss">
.item {
	background: #FFF;
	border-radius: 8px;
	display: flex;
	flex-wrap: wrap;
	padding: 24rpx;
	margin: 30rpx 30rpx 0;
	.left {
		flex-basis: 33%;
	}
	.right {
		//flex-grow: 1;
		//flex-basis: 67%;
		width: 100%;
		padding: 0 24rpx;
		.title {
			font-size: 25rpx;
		}
		.base {
			margin-top: 14rpx;
			.tag {
				height: 38rpx;
				line-height: 38rpx;
				background: #F6F7FB;
				color: #666;
				font-size: 24rpx;
				border-radius: 10rpx;
				padding: 0 20rpx;
				margin-right: 14rpx;
				display: inline-block;
			}
			.tag:nth-child(3) {
				margin-right: 0;
			}
		}
		.area {
			color: #666;
			font-size: 24rpx;
			margin-top: 20rpx;
		}
		.reward {
			color: #EB568F;
			font-size: 24rpx;
			.money {
				color: #EB568F;
				font-size: 50rpx;
			}
		}
		.summary {
			color: #666;
			font-size: 24rpx;
			padding-top: 16rpx;
		}
	}
	.bottom {
		flex-basis: 100%;
		margin-top: 20rpx;
		.meta {
			color: #999;
			font-size: 22rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.datetime {
				font-size: inherit;
			}
			.view {
				font-size: inherit;
				padding: 0 10rpx;
			}
			.share {
				font-size: inherit;
			}
		}
		.option {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-top: 20rpx;
		}
	}
}
</style>
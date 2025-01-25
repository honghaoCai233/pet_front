<template>
	<view class="wrap">
		<u-navbar :is-back="false" :title="title" title-color="#000">
			<view class="slot-wrap" @tap="navTo('/pages/pet/city')">	
				<i class="iconfont iconicon-test" :class="'text-' + themeColor.name"/> 
				<view class="city">{{city.title}} <text class="iconfont iconxiajiantou2" /></view>
			</view>
		</u-navbar>
					
		<view class="swiper-adv" v-if="advs.index_top.length">
			<!-- <u-swiper :list="advs.index_top" name="cover" :current="current" field="content" mode="round" height="300" border-radius="15" @click="navToIndex" ></u-swiper> -->
			
			<uni-swiper-dot :info="advs.index_top" :current="current" field="content" mode="round" :dotsStyles="{ backgroundColor: '#FFF', color: themeColor.color, selectedBackgroundColor: themeColor.color, border: 'none', selectedBorder: 'none' }">
				<swiper class="swiper-box" :current="current" circular autoplay :indicator-dots="false" indicator-color="#FFF" :indicator-active-color="themeColor.color" @animationfinish="animationfinish">
					<swiper-item v-for="(item, index) in advs.index_top" :key="index" @tap="indexTopToDetailPage(item)">
						<u-image :src="item.cover" width="100%" height="300" border-radius="15" mode="aspectFill" /> 
					</swiper-item>
				</swiper>
			</uni-swiper-dot>
		</view>
		
		<!-- <view class="swiper">
			<view class="swiper-box">
				<rf-swipe-dot :info="advs.index_top" mode="dot" :current="current" field="title">
					<swiper @change="handleDotChange" autoplay="true">
						<swiper-item v-for="(item, index) in advs.index_top" @tap="indexTopToDetailPage(item)" :key="index">
							<view class="swiper-item">
								<u-image :src="item.cover" width="100%" height="240" border-radius="20" mode="aspectFill" />
							</view>
						</swiper-item>
					</swiper>
				</rf-swipe-dot>
			</view>
		</view>
				
		<!-- 公告 -->
		<rf-swiper-slide v-if="notices.length > 0" :list="notices" class="rf-skeleton" @navTo="navTo('/pages/index/notice/notice')">
			<view slot="header" class="swiper-slide-header">
				<text class="iconfont icongonggao" :class="'text-' + themeColor.name"></text>
			</view>
		</rf-swiper-slide>
		
		<!-- 频道 -->
		<swiper :indicator-active-color="themeColor.color" 
		indicator-color="#666" 
		 class="channel-wrap" :indicator-dots="channels.length > 10"
					:style="{height: channels.length <= 5 ? '200rpx' : '400rpx'}">
			<swiper-item class="channel-list">
				<view  class="channel" v-for="(item, index) in channels" :key="index" @tap.stop="navToChannel(index)">
					<view class="icon-wrap">
						<!-- <u-image :src="'/static/pet/icon-' + item.key  + '.png'" width="84" height="84" borderRadius="15" mode="aspectFill" /> -->				
							
							<u-icon :name="item.icon" custom-prefix="custom-icon" size="100" :color="themeColor.color" />
					</view>
					<view class="text">{{ item.name}}</view>
				</view>
			</swiper-item>
		</swiper>
		
		<!--列表-->
		<view class="pet-wrap" style="padding-bottom: 1%;">
			<view class="sticky">
				<view class="sticky-tabs">
					<u-tabs-swiper ref="tabs" :list="$mData.types" :current="tabsCurrent" @change="tabsChange" :is-scroll="false" bar-height="6" bar-width="40" :active-color="themeColor.color"></u-tabs-swiper>
				</view>
				
				<view class="sticky-more" @tap="navToChannel(0)">
					更多 <text class="iconfont iconyou" />
				</view>
			</view>
			
			<swiper :current="swiperCurrent" @transition="swiperTransition" @animationfinish="swiperAnimationfinish" style="height:1150rpx;">
				<swiper-item v-for="(item, tabsIndex) in $mData.types" :key="tabsIndex">
					<pet-index-mescroll-item ref="mescrollItem" :i="tabsIndex" :index="tabsIndex" :tabs="$mData.types" :params="params"></pet-index-mescroll-item>
				</swiper-item>
			</swiper>
		</view>
		
		<u-gap height="20" />

		<!--备案-->
		<!--#ifdef H5-->
		<view class="copyright" v-if="config.web_site_icp">
			{{ config.copyright_desc }}
			
			<a href="http://www.beian.miit.gov.cn">{{ config.web_site_icp }}</a>
		</view>
		<!-- #endif -->

		<!--页面加载动画-->
		<rfLoading isFullScreen :active="loading"></rfLoading>
		<rf-back-top :scrollTop="scrollTop"></rf-back-top>
	
	</view>
</template>

<script>
import rfSwipeDot from '@/components/rf-swipe-dot';
import rfSwiperSlide from '@/components/rf-swiper-slide';
import { mapMutations } from 'vuex';
import PetIndexMescrollItem from './pet-index-mescroll-item.vue';
import { indexList } from '@/api/product';
import { petIndex, petList } from '@/api/pet';

const QQMapWX = require('@/common/qqmap-wx-jssdk.min.js');

export default {
	components: {
		rfSwipeDot,
		rfSwiperSlide,
		PetIndexMescrollItem,
	},
	data() {
		return {
			$mData: this.$mData,
			appName: this.$mSettingConfig.appName,
			path: '/pages/index/index',
			title: this.$mSettingConfig.appName + '·领养平台',
			qqmapsdk: null,
			city: { 
				id: 0,
				title: '全国'
			},
			current: 0, // 轮播图index
			advs: {
				index_top: [11]
			}, // 广告图
			notices: [1111],
			channels: [],
			tabsCurrent: 0, // tabs组件的current值，表示当前活动的tab选项
			swiperCurrent: 0, // swiper组件的current值，表示当前那个swiper-item是活动的
			config: {}, // 配置
			loading: true,
			scrollTop: 0,
			kefuShow: true,
			loadingType: 'more',
			newsBg: this.$mAssetsPath.newsBg,
			errorImage: this.$mAssetsPath.errorImage,
			pages: [1, 1, 1, 1],
			// type: 1,
			// cate: 0,
			moneySymbol: this.moneySymbol,
			genders: ['不限', '男孩', '女孩'],
			ages: ['不限', '幼年', '成年', '老年'],
			sizes: ['不限', '小型', '中型', '大型'],
			hairs: ['不限', '长毛', '短毛', '无毛'],
			states: ['不限', '已免疫', '已绝育', '已驱虫'],
			activeStyle: {
				background: '#FFCE0C',
				color: '#01040A'
			},
			filterShow: false,
			params: {}
		};
	},
	onLoad() {
		this.qqmapsdk = new QQMapWX({
			key: this.$mData.maps[0].key
		});
		
		this.initData();
	},
	onShow() {
		let city = uni.getStorageSync('city');

		if (city && this.city.id != city.id) {
			this.city = city;
			
			this.$nextTick(() => {
				for (let tab of this.$mData.types) {
					this.getMescroll(tab.key-1).triggerDownScroll();
				}
			});
		}
	},
	onPageScroll(e) {
		this.scrollTop = e.scrollTop;
	},
	/* onReachBottom() {
		this.mescroll && this.mescroll.onReachBottom();
	},
	onPageScroll(e) {
		this.mescroll && this.mescroll.onPageScroll(e);
	}, */
	onPullDownRefresh() {
		this.getIndexList('refresh');
	},
	onShareAppMessage(res) {
		return { 
			title: this.title,
			path: this.path
		};
	},
	computed: {
		statusBar() {
			const e = uni.getSystemInfoSync();
			return e.statusBarHeight;
		},
		bottom() {
			let bottom = 0;
			/*  #ifdef H5  */
			bottom = 90;
			/*  #endif */
			return bottom;
		}
	},
	methods: {
		// 数据初始化
		initData() {
			this.getCity();
			this.getIndexList();
		},
		// 监听轮播图切换
		handleDotChange(e) {
			this.current = e.detail.current;
		},
		// 通用跳转
		navTo(route) {
			this.$mRouter.push({ route });
		},
		// Tabbar跳转
		switchTab(route) {
			this.$mRouter.switchTab({ route });
		},
		navToChannel(index) {
			
			
			let channel = this.channels[index];

			switch (channel.type) {
				case 'push':
					this.navTo(channel.route);
					this.switchTab(channel.route);
					break;
				case 'switchTab':
					this.switchTab(channel.route);
					this.navTo(channel.route);
					break;
				case 'web':
					this.navTo(`/pages/pet/web?title=${channel.name}&url=${channel.route}`);
					break;
				case 'mp':
					// #ifndef MP
					this.$mHelper.toast('不支持跳转小程序');
					// #endif

					// #ifdef MP
					uni.navigateToMiniProgram({
					  appId: channel.route
					});
					// #endif
					break;
				default:
					this.navTo(channel.route);
					break;
			}
		},
		
		// 跳至广告图指定页面
		indexTopToDetailPage(item) {
			
			
			uni.navigateTo({
			  url: `/pages/public/web-view?url=${item.jump_link}`,// 要跳转的网址
			  success(res) {
			    console.log('跳转成功', res)
			  },
			  fail(err) {
			    console.log('跳转失败', err)
			  }
			})
			
			//this.$mHelper.handleBannerNavTo(item.jump_type, item.jump_link, item.id);
		},
		// 获取主页数据
		async getIndexList(refresh) {
			await this.$http.get(`${indexList}`, {}).then(async r => {
				uni.setNavigationBarTitle({ title: this.appName });
				if (refresh === 'refresh') uni.stopPullDownRefresh();
				this.initIndexData(r.data);
				this.loading = false;
			}).catch(() => {
				this.loading = false;
				if (refresh === 'refresh') uni.stopPullDownRefresh();
			});
		},
		// 首页参数赋值
		initIndexData(data) {
			this.advs = data.adv;
			this.notices = data.announce;
			this.config = data.config;
			this.channels = data.channels;
			this.$mHelper.handleWxH5Share(this.share.share_title || this.appName, this.share.share_desc || `欢迎来到${this.appName}`, this.share.share_link || this.$mConfig.hostUrl, this.share.share_cover || this.$mSettingConfig.appLogo);
		},
		// 跳转至商品详情页
		navToDetailPage(data) {
			const { id } = data;
			if (!id) return;
			this.navTo(`/pages/pet/view?id=${id}`);
		},
		animationfinish(e) {
			this.current = e.detail.current;
		},
		// tabs通知swiper切换
		tabsChange(index) {
			this.swiperCurrent = index;
		},
		// swiper-item左右移动，通知tabs的滑块跟随移动
		swiperTransition(e) {
			let dx = e.detail.dx;
			this.$refs.tabs.setDx(dx);
		},
		// 由于swiper的内部机制问题，快速切换swiper不会触发dx的连续变化，需要在结束时重置状态
		// swiper滑动结束，分别设置tabs和swiper的状态
		swiperAnimationfinish(e) {
			let tabsCurrent = e.detail.current;
			this.$refs.tabs.setFinishCurrent(tabsCurrent);
			this.swiperCurrent = tabsCurrent;
			this.tabsCurrent = tabsCurrent;
			
			this.cate = tabsCurrent;
		},
		getMescroll(i) {
			let mescrollItems = this.$refs.mescrollItem;
		
			if (mescrollItems) {
				let item = mescrollItems[i];
				if (item) return item.mescroll;
			}
		
			return null;
		},
		getCity() {
			let city = uni.getStorageSync('city');
			
			if (city) {
				this.city = city;
			} else {
				let _this = this;
				// #ifdef MP
				uni.authorize({
					scope: 'scope.userLocation',
					success() {
				// #endif
						uni.getLocation({
							type: 'gcj02',
							geocode: true,
							success(res) {
								
								_this.qqmapsdk.reverseGeocoder({
									location: {
										latitude: res.latitude,
										longitude: res.longitude
									},
									success(res) {
										
										let city = {
											id: res.result.ad_info.city_code - 156000000,
											title: res.result.ad_info.city
										}
										uni.setStorageSync('city', city);
										_this.city = city;
										_this.getMescroll(_this.swiperCurrent).triggerDownScroll();
									},
									fail(error) {
										console.error(error);
									}
								});
							},
							fail(error) {
								console.error(error);
							}
						});
				// #ifdef MP
					}
				});
				// #endif
			}
		}
	}
};
</script>

<style lang="scss">
page {
	background: #F5F5F5;
	.wrap {
		.slot-wrap {
			display: flex;
			align-items: center;
			/* flex: 1; */
			padding: 0 30rpx;
			.city {
				max-width: 150rpx;
				color: #666;
				white-space: nowrap;
				text-overflow: ellipsis; 
				overflow: hidden; 
				// -webkit-line-clamp: 1;
				// -webkit-box-orient: vertical;
			}
		}
		.swiper-adv {
			background: $color-white;
			padding: 10rpx 20rpx;
			.swiper-box {
				width: 100%;
				height: 300rpx;
				overflow: hidden;
				border-radius: 15rpx;
				//box-shadow: 0rpx 8rpx 25rpx rgba(0, 0, 0, 0.2);
				//兼容ios，微信小程序
				//position: relative;
				swiper {
					width: 100%;
					height: 40vw;
				}
			}
		}
		/*轮播图2*/
		.swiper-item-text {
			position: absolute;
			bottom: 16rpx;
			left: 30rpx;
			height: 48rpx;
			line-height: 48rpx;
			background: rgba(0, 0, 0, 0.2);
			width: 90%;
			color: $color-white;
			border-bottom-left-radius: 12rpx;
			padding-left: 20rpx;
		}
		/*频道列表*/
		.channel-wrap {
			height: 220rpx;
			background-color: #FFF;
			margin-top: 20rpx;
			padding: 30rpx 50rpx 0 50rpx;
			.channel-list {
				width: 100%;
				display: flex;
				justify-content: space-between;
				flex-wrap: wrap;
				.channel {
					margin-top: 10rpx;
					width: calc(20% - 20rpx);
					height: 132rpx;
					display: flex;
					text-align: center;
					flex-wrap: wrap;
					.icon-wrap {
						width: 100%;
						display: flex;
						justify-content: center;
					}
					.text {
						width: 100%;
						color: #333;
						font-size: 26rpx;
						margin-top: 16rpx;
					}
				}
				//变灰
				// .channel:nth-child(2) .text {
				// 	opacity: 0.5;
				// }
			}
		}
		/*宠物列表*/
		.pet-wrap {
			margin-top: 20rpx;
			background: $color-white;
			.sticky {
				display: flex;
				align-items: center;
				.sticky-tabs {
					width: 80%;
				}
				.sticky-more {
					width: 20%;
					height: 80rpx;
					line-height: 80rpx;
					color: #999;
					font-size: 28rpx;
					background: #FFF;
					text-align: center;
				}
			}
		}

		/*版权显示*/
		.copyright {
			margin: 10rpx 0;
			width: 100%;
			text-align: center;
			color: #666;
			a {
				display: block;
				color: #666;
				text-decoration: none;
			}
		}
	}
}
</style>

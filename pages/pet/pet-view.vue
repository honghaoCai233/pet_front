<template>
	<view class="wrap">
		<mescroll-body ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback" :down="downOption" :up="upOption">
			<!-- <u-swiper :list="item.images" height="600" border-radius="0" :current="current" field="content" mode="dot" v-if="item.images.length" @click="previewImage"></u-swiper> -->
			
			<swiper class="swiper-box" :current="current" circular :autoplay="!item.video" indicator-dots indicator-color="#FFF" :indicator-active-color="themeColor.color" @change="swiperChange" v-if="item.images.length || item.video">
				<swiper-item v-if="item.video">
					<video id="myVideo" :src="item.video" controls objectFit="contain"></video>
				</swiper-item>
				
				<swiper-item v-for="(image, index) in item.images" :key="index">
					<u-image :src="image" width="100%" height="600" mode="aspectFill" @tap="previewImage" /> 
				</swiper-item>
			</swiper>
			
			<view class="subwrap u-p-b-40">
				<view class="title u-p-t-40">{{item.title}}</view>
				
				<view class="reward u-m-t-10" v-if="item.type == 2 && item.mode == 2">悬赏￥<text class="money">{{item.money}}</text></view>

				<view class="bottom u-m-t-30 u-m-b-20">
					<view class="area"><u-icon name="map" :color="themeColor.color" />{{item.city}}/{{item.area}}</view>
					<view class="datetime">{{item.updated_at}}</view>
					<view class="view">{{item.view}}查看</view>
					<view class="share">{{item.share}}转发</view>
				</view>
				
				<u-line />
				
				<view class="subtitle u-m-t-30">
					<view class="line" :style="{ background: themeColor.color }" />
					基本信息
				</view>
				
				<view class="feature u-m-t-30">
					<view class="left"><u-avatar :src="item.poster" size="120" /></view>
					
					<view class="right">
						<view class="nickname u-m-b-10" v-if="item.nickname">{{item.nickname}}</view>
						
						<view class="base u-m-b-10">
							<u-button type="info" size="mini" :custom-style="baseCustomStyle" v-if="item.gender_name">{{item.gender_name}}</u-button>
							<u-button type="info" size="mini" :custom-style="baseCustomStyle" v-if="item.age_name">{{item.age_name}}</u-button>
							<u-button type="info" size="mini" :custom-style="baseCustomStyle" v-for="(tag, index) in item.tags" :key="index">{{tag}}</u-button>
						</view>
						
						<u-divider half-width="50%"></u-divider>
									
						<view class="status u-m-t-20">
							<u-button type="info" size="mini" plain :custom-style="statusCustomStyle">{{item.vaccine_name}}</u-button>
							<u-button type="info" size="mini" plain :custom-style="statusCustomStyle">{{item.deworm_name}}</u-button>
							<u-button type="info" size="mini" plain :custom-style="statusCustomStyle">{{item.sterilize_name}}</u-button>
							<u-button type="info" size="mini" plain :custom-style="statusCustomStyle">{{item.source_name}}</u-button>
							<u-button type="info" size="mini" plain :custom-style="statusCustomStyle">{{item.size_name}}</u-button>
							<u-button type="info" size="mini" plain :custom-style="statusCustomStyle">{{item.hair_name}}</u-button>
						</view>
					</view>
				</view>
				
				<view class="subtitle u-m-t-30">
					<view class="line" :style="{ background: themeColor.color }" />
					{{$mData.types[item.type-1].title}}地点
				</view>
				
				<view class="sheet u-m-t-30 u-m-b-20">
					<view class="datetime" v-if="item.type != 1"><u-icon name="clock" /> {{$mData.types[item.type-1].title}}时间：{{item.datetime }}</view>
					<view class="address" @tap="openLocation"><u-icon name="map" /> {{$mData.types[item.type-1].title}}地址：{{item.address}}</view>
					<u-divider half-width="30%" color="#999" :fontSize="24" @tap="openLocation">点击查看地图</u-divider>
				</view>
				
				<view class="subtitle u-m-t-30">
					<view class="line" :style="{ background: themeColor.color }" />
					{{$mData.types[item.type-1].content}}
				</view>

				<view class="content u-m-t-30">{{item.content}}</view>
				
				<view class="subtitle u-m-t-30" v-if="item.type == 1">
					<view class="line" :style="{ background: themeColor.color }" />
					有偿无偿
				</view>
				
				<view class="content u-m-t-30" v-if="item.type == 1">
					<text v-if="item.mode == 0">免费领养</text>
					<text v-if="item.mode == 1">红包{{item.money}}元领养</text>
					<text v-if="item.mode == 2">押金{{item.money}}元领养，{{item.refund_condition}}</text>
				</view>
			
				<view class="subtitle u-m-t-30" v-if="item.type == 1">
					<view class="line" :style="{ background: themeColor.color }" />
					领养要求
				</view>
				
				<view class="requirements u-m-t-30" v-if="item.type == 1">
					<block v-for="(requirement, index) in item.requirements" :key="index">
						<text class="iconfont iconxiala" :style="requirementStyle" /> {{requirement}} <br />
					</block>
					
					<block v-if="item.other_requirement">
						<text class="iconfont iconxiala" :style="requirementStyle" /> {{item.other_requirement}}
					</block>
				</view>
			</view>
			
			<view class="subwrap u-m-t-30">
				<view class="subtitle u-p-t-40">
					<view class="line" :style="{ background: themeColor.color }" />
					发布人
				</view>
				
				<view class="user u-p-t-30 u-p-b-10">
					<view class="left"><u-avatar :src="item.member.head_portrait" size="120" /></view>
					
					<view class="right">
						<view class="nickname">
							{{item.member.nickname}}
							<view class="level" @tap="navTo('/pages/user/account/level')" v-if="item.memberLevel">
								(
									{{item.memberLevel.name || '候补志愿者'}}
									<u-icon name="level" :color="themeColor.color" size="24" />
									<text :style="{ color: themeColor.color }">{{item.member.current_level}}</text>
							  )
							</view>
						</view>
						<view class="profile">
							<u-icon name="man" color="#1684FB" size="30" v-if="item.member.gender == 1" />
							<u-icon name="woman" color="#DE3E96" size="30" v-if="item.member.gender == 2" />
							<text v-if="item.member.birthday">{{item.member.age_name}}岁</text>
							<text v-if="item.member.birthday">{{item.member.astro}}</text>
							<text v-if="item.member.last_time">{{item.member.last_time_name}}在线</text>
						</view>
						<view class="profile">
							
						</view>
					</view>
				</view>
				
				<u-line />
				
				<view class="contact u-p-t-30 u-p-b-30">
					<view class="contact-item" @tap="makePhoneCall(item.member.mobile)" v-if="item.member.mobile">
						<view class="icon"><u-icon name="phone-fill" :color="themeColor.color" size="66" /></view>
						<view class="name">拨打电话</view>
					</view>
					
					<view class="contact-item" @tap="copyText(item.member.wechat)" v-if="item.member.wechat">
						<view class="icon"><u-icon name="weixin-fill" :color="themeColor.color" size="66" /></view>
						<view class="name">复制微信号</view>
					</view>
					
					<!-- <view class="contact-item" @tap="copyText(item.member.qq)" v-if="item.member.qq">
						<view class="icon"><u-icon name="qq-circle-fill" :color="themeColor.color" size="66" /></view>
						<view class="name">复制QQ号</view>
					</view> -->
				</view>
			</view>
			
			<view class="subwrap u-m-t-30" v-if="item.type == 1">
				<view class="subtitle u-p-t-40">
					<view class="line" :style="{ background: themeColor.color }" />
					已申请领养的人数（{{item.applys.length}}）
				</view>

				<view class="applys u-p-t-20 u-p-b-40">
					<u-read-more ref="uReadMore" close-text="展开全部" :color="themeColor.color"	:toggle="true" text-indent="0" show-height="200">
						<u-empty text="暂无申请" mode="message" v-if="!item.applys.length"></u-empty>
						<u-avatar :src="apply.member.head_portrait" v-for="(apply, applyIndex) in item.applys" :key="applyIndex" />
					</u-read-more>
				</view>
			</view>
			
			<view class="subwrap u-m-t-30 comments-wrap">
				<view class="subtitle u-p-t-40">
					<view class="line" :style="{ background: themeColor.color }" />
					最新留言
				</view>
				
				<view class="comments u-p-b-60">
					<u-read-more ref="uReadMore" close-text="展开全部"	:color="themeColor.color" toggle text-indent="0" show-height="400">
						<u-empty text="暂无留言" mode="message" v-if="!item.comments.length"></u-empty>
						
						<view class="item" v-for="(comment, index) in item.comments" :key="index">
							<view class="left"><u-avatar :src="comment.member.head_portrait" size="80" /></view>
							
							<view class="center">
								<view class="nickname">{{comment.member.nickname}}</view>
								<view class="datetime">{{comment.created_at }}</view>
							</view>
							
							<view class="right">
								<!-- <view class="reply"><image :src="'/static/pet/reply.png'" /> {{comment.reply}}</view> -->
								<view class="like" @tap="setCommentLike(index, comment.id)"><image :src="'/static/pet/like.png'" /> {{comment.like}}</view>
							</view>
							
							<view class="bottom">
								<view class="content">{{comment.content}}</view>
							</view>
						</view>
					</u-read-more>
				</view>
			</view>
		</mescroll-body>

		<view class="nav-bottom">
			<view class="left">
				<button class="item" open-type="share" hover-class="none">
					<image src="/static/pet/share.png" />
					<view class="text">转发好友</view>
				</button>
				<view class="item" @tap="getPoster">
					<image src="/static/pet/favorate.png" />
					<view class="text">生成海报</view>
				</view>
				<view class="item" @tap="comment">
					<image src="/static/pet/comment.png" />
					<view class="text">我要留言</view>
				</view>
			</view>
			<view class="right">
				<u-button type="warning" size="medium" shape="circle" ripple :custom-style="{ width: '80%', background: themeColor.color , marginTop: '5rpx' }" @click="apply" v-if="item.type == 1">
					申请领养
				</u-button>
				
				<u-button type="default" size="medium" shape="circle" plain ripple :custom-style="{ width: '80%', borderColor: themeColor.color, color: themeColor.color, marginTop: '5rpx' }" @click="contact(`如为当事人，请通过上方的联系方式直接联系${$mData.types[item.type-1].name}信息发布人！`)" v-if="item.type != 1">
					联系{{$mData.types[item.type-1].name}}发布人
				</u-button>
			</view>
		</view>
		
		<painter widthPixels="720" customStyle="position: absolute; left: -9999rpx;" :palette="palette" @imgOK="onImgOk" @imgErr="onImgErr" v-if="painterShow" />
		
		<u-modal width="90%" :show-title="false" :mask-close-able="true" confirm-text="保存海报"	:show-cancel-button="true" cancel-text="关闭" v-model="modalShow" @confirm="modalConfirm">
			<view class="slot-content">
				<u-image :src="poster" width="100%" height="auto" :fade="true" duration="450" mode="widthFix" />
			</view>
		</u-modal>
		
		<rfLoading isFullScreen :active="loading"></rfLoading>
		<!-- <rf-back-top :scrollTop="scrollTop"></rf-back-top> -->
		<!-- <rf-back-home></rf-back-home> -->
	</view>
</template>

<script>
import moment from '@/common/moment';
import CardAdopt from '@/common/card/adopt';
import CardPet from '@/common/card/pet';
import CardOwner from '@/common/card/owner';
import MescrollMixin from '@/components/mescroll-uni/mescroll-mixins.js';
import { petView, petShare, commentLike } from '@/api/pet';

const QQMapWX = require('@/common/qqmap-wx-jssdk.min.js');

export default {
	mixins: [MescrollMixin],
	data() {
		return {
			title: '宠物详情',
			path: '/pages/pet/pet-view',
			$mData: this.$mData,
			hasLogin: false,
			userInfo: {},
			qqmapsdk: null,
			modalShow: false,
			poster: '',
			palette: {},
			painterShow: false,
			downOption: {
				native: true
			},
			upOption: {
				use: false
			},
			current: 0,
			videoContext: {},
			loading: true,
			scrollTop: 0,
			item: {
				type: 1,
				video: '',
				member: {},
				images: [],
				applys: [],
				comments: [],
				updated_at: 0
			}
		};
	},
	onLoad(option) {
		if (option.scene) {
			let scene = decodeURIComponent(option.scene);
			let arr = scene.split('=');
			this.id = arr[1];
		} else {
			this.id = option.id ? option.id : this.id;
		}
		
		this.qqmapsdk = new QQMapWX({
			key: this.$mData.maps[0].key
		});
		
		setTimeout(() => {
			this.$nextTick(() => {
				this.$refs.uReadMore.init();
			});
		}, 1500);
	},
	onShow() {
		
	},
	onReady() {
		if (this.item.video) {
			this.videoContext = uni.createVideoContext('myVideo');
		}
	},
	onPageScroll(e) {
		this.scrollTop = e.scrollTop;
	},
	onShareAppMessage(res) {
		this.setShare();
		return { 
			title: this.$mData.types[this.item.type-1].name + '：' + this.item.title,
			imageUrl: this.item.poster,
			path: `${this.path}?id=${this.item.id}`
		};
	},
	//分享到朋友圈
	onShareTimeline(res) {
		this.setShare();
		return {
			title: this.$mData.types[this.item.type-1].name + '：' + this.item.title,
			type: 0,
			query: `${this.path}?id=${this.item.id}`,
			summary: "",
			imageUrl:  this.item.poster,
		}
	},

	mounted() {
		this.initLogin();
	},
	computed: {
		baseCustomStyle() {
			return {
				height: '40rpx',
				lineHeight: '40rpx',
				background: this.themeColor.color,
				color: '#FFF',
				margin: '0 14rpx 14rpx 0'
			}
		},
		statusCustomStyle() {
			return {
				height: '38rpx',
				lineHeight: '38rpx',
				color: this.themeColor.color,
				borderColor: this.themeColor.color,
				margin: '0 14rpx 14rpx 0'
			}
		},
		requirementStyle() {
			return `color: ${this.themeColor.color}; font-size: 36rpx; margin-right: 10rpx;`;
		},
		//小程序无效
		requirementStyle02() {
			return {
				color: this.themeColor.color,
				fontSize: '36rpx',
				marginRight: '10rpx'
			}
		}
	},
	watch: {
		item(val) {
			let title = this.$mData.types[this.item.type-1].name;
			uni.setNavigationBarTitle({
			  title: title + '详情'
			});
			
			let params = {
				image: this.$mConfig.basePath + '/image-adopt.jpg',
				poster: this.item.poster,
				mpcode: this.item.mpcode,
				title: this.item.title,
				nickname: this.item.nickname,
				gender_name: this.item.gender_name,
				age_name: this.item.age_name,
				area: this.item.city + this.item.area,
				datetime: this.dateToStr(this.item.datetime),
				baseinfo: this.item.breed + '，' + this.item.gender_name + '，' + this.item.age_name,
				address: this.item.address,
				content: this.item.content,
				money: Math.round(this.item.money) + '元'
			};

			switch (val.type) {
				case 1:
					params.image = this.$mConfig.basePath + '/image-adopt.jpg';
					this.palette = new CardAdopt().palette(params);
					break;
				case 2:
					params.image = this.$mConfig.basePath + '/image-pet.jpg';
					params.money = Math.round(this.item.money) + '元';
					this.palette = new CardPet().palette(params);
					break;
				case 3:
					params.image = this.$mConfig.basePath + '/image-owner.jpg',
					this.palette = new CardOwner().palette(params);
					break;
				default:
					break;
			}
		}
	},
	filters: {
		datetime(val) {
			return moment(val * 1000).format('YYYY-MM-DD HH:mm');
		},
	},
	methods: {
		async initLogin() {
			this.hasLogin = this.$mStore.getters.hasLogin;
			this.userInfo = uni.getStorageSync('userInfo');
		},
		navTo(route) {
			this.$mRouter.push({ route });
		},
		dateToStr(val) {
			return moment(val * 1000).format('YYYY年MM年DD日 HH:mm');
		},
		swiperChange(e) {
			this.current = e.detail.current;
			
			if (this.item.video) {
				this.videoContext = uni.createVideoContext('myVideo');
		
				if (this.current) {
					this.videoContext.pause();
				} else {
					this.videoContext.play();
				}
			}
		},
		makePhoneCall(phoneNumber) {
			uni.makePhoneCall({
			  phoneNumber: phoneNumber
			});
		},
		copyText(text) {
			let _this = this;
		
			uni.setClipboardData({
				data: text,
				success(res) {
					_this.$mHelper.toast('复制成功！');
				}
			});
		},
		previewQrcode(url) {
			uni.previewImage({
				urls: [url]
			});
		},
		openLocation() {
			if (!this.item.coords) {
				this.qqmapsdk.geocoder({
					region: this.item.city,
					address:this.item.address,
					success(res) {
						this.item.coords.lat = res.result.location.lat;
						this.item.coords.lng = res.result.location.lng;
					}
				});
			}

			uni.openLocation({
				latitude: Number.parseFloat(this.item.coords.lat),
				longitude: Number.parseFloat(this.item.coords.lng),
				name: this.item.location,
				address: this.item.address,
				success() {

				}
			});
		},
		getPoster() {
			this.setShare();
			this.painterShow = true;

			if (!this.poster) {
				uni.showLoading({
				  title: '加载中...'
				});
			} else {
				this.modalShow = true;
			}
		},
		comment() {
			if (this.hasLogin) {
				this.navTo(`/pages/pet/comment-post?pet_id=${this.item.id}`);
			} else {
				this.navToLogin();
			}
		},
		apply() {
			if (this.hasLogin) {
				if (this.item.member_id == this.userInfo.id) {
					this.$mHelper.toast('不能申请自己发布的送养宠物！');
				} else {
					this.navTo(`/pages/pet/apply-post?pet_id=${this.item.id}&owner_id=${this.item.member_id}`);
				}
			} else {
				this.navToLogin();
			}
		},
		contact(text) {
			this.$mHelper.toast(text);
		},
		getAstro(month, day) {
		  return '魔羯水瓶双鱼牡羊金牛双子巨蟹狮子处女天秤天蝎射手魔羯'.substr(month * 2-  (day < '102223444433' .charAt(month - 1) - -19) * 2, 2);
		},
		async downCallback() {
			await this.$http.get(`${petView}?expand=member,applys.member,comments,comments.member`, {
				id: this.id
			}).then(async r => {
				if (r.data.state) {
					this.navTo(`/pages/pet/404`);
				}
				
				this.loading = false;
				this.item = r.data;
				
				if (this.item.member.birthday) {
					let birthdays = this.item.member.birthday.split('-');
					let date = new Date();
					let year = date.getFullYear();
					
					this.item.member.age_name = year - birthdays[0];
					this.item.member.astro = this.getAstro(birthdays[1], birthdays[2]) + '座';
				}

				this.item.member.last_time_name = this.$u.timeFrom(this.item.member.last_time, 'yyyy年mm月dd日');
				this.mescroll.endSuccess();
			}).catch(err => {
				this.loading = false;
				this.navTo(`/pages/pet/404`);
			});
		},
		async setShare() {
			// await this.$http.get(`${petShare}`, {
			// 	id: this.id
			// }).then(async r => {
			// 	this.item.share = r.data;
			// });
		},
		async setCommentLike(index, id) {
			if (this.hasLogin) {
				let comment_ids = JSON.parse(uni.getStorageSync('comment_ids') || "[]");
				
				if (comment_ids.includes(id)) {
					this.$mHelper.toast('不能重复点赞！');
				} else {
					await this.$http.get(`${commentLike}`, {
						id: id
					}).then(async r => {
						this.item.comments[index].like = r.data;
						comment_ids.push(id);
						uni.setStorageSync('comment_ids',  JSON.stringify(comment_ids));
					});
				}
			} else {
				this.navToLogin();
			}
		},
		navToLogin() {
			uni.setStorageSync('backToPage', JSON.stringify({ route: `${this.path}?id=${this.item.id}` }));

			let _this = this;
			uni.showModal({
				content: '未登录，是否跳转登录页面？',
				success(res) {
					if (res.confirm) {
						_this.navTo(`/pages/public/logintype`);
					}
				}
			});
		},
		onImgOk(e) {
			this.poster = e.detail.path;
			this.modalShow = true;
			uni.hideLoading();
		},
		onImgErr() {
			this.modalShow = false;
		},
		modalConfirm() {
			let _this = this;
			uni.saveImageToPhotosAlbum({
				filePath: this.poster,
				success() {
					_this.$mHelper.toast('已保存到相册！');
				},
				fail(error) {
					uni.showModal({
						title: '提示',
						content: '须微信授权才能保存到相册！',
						success(res) {
							if (res.confirm) {
								uni.openSetting({
								  success(res) {
								    //console.log(res.authSetting);
								  }
								});
							}
						}
					});
				},
				complete(res) {
					//console.log(res);
				}
			});
		},
		previewImage(index) {
			let urls = this.item.images;

			uni.previewImage({
				urls: urls,
				current: index
			});
		}
	}
};
</script>

<style lang="scss">
page {
	background: $color-white;
	.wrap {
		background: #F5F5F5;
		.swiper-box { 
			height: 600rpx;
			video {
				width: 100%;
				height: 600rpx;
			}
		}
		.slot-content {
			image {
				display: block;
			}
		}
		.subwrap {
			background: $color-white;
			padding: 0 30rpx;
			.title {
				font-size: 30rpx;
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
				margin-top: 16rpx;
			}
			.bottom {
				color: #999;
				display: flex;
				justify-content: space-between;
				.area {
					width: 33%;
					font-size: 24rpx;
					u-icon, .u-icon { 
						color: #FBDC5C
					}
				}
				.datetime {
					font-size: 22rpx;
				}
				.view {
					font-size: 22rpx;
					margin-left: 40rpx;
				}
				.share {
					font-size: 22rpx;
					margin-left: 30rpx;
				}
			}
			.feature {
				display: flex;
				.left {
					flex-basis: 22%;
				}
				.right {
					//flex-grow: 1;
					flex-basis: 78%;
					.nickname {
						color: #333;
						font-size: 30rpx;
					}
					.base {
						.tag {
							height: 40rpx;
							line-height: 40rpx;
							background: #F6F7FB;
							color: #666;
							font-size: 24rpx;
							border-radius: 6rpx;
							padding: 0 20rpx;
							margin: 0 14rpx 14rpx 0;
							display: inline-block;
						}
					}
					.status {
						.tag {
							height: 38rpx;
							line-height: 38rpx;
							color: #CCC;
							font-size: 24rpx;
							border: 2rpx #CCC solid;
							border-radius: 6rpx;
							padding: 0 20rpx;
							margin: 0 14rpx 14rpx 0;
							display: inline-block;
						}
					}
				}
			}
			.sheet {
				color: #666;
				.datetime {
					font-size: 26rpx;
				}
				.address {
					font-size: 26rpx;
					margin: 10rpx 0 20rpx 0;
				}
			}
			.subtitle {
				color: #333;
				font-size: 30rpx;
				.line {
					width: 6rpx;
					height: 26rpx;
					background: #FFCE0C;
					border-radius: 6rpx;
					display: inline-block;
					margin: 10rpx 16rpx 0 0;
				}
			}
			.content {
				line-height: 48rpx;
				color: #666;
				font-size: 30rpx;
			}
			.requirements {
				color: #333;
				font-size: 28rpx;
				image {
					width: 28rpx;
					height: 28rpx;
					margin-right: 20rpx;
				}
			}
			.user {
				display: flex;
				.left {
					flex-basis: 22%;
				}
				.right {
					flex-grow: 1;
					.nickname {
						color: #262628;
						font-size: 30rpx;
						.level {
							color: #666;
							margin-left: 10rpx;
							display: inline-block;
							text {
								font-size: 30rpx;
							}
						}
					}
					.profile {
						color: #999;
						font-size: 22rpx;
						margin-top: 10rpx;
						display: flex;
						text {
							padding: 0 10rpx;
						}
					}
				}
			}
			.contact {
				display: flex;
				justify-content: space-around;
				.contact-item {
					text-align: center;
					.icon {
						display: flex;
						justify-content: center;
					}
					.name {
						color: #666;
						font-size: 24rpx;
						margin-top: 20rpx;
					}
				}
			}
			.applys {
				.u-avatar { margin-right: 20rpx;}
			}
			.comments {
				.item {
					display: flex;
					flex-wrap: wrap;
					margin-top: 60rpx;
					.left {
						flex-basis: 16%;
					}
					.center {
						flex-basis: 76%;
						.nickname {
							color: #333;
							font-size: 24rpx;
							margin-top: 6rpx;
						}
						.datetime {
							color: #999;
							font-size: 20rpx;
						}
					}
					.right {
						flex-basis: 6%;
						text-align: center;
						image {
							width: 28rpx;
							height: 28rpx;
							vertical-align: middle;
						}
						.like image {
							height: 26rpx;
						}
					}
				}
				.bottom {
					flex-basis: 100%;
					.content {
						color: #333;
						font-size: 24rpx;
						padding-top: 10rpx;
					}
				}
			}
		}
		.comments-wrap {
			margin-bottom: 150rpx;
		}
		.nav-bottom {
			width: 100%;
			background: #FFF;
			border: 2rpx #F2F2F2 solid;
			position: fixed;
			bottom: 0;
			padding: 16rpx 0 10rpx 0;
			z-index: 999;
			display: flex;
			.left {
				flex-basis: 50%;
				display: flex;
				justify-content: space-around;
				align-items: center;
				.item {
					text-align: center;
					image {
						width: 40rpx;
						height: 38rpx;
					}
					.text {
						color: #333;
						font-size: 20rpx;
					}
				}
				button.item {
					height: auto;
					line-height: 40rpx;
					background: none;
					font-size: 28rpx;
					border: 0;
					padding: 0;
					margin: 0;
				}
				button:after {
					border: 0;
				}
			}
			.right {
				flex-grow: 1;
				text-align: center;
			}
		}
		.slot-content {
			min-height: 400rpx;
		}
	}
}
</style>

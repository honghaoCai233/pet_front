<template>
	<view class="wrap">
		<view class="subwrap">
			<u-form ref="uForm" :model="item" :rules="rules" label-position="top" :border-bottom="false" :errorType="errorType">
				
				<block v-if="item.type != 3">
					<u-form-item label="商品名称" prop="name" :border-bottom="false" :label-style="labelStyle">
						<u-input v-model="item.name" height="100" :custom-style="customStyle" trim placeholder="请输入" />
					</u-form-item>
				</block>
				
				<u-form-item label="分类" prop="cate_name" :border-bottom="false" >
					<u-radio-group @change="tagsCheckboxGroupChange" placement="row"  v-model="cate_name">
						<u-radio shape="square"  @change="tagsCheckboxChange" label-size="24" :active-color="themeColor.color"  v-for="(pcate, index) in pcates" :key="index" :name="pcate.id">{{pcate.title}}</u-radio>
					</u-radio-group>
				</u-form-item>
				<u-form-item label="产品视频" prop="video_url" :border-bottom="false" :label-style="labelStyle">
					<tm-upload ref="videoRef" @change="getUploadVideos" @progress="uploadVideosProgress" @remove="removeVideos" :upload_auto="true" :upimg_move="true"></tm-upload>
				</u-form-item>
				
				<u-line-progress active-color="#FECD32" :percent="progress" v-if="progress && !item.video_url"></u-line-progress>
				
				<view class="progress-tips" v-if="progress == 100 && !item.video_url">
					发送完成100%，服务端正在进行接收处理，请稍等...<u-loading mode="circle" color="#F90" :size="26"></u-loading>
				</view>
				
				<u-divider half-width="50%">视频上传：0-1个，可选项</u-divider>
				
				<u-form-item label="图片" prop="images" :border-bottom="false" :label-style="labelStyle">
					<u-upload ref="uploadRef" :header="uploadHeader" :action="uploadAction" :file-list="uploadFileList" :max-size="5 * 1024 * 1024" max-count="6" @on-success="uploadSuccess" @on-uploaded="uploaded" @on-error="uploadError" @on-remove="uploadRemove" @on-change="uploadChange"></u-upload>
				</u-form-item>
				
				<u-divider half-width="50%">图片上传：1-6张，第1张为封面</u-divider>

				
				
				<u-form-item label="商品单位" prop="unit" :border-bottom="false" :label-style="labelStyle">
					<u-input v-model="item.unit" height="100" :custom-style="customStyle" trim placeholder="请输入" />
				</u-form-item>
				<u-form-item label="总库存" prop="stock" :border-bottom="false" :label-style="labelStyle">
					<u-input v-model="item.stock" height="100" :custom-style="customStyle" trim placeholder="请输入" />
				</u-form-item>
				<!-- <u-form-item label="库存报警" prop="warning_stock" :border-bottom="false" :label-style="labelStyle">
					<u-input v-model="item.warning_stock" height="100" :custom-style="customStyle" trim placeholder="请输入" />
				</u-form-item> -->
				<u-form-item label="销售价" prop="price" :border-bottom="false" :label-style="labelStyle">
					<u-input v-model="item.price" height="100" :custom-style="customStyle" trim placeholder="请输入" />
				</u-form-item>
				<u-form-item label="原价" prop="market_price" :border-bottom="false" :label-style="labelStyle">
					<u-input v-model="item.market_price" height="100" :custom-style="customStyle" trim placeholder="请输入" />
				</u-form-item>
				
			<!-- 	<u-form-item label="成本价" prop="cost_price" :border-bottom="false" :label-style="labelStyle">
					<u-input v-model="item.cost_price" height="100" :custom-style="customStyle" trim placeholder="请输入" />
				</u-form-item> -->
				
				<!-- <block v-if="item.type == 1">
					<u-form-item label="运费设置" prop="shipping_type" label-position="left" :border-bottom="false" label-width="auto" :label-style="labelStyle"></u-form-item>
					<u-subsection :list="$mData.fabumodes" :current="item.shipping_type" mode="button" height="68" :bold="false" active-color="#FFF" :button-color="themeColor.color" @change="modeSectionChange" />
					
					<u-gap height="20" />
				</block> -->
				
				<u-form-item label="运费" prop="shipping_fee" :border-bottom="false" :label-style="labelStyle" right-icon="red-packet-fill">
					<u-input type="textarea" v-model="item.shipping_fee" height="100" :custom-style="customStyle" trim placeholder="请输入金额" />
				</u-form-item>
				<u-divider half-width="50%">不设置默认就是0</u-divider>
				
			

				
				
				<!--  -->
								
				
				<u-form-item label="请尽量详细介绍" prop="intro" :border-bottom="false" :label-style="labelStyle" right-icon="red-packet-fill">
					<u-input type="textarea" v-model="item.intro" height="246":custom-style="Object.assign(customStyle, customStyle02)" placeholder="请尽量详细介绍" />
				</u-form-item>
				
				
				
				
				
				
				<u-button type="warning" form-type="submit" @click="submit" :loading="submitLoading" shape="circle" :ripple="true" :custom-style="customStyle04">提交发布</u-button>
			</u-form>

			<u-picker v-model="datetimeShow" mode="time" :start-year="2021" :params="datetimeParams" @confirm="datetimeConfirm"></u-picker>
		</view>
		
		<!--页面加载动画-->
		<rfLoading isFullScreen :active="loading"></rfLoading>
		<!-- <rf-back-top :scrollTop="scrollTop"></rf-back-top> -->
		<!-- <rf-back-home></rf-back-home> -->
	</view>
</template>

<script>
import { getCate, fabuMyView, fabuForm, fileImages, fileVideos } from '@/api/pet';

const QQMapWX = require('@/common/qqmap-wx-jssdk.min.js');

export default {
	data() {
		return {
			qqmapsdk: null,
			$mData: this.$mData,
			hasLogin: false,
			userInfo: {},
			errorType: ['toast', 'message', 'border-bottom'],
			submitLoading: false,
			uploadHeader: { 'Authorization': uni.getStorageSync('accessToken') },
			uploadAction: this.$mConfig.baseUrl + fileImages,
			uploadFileList: [],
			loading: true,
			videoContext: {},
			progress: 0,
			id: 0,
			pcates: [],
			cate_name:'0',
			item: {
				
				cate_id:1,
				
				
			},
			datetimeShow: false,
			datetimeParams: {
				year: true,
				month: true,
				day: true,
				hour: true,
				minute: true,
				second: false,
				timestamp: true,
			},
			rules01: {
				images: this.$mData.rules.images,
				title: this.$mData.rules.title,
				nickname: this.$mData.rules.nickname,
				breed: this.$mData.rules.breed,
				money: this.$mData.rules.money,
				refund_condition: this.$mData.rules.refund_condition,
				other_requirement: this.$mData.rules.other_requirement,
				address: this.$mData.rules.address,
				content: this.$mData.rules.content,
				'member.nickname': this.$mData.rules['member.nickname'],
				'member.wechat': this.$mData.rules['member.wechat'],
				'member.qq': this.$mData.rules['member.qq']
			},
			rules02: {
				images: this.$mData.rules.images,
				title: this.$mData.rules.title,
				nickname: this.$mData.rules.nickname,
				breed: this.$mData.rules.breed,
				money: this.$mData.rules.money,
				datetime_name: this.$mData.rules.datetime_name,
				address: this.$mData.rules.address,
				content: this.$mData.rules.content,
				'member.nickname': this.$mData.rules['member.nickname'],
				'member.wechat': this.$mData.rules['member.wechat'],
				'member.qq': this.$mData.rules['member.qq']
			},
			rules03: {
				images: this.$mData.rules.images,
				title: this.$mData.rules.title,
				breed: this.$mData.rules.breed,
				money: this.$mData.rules.money,
				datetime_name: this.$mData.rules.datetime_name,
				address: this.$mData.rules.address,
				content: this.$mData.rules.content,
				'member.nickname': this.$mData.rules['member.nickname'],
				'member.wechat': this.$mData.rules['member.wechat'],
				'member.qq': this.$mData.rules['member.qq']
			}
		};
	},
	onLoad(option) {
		this.id = option.id ? option.id : this.id;
		this.qqmapsdk = new QQMapWX({
			key: this.$mData.maps[0].key
		});
	},
	onShow() {
		this.initLogin();
	},
	onReady(res) {
		if (this.id) {
			uni.setNavigationBarTitle({
			  title: '编辑产品'
			});
		} else {
			this.loading = false;
		}
		this.$refs.uForm.setRules(this.rules01);
	},
	mounted() {
		this.initData();
	},
	computed: {
		rules() {
			return this[`rules0${this.item.type}`];
		},
		labelStyle() {
			return {
				height: '30rpx',
				fontSize: '30rpx',
				borderLeft: `6rpx ${this.themeColor.color} solid`,
				borderRadius: '3rpx',
				paddingLeft: '20rpx'
			}
		},
		
		
		labelStyle02() {
			return {
				color: '#999',
				fontSize: '24rpx',
				paddingTop: '0rpx'
			}
		},
		labelStyle03() {
			return Object.assign(this.labelStyle, { marginBottom: '20rpx' });
		},
		customStyle() {
			return { 
				background: '#F6F7FB',
				borderRadius: '16rpx',
				padding: '0 30rpx',
				marginTop: '20rpx'
			}
		},
		customStyle02() {
			return {
				padding: '20rpx 30rpx'
			}
		},
		customStyle03() {
			return {
				color: '#333',
				fontSize: '28rpx',
				background: '#F6F7FB',
				padding: '0 30rpx'
			}
		},
		customStyle04() {
			return {
				background: this.themeColor.color,
				color: '#FFF',
				fontSize: '30rpx',
				padding: '46rpx 0',
				marginTop: '60rpx'
			}
		}
	},
	watch: {
		'item.type'(val) {
			uni.setStorageSync('item', this.item);
			this.$refs.uForm.resetFields();
			let item = uni.getStorageSync('item');
			this.item = item;
			this.$refs.uForm.setRules(this.rules);
		}
	},
	methods: {
		async initLogin() {
			this.hasLogin = this.$mStore.getters.hasLogin;
			this.userInfo = uni.getStorageSync('userInfo');
			
			if (this.hasLogin && this.userInfo) {
				this.item.member.nickname = this.userInfo.nickname;
				this.item.member.wechat = this.userInfo.wechat;
				this.item.member.qq = this.userInfo.qq;
			} else {
				this.navTo('/pages/public/logintype');
			}
		},
		async initData() {
			if (this.id) {
				await this.getPetMyView();
			}
			
			 this.getCate();
			this.$nextTick(() => {
				this.$refs.videoRef.type = 'video';
				this.$refs.videoRef.url =`${fileVideos}`;
				this.$refs.videoRef.upload_count = 1;
				this.$refs.videoRef.upload_img_wh = 260 - 60;
				this.$refs.videoRef.upload_max = 200; //MB
				/* this.$refs.videoRef.header = {
					'authorization': `Bearer ` + this.$tui.getAccessToken()
				} */
				
				if (this.item.video_url) {
					let videos = [];
					let item = JSON.parse(JSON.stringify(this.item));
					
					videos.push({ path: item.video, upload_percent: 100 });
					this.$refs.videoRef.upload_before_list = videos;
				}
			});
		},
		navTo(route) {
			this.$mRouter.push({ route });
		},
		datetimeConfirm(e) {
			this.item.datetime_name = e.year + '-' + e.month + '-' + e.day + ' ' + e.hour + ':' + e.minute;
			this.item.datetime = e.timestamp;
		},
		typeSectionChange(index) {
			this.item.type = this.$mData.types[index].key;
		},
		cateSectionChange(index) {
			this.item.cate = this.$mData.cates[index].key;
		},
		genderSectionChange(index) {
			this.item.gender = this.$mData.genders[index].key;
		},
		ageSectionChange(index) {
			this.item.age = this.$mData.ages[index].key;
		},
		modeSectionChange(index) {
			this.item.mode = this.$mData.modes[index].key;
			if (this.item.mode == 0) this.item.money = '0.00';
		},
		vaccineSectionChange(index) {
			this.item.vaccine = this.$mData.vaccines[index].key;
		},
		sterilizeSectionChange(index) {
			this.item.sterilize = this.$mData.sterilizes[index].key;
		},
		dewormSectionChange(index) {
			this.item.deworm = this.$mData.deworms[index].key;
		},
		sourceSectionChange(index) {
			this.item.source = this.$mData.sources[index].key;
		},
		sizeSectionChange(index) {
			this.item.size = this.$mData.sizes[index].key;
		},
		hairSectionChange(index) {
			this.item.hair = this.$mData.hairs[index].key;
		},
		tagsCheckboxGroupChange(e) {
			//this.item.tags = e;
			
			this.$set(this.item, 'cate_id', e); //解决不及时更新的问题
			
			
		},
		tagsCheckboxChange(detail) {

		},
		requirementsCheckboxGroupChange(e) {
			//this.item.requirements = e;
			this.$set(this.item, 'requirements', e); //解决不及时更新的问题
		},
		requirementsCheckboxChange(detail) {
		
		},
		chooseLocation() {
			let _this = this;
			//#ifdef MP
			uni.authorize({
				scope: 'scope.userLocation',
				success(res) {
			//#endif
					uni.chooseLocation({
						success(res) {
							_this.$set(_this.item, 'address', res.address); //解决不及时更新的问题
							//_this.item.address = res.address;
							_this.item.coords = { lat: res.latitude, lng: res.longitude}; //纬度&经度
							_this.item.location = res.name;
							
							_this.qqmapsdk.reverseGeocoder({
								location: {
									latitude: res.latitude,
									longitude: res.longitude
								},
								success(res) {
									_this.item.province_id = res.result.ad_info.adcode.substring(0, 2) * 10000;
									_this.item.city_id = res.result.ad_info.city_code - 156000000;
									_this.item.area_id = res.result.ad_info.adcode * 1;
									_this.item.province = res.result.ad_info.province;
									_this.item.city = res.result.ad_info.city;
									_this.item.area = res.result.ad_info.district;
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
			//#ifdef MP
				},
				fail() {
					uni.showModal({
						content: '位置信息授权才能选择',
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
				}
			});
			//#endif
		},
		async getPetMyView() {
			
			this.getCate();
			
			await this.$http.get(`${fabuMyView}`, {
				id: this.id
			}).then(async r => {
				this.loading = false;
				this.item = r.data;
				this.item.datetime_name = this.$u.timeFormat(this.item.datetime, 'yyyy-mm-dd hh:MM');
				
				
				
				
				this.cate_name=r.data.cate_id;
				
				let images = [];
				this.item.covers.forEach((item, index) => {
					images.push({ url: item });
				});
				this.uploadFileList = images;

				this.$mData.tags.forEach((item, index) => {
					if (this.item.tags.includes(item.name)) {
						item.checked = true;
					}
				});
				
				this.$mData.requirements.forEach((item, index) => {
					if (this.item.requirements.includes(item.name)) {
						item.checked = true;
					}
				});
			}).catch(err => {
				this.loading = false;
			});
		},
		
		async getCate() {
			
			
			await this.$http.get(`${getCate}`, {
				
			}).then(async r => {
				this.pcates=r.data
				console.log(this.pcates);
				
			}).catch(err => {
				this.loading = false;
			});
		},
		submit() {
			let lists = [];
			let images = [];
			lists = this.$refs.uploadRef.lists.filter(item => {
				return item.progress == 100;
			});
			
			lists.forEach((list, index) => {
				if (list.response) {
					images.push(list.response.data.url);
				} else {
					images.push(list.url);
				}
			});
			
			
			this.item.images = images;
			
			setTimeout(() =>{
			  this.$refs.uForm.validate(valid => {
			  	if (valid) {
			  		this.postItem(this.item);
			  	}
			  });
			}, 300);
		},
		postItem(params) {
			this.submitLoading = true;
			let url = `${fabuForm}`;
			if (this.id) url += `?id=${this.id}`;
			
			this.$http.post(url, {
				...params,
			}).then(async r => {
				this.submitLoading = false;
				
				let _this = this;
				uni.showModal({
					content: '发布成功！',
					showCancel: false,
					success(res) {
						if (res.confirm) {
							_this.$mRouter.back();
						}
					}
				});
			}).catch(err => {
				this.submitLoading = false;
			});
		},
		uploadSuccess(data, index, lists, name) {
		this.$mHelper.toast('上传成功！');
		},
		uploaded(lists, name) {
			//this.$mHelper.toast('上传完成！');
			/* this.item.images = [];
			
			for (var item of lists) {
				if (item.error == false) {
					this.item.images.push(item.response.data.url);
				}
			} */
		},
		uploadError(res, index, lists, name) {
			this.$mHelper.toast('上传失败！');
		},
		uploadRemove(index, lists, name) {
		
		},
		uploadChange(res, index, lists, name) {
			
		},
		getUploadVideos(items) {
			let array = [];
			
			items.forEach((item, index) => {
				array.push(item);
			});
			
			this.item.video = array.join(',');
		},
		uploadVideosProgress(progress) {
			this.progress = progress;
		},
		removeVideos() {
			this.item.video = '';
			this.progress = 0;
		}
	}
};
</script>

<style lang="scss">
page {
	background: $color-white;
	.wrap {
		padding: 30rpx;
		.subwrap {
			background: $color-white;
			.u-tag {
				color: #999;
				font-size: 28rpx;
				border: none;
				border-radius: 8px;
				padding: 20rpx 30rpx;
				margin-left: 20rpx;
			}
			.u-tag.active {
				color: #333;
			}
			.u-checkbox {
				margin-bottom: 20rpx;
			}
			.contact {
				background: #F6F7FB;
				border-radius: 16rpx;
				padding: 10rpx 30rpx;
			}
			.progress-tips {
				color: $u-type-warning;
				font-size: 24rpx;
				padding: 10rpx;
			}
		}
	}
}
</style>

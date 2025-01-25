<template>
	<view class="wrap">
		<view class="subwrap">
			<u-form ref="uForm" :model="item" :rules="rules" label-position="top" :border-bottom="false" :errorType="errorType">
				
				
				<u-form-item label="类型" prop="selltypes" :border-bottom="false" :label-style="labelStyle03">
					<u-checkbox-group @change="selltypesCheckboxGroupChange" width="50%" :max="20">
						<u-checkbox @change="selltypesCheckboxChange" label-size="24" :active-color="themeColor.color" v-model="tag.checked" v-for="(tag, index) in $mData.selltypes" :key="index" :name="tag.name">{{tag.name}}</u-checkbox>
					</u-checkbox-group>
				</u-form-item>
				<u-form-item :label="'服务介绍'" prop="introduce" :border-bottom="false" :label-style="labelStyle">
					<u-input type="textarea" v-model="item.introduce" height="246" :custom-style="Object.assign(customStyle, customStyle02)" placeholder="请输入备注" />
				</u-form-item>
				
				
				<u-gap height="20" />
				<u-form-item label="商家名" prop="name" :border-bottom="false" :label-style="labelStyle">
					<u-input v-model="item.name" height="100" :custom-style="customStyle" trim placeholder="请输入" />
				</u-form-item>
				
				<u-gap height="20" />
				<u-form-item label="联系电话" prop="tel" :border-bottom="false" :label-style="labelStyle">
					<u-input v-model="item.tel" height="100" :custom-style="customStyle" trim placeholder="请输入" />
				</u-form-item>
				
				<u-form-item :label="'地址'" prop="address" :border-bottom="false" :label-style="labelStyle" right-icon="map">
					<u-input v-model="item.address" height="100" disabled :custom-style="customStyle" placeholder="请选择" @click="chooseLocation" />
				</u-form-item>
							
				
			
				
				
			
				
				
					
				
			
				
				<u-form-item :label="'备注'" prop="remarks" :border-bottom="false" :label-style="labelStyle">
					<u-input type="textarea" v-model="item.remarks" height="246" :custom-style="Object.assign(customStyle, customStyle02)" placeholder="请输入备注" />
				</u-form-item>
				
				
				<u-button type="warning" form-type="submit" @click="submit" :loading="submitLoading" shape="circle" :ripple="true" :custom-style="customStyle04">提交</u-button>
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
import { hezuoMyView, hezuoForm, fileImages, fileVideos } from '@/api/pet';

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
			item: {
				selltypes: [],
				introduce:'',
				address: '',
				lbs: '',
				
				
				
				name: '',
				
				
				tel: '',
				
				
				
				remarks: '',
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
			  title: '编辑领养'
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
		longziSectionChange(index) {
			this.item.longzi = this.$mData.longzi[index].key;
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
		selltypesCheckboxGroupChange(e) {
			//this.item.selltypes = e;
			this.$set(this.item, 'selltypes', e); //解决不及时更新的问题
		},
		selltypesCheckboxChange(detail) {

		},
		selltypesCheckboxGroupChange(e) {
			//this.item.selltypes = e;
			this.$set(this.item, 'selltypes', e); //解决不及时更新的问题
		},
		selltypesCheckboxChange(detail) {
		
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
								var address=res.address+res.name
							_this.$set(_this.item, 'address', address); //解决不及时更新的问题
							//_this.item.address = res.address;
							_this.item.lbs = { lat: res.latitude, lng: res.longitude}; //纬度&经度
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
			await this.$http.get(`${hezuoMyView}`, {
				id: this.id
			}).then(async r => {
				this.loading = false;
				this.item = r.data;
				this.item.datetime_name = this.$u.timeFormat(this.item.datetime, 'yyyy-mm-dd hh:MM');
				
				
				
				this.$mData.selltypes.forEach((item, index) => {
					item.checked=false
					
					if (this.item.selltypes.includes(item.name)) {
						item.checked = true;
					}
				});
				
				
			}).catch(err => {
				this.loading = false;
			});
		},
		submit() {
			
			
			let selltypes = [];
			this.$mData.selltypes.forEach((item, index) => {
				if (item.checked) {
					selltypes.push(item.name);
				}
			});
			
			
			
			
		
			this.item.selltypes = selltypes;
			this.item.contact = this.item.member;

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
			let url = `${hezuoForm}`;
			if (this.id) url += `?id=${this.id}`;
			
			this.$http.post(url, {
				...params,
			}).then(async r => {
				this.submitLoading = false;
				
				let _this = this;
				uni.showModal({
					content: '发布成功！可能需审核通过后显示。',
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
			//this.$mHelper.toast('上传成功！');
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
	
	.tis {
		margin-top: 10rpx;
		width: 100%;
		font-size: 24rpx;
		display: flex;
		justify-content: center;
		align-items: baseline;
		color: #999;
	
		.terms {
			color: #5a9ef7;
		}
	}
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

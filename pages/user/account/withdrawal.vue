<template>
	<view class="recharge">
		<view class="block">
			<view class="title">
				我的账户
			</view>
			<view class="content">
				<view class="my">
					我的账户余额：
					<text class="balance" :class="'text-' + themeColor.name">{{
						(userInfo.account && userInfo.account.user_money) || '0'
					}}</text>
					元
				</view>
				
			</view>
		</view>
		<view class="block">
			<view class="title">
				提现金额
			</view>
			<view class="content">
				<view class="my">
					需提现金额：
					<view class="input" style="border-bottom: solid 1px;">
						<input 
							type="number"
							:class="'text-' + themeColor.name"
							@input="handleInputAmountChange"
							v-model="cash"
						/>
					</view>
				</view>
				
			</view>
		</view>
		
		<view class="invoice-manage rf-row-wrapper">
			<view class="row b-b">
				
				<text class="tit">类型</text>
				<radio-group class="invoice-type" @change="handleInvoiceTypeChange">
					<label
						class="invoice-type-item"
						v-for="(item, index) in invoiceType"
						:key="index"
					>
						<radio
							class="gender-item-radio"
							:color="themeColor.color"
							:value="'' + item.value"
							:checked="item.value === invoiceData.type"
						/>
						<text class="gender-item-text">{{ item.name }}</text>
					</label>
				</radio-group>
			</view>
			<view class="row b-b">
				<text class="tit">姓名</text>
				<input
					class="input"
					type="text"
					v-model="invoiceData.title"
					placeholder="请输入姓名"
					placeholder-class="placeholder"
				/>
			</view>
			<view class="row b-b">
				<text class="tit">账号</text>
				<input
					class="input"
					type="text"
					v-model="invoiceData.title"
					placeholder="请输入账号"
					placeholder-class="placeholder"
				/>
			</view>
			<view class="row b-b" v-if="parseInt(invoiceData.type, 10) === 3">
				<text class="tit">卡号</text>
				<input
					class="input"
					type="text"
					v-model="invoiceData.duty_paragraph"
					placeholder="请输入卡号"
					placeholder-class="placeholder"
				/>
			</view>
			
			
		</view>
		
		<view class="pay">
			<view class="btn" :class="'bg-' + themeColor.name" @tap="pay">提交提现</view>
			
		</view>
		<!--加载动画-->
		<rfLoading isFullScreen :active="pageLoading"></rfLoading>
	</view>
</template>

<script>
import { memberInfo, rechargeConfigIndex } from '@/api/userInfo';
import { configList } from '@/api/basic';
export default {
	data() {
		return {
			inputAmount: 0, // 金额
			inputAmountGive: 0, // 金额
			amountList: [], // 预设3个可选快捷金额
			payType: 1, // 支付类型
			userInfo: {},
			loading: false,
			providerList: [],
			payTypeList: {},
			isWechat: this.$mPayment.isWechat(),
			pageLoading: true,
			invoiceData: {
				type: 1,
				title: '',
				duty_paragraph: '',
				is_default: ''
			},
			invoiceType: [
				{ name: '支付宝', value: 1 },
				{ name: '微信', value: 2 },
				{ name: '银行卡', value: 3 },
			],
			code: ''
		};
	},
	onLoad(options) {
		this.initData(options);
			/*  #ifdef H5  */
			this.code = options.code && options.code.split(',')[options.code.split(',').length - 1];
			if (this.$mPayment.isWechat()) {
				if (!this.code) {
						const href = window.location.href;
						window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?
																appid=${this.$mConfig.weixinAppId}&
																redirect_uri=${href}&
																response_type=code&
																scope=snsapi_userinfo&
																state=STATE#wechat_redirect`;
				}
			}
			/*  #endif  */
	},
	methods: {
		// 计算充值送的钱 后台配置
		handleInputAmountChange(e) {
			this.inputAmount = parseFloat(e.detail.value);
			if (this.inputAmount < this.amountList[0].price) {
				this.inputAmountGive = 0;
				return;
			}
			if (
				this.inputAmount >= this.amountList[this.amountList.length - 1].price
			) {
				this.inputAmountGive = this.amountList[
					this.amountList.length - 1
				].give_price;
				return;
			}
			for (let i = 0; i < this.amountList.length; i++) {
				if (
					this.inputAmount >= this.amountList[i].price &&
					this.inputAmount < this.amountList[i + 1].price
				) {
					this.inputAmountGive = this.amountList[i].give_price;
				}
			}
		},
		async pay() {
			if (this.payTypeList.order_ali_pay === '0' && this.payTypeList.order_wechat_pay === '0') return;
			const params = {};
			params.money = parseFloat(this.inputAmount);
			switch (parseInt(this.payType, 10)) {
				case 1: // 微信支付
					await this.$mPayment.weixinPay('recharge', JSON.stringify(params), '/pages/user/account/account', this.code);
					break;
				case 2: // 支付宝支付
					await this.$mPayment.aliPay('recharge', JSON.stringify(params), '/pages/user/account/account');
					break;
				default:
					break;
			}
		},
		handleInvoiceTypeChange(e) {
			this.invoiceData.type = e.detail.value;
		},
		switchChange(e) {
			this.invoiceData.is_default = e.detail.value ? '1' : '0';
		},
		// 充值成功后更新用户信息
		async getMemberInfo() {
			this.$http.get(memberInfo).then(r => {
				uni.setStorage({
					key: 'userInfo',
					data: r.data
				});
				this.userInfo = r.data || undefined;
			});
		},
		toTipDetail() {
			this.$mRouter.push({
				route: '/pages/set/about/detail?field=protocol_recharge&title=充值协议'
			});
		},
		// 初始化数据
		async initData(options) {
			this.code = options.code;
			this.userInfo = uni.getStorageSync('userInfo') || undefined;
			this.pageLoading = false;
			
		},
		
	}
};
</script>

<style lang="scss">
page {
	background-color: $color-white;
}
.invoice-manage {
	padding-top: $spacing-base;
	.invoice-type-item {
		margin-right: $spacing-base;
		.gender-item-text {
			margin-left: $spacing-sm;
		}
		.gender-item-radio {
			transform: scale(0.8);
		}
	}
}
.block {
	width: 100%;
	padding: 20rpx;

	.title {
		width: 100%;
		font-size: 34rpx;
	}

	.content {
		.my {
			width: 100%;
			height: 120rpx;
			display: flex;
			align-items: center;
			font-size: $font-lg;
			border-bottom: solid 1rpx #eee;

			.balance {
				margin-right: 6rpx;
				font-size: $font-lg + 4rpx;
			}
		}

		.amount {
			width: 100%;

			.list {
				display: flex;
				justify-content: space-between;
				padding-top: 20rpx;
				flex-wrap: wrap;

				.box {
					width: 31%;
					margin-bottom: 20rpx;
					height: 120rpx;
					text-align: center;
					border-radius: 10rpx;
					box-shadow: 0rpx 5rpx 20rpx rgba(0, 0, 0, 0.05);
					&.on {
						background-color: #f1f1f1;
						color: #333;
					}

					.real {
						font-size: $font-lg;
						margin-top: 10rpx;
					}

					.give {
						display: block;
						font-size: $font-sm;
					}
				}
			}

			.num {
				margin-top: 10rpx;
				display: flex;
				justify-content: flex-end;
				align-items: center;

				.text {
					padding-right: 10rpx;
					font-size: 30rpx;
				}

				.give {
					font-size: $font-sm;
				}

				.input {
					width: 28.2vw;
					border-bottom: solid 2rpx;
					justify-content: flex-end;
					align-items: center;

					input {
						margin: 0 20rpx;
						height: 60rpx;
						font-size: 30rpx;
						justify-content: flex-end;
						align-items: center;
					}
				}
			}
		}

		.pay-list {
			width: 100%;
			border-bottom: solid 1rpx #eee;

			.row {
				width: 100%;
				height: 120rpx;
				display: flex;
				align-items: center;

				.icon {
					width: 100rpx;
					font-size: 52rpx;
					margin-left: 15rpx;
				}

				.iconerjiye-yucunkuan {
					color: #fe8e2e;
				}

				.iconweixinzhifu {
					color: #36cb59;
				}

				.iconalipay {
					color: #01aaef;
				}

				.center {
					width: 100%;
					font-size: 30rpx;
				}

				.right {
					width: 100rpx;
					flex-shrink: 0;
					display: flex;
					justify-content: flex-end;
				}
			}
		}
	}
}

.pay {
	margin-top: 20rpx;
	width: 100%;
	display: flex;
	justify-content: center;
	flex-wrap: wrap;

	.btn {
		width: 70%;
		height: 80rpx;
		border-radius: 80rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		color: #fff;
		box-shadow: 0rpx 5rpx 10rpx rgba(0, 0, 0, 0.2);
	}

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
}

.rmbLogo {
	font-size: 40rpx;
}

button {
	background-color: #007aff;
	color: #ffffff;
}

.uni-h1.uni-center {
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: flex-end;
}

.price {
	border-bottom: 1px solid #eee;
	width: 200rpx;
	height: 80rpx;
	padding-bottom: 4rpx;
}

.ipaPayBtn {
	margin-top: 30rpx;
}
</style>

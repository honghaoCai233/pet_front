<template>
	<view class="evaluation">
		<!--商品信息-->
		<view class="product-info">
			<image
				class="product-image"
				mode="aspectFill"
				:src="productInfo.product_picture"
			></image>
			<view class="product-content">
				<text class="product-name in2line">{{ productInfo.product_name }}</text>
				<text class="product-sku-name">{{
					productInfo.sku_name || singleSkuText
				}}</text>
				<text class="product-price"
					>{{ productInfo.product_money }} * {{ productInfo.num }}</text
				>
			</view>
		</view>
		<!--详细描述信息-->
		<view class="input-content">
			<view class="input-item">
				<text class="tit">快递公司</text>
				<input
					type="text"
					@input="handleRefundShippingCompanyChange"
					:value="salesReturn.refund_shipping_company"
					placeholder="请输入快递公司"
				/>
			</view>
			<view class="input-item">
				<text class="tit">快递单号</text>
				<input
					type="text"
					@input="handleRefundShippingCodeChange"
					:value="salesReturn.refund_shipping_code"
					placeholder="请输入快递单号"
				/>
			</view>
		</view>
		<!--提交退货物流-->
		<button class="confirm-btn" @tap="handleSalesReturn" :class="'bg-' + themeColor.name">提交退货物流</button>
	</view>
</template>
<script>
/**
 * @des 提交退货物流
 *
 * @author stav stavyan@qq.com
 * @date 2020-03-16 11:15
 * @copyright 2019
 */
import {
	orderProductSalesReturn,
	orderCustomerSalesReturn
} from '@/api/userInfo';
export default {
	data() {
		return {
			productInfo: {},
			token: null,
			// 评论表单
			salesReturn: {
				id: undefined,
				refund_shipping_code: undefined,
				refund_shipping_company: undefined
			},
			singleSkuText: this.singleSkuText
		};
	},
	onLoad(options) {
		this.initData(options);
	},
	methods: {
		// 数据初始化
		initData(options) {
			this.productInfo = JSON.parse(options.data);
		},
		handleRefundShippingCompanyChange(e) {
			this.salesReturn.refund_shipping_company = e.detail.value;
		},
		handleRefundShippingCodeChange(e) {
			this.salesReturn.refund_shipping_code = e.detail.value;
		},
		// 提交评价
		async handleSalesReturn() {
			this.salesReturn.id = this.productInfo.id;
			if (!this.salesReturn.refund_shipping_company) {
				this.$mHelper.toast('请输入物流公司');
				return;
			}
			if (!this.salesReturn.refund_shipping_code === undefined) {
				this.$mHelper.toast('请输入物流单号');
				return;
			}

			let salesReturnApi = orderProductSalesReturn;
			if (this.productInfo.order_status.toString() === '4') {
				salesReturnApi = orderCustomerSalesReturn;
			}
			await this.$http
				.post(`${salesReturnApi}`, {
					...this.salesReturn
				})
				.then(() => {
					this.$mRouter.back();
				});
		}
	}
};
</script>
<style lang="scss">
page {
	background-color: $color-white;
}
.evaluation {
	background-color: $color-white;
	/*  #ifndef H5  */
	height: 100vh;
	/*  #endif  */
	padding: 20rpx;
	.product-info {
		display: flex;
		.product-image {
			width: 200rpx;
			height: 150rpx;
		}
		.product-content {
			flex: 1;
			margin-left: 20rpx;
			.product-name {
				font-size: $font-base;
				color: $font-color-dark;
				line-height: 32rpx;
				min-height: 60rpx;
			}
			.product-sku-name {
				display: block;
				font-size: $font-base;
				color: $font-color-dark;
			}
		}
	}
	.input-content {
		padding: 80rpx 0 40rpx;
		.input-item {
			display: flex;
			padding: 0 30rpx;
			background: $page-color-light;
			height: 80rpx;
			line-height: 80rpx;
			border-radius: 4px;
			margin-bottom: 40rpx;
			&:last-child {
				margin-bottom: 0;
			}
			.tit {
				width: 120rpx;
				font-size: $font-sm + 2rpx;
				color: $font-color-base;
			}
			input {
				width: calc(100% - 120rpx);
				height: 80rpx;
				line-height: 80rpx;
				font-size: $font-base + 2rpx;
				color: $font-color-dark;
			}
			.date {
				height: 80rpx;
				line-height: 80rpx;
				font-size: $font-base + 2rpx;
				color: $font-color-dark;
			}
		}
	}
	.confirm-btn {
		width: 630rpx;
		height: 76rpx;
		line-height: 76rpx;
		border-radius: 50px;
		margin-top: 50rpx;
		font-size: $font-lg;
		&:after {
			border-radius: 100px;
		}
	}
}
</style>

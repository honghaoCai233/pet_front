							<view class="input-item">
								<text class="iconfont iconshouji" :class="'text-' + themeColor.name"></text>
								<input
									class="login-type-input"
									type="number"
									v-model="registerParams.mobile"
									placeholder="请输入手机号码"
									maxlength="11"
								/>
							</view>
							<view class="input-item">
								<text class="iconfont iconmimaffffffpx" :class="'text-' + themeColor.name"></text>
								<input
									class="login-type-input"
									type="password"
									v-model="registerParams.password"
									placeholder="请输入密码"
									maxlength="20"
								/>
							</view>
							<view class="input-item">
								<text class="iconfont iconmimaffffffpx" :class="'text-' + themeColor.name"></text>
								<input
									class="login-type-input"
									type="password"
									v-model="registerParams.password_repetition"
									placeholder="请输入确认密码"
									maxlength="20"
								/>
							</view> 
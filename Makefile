# 项目名称
PROJECT_NAME := pet-mp

# Node相关命令
NPM := npm
YARN := yarn

# 默认目标
.DEFAULT_GOAL := help

.PHONY: help
help:
	@echo "=== $(PROJECT_NAME) 使用说明 ==="
	@echo "make install          - 安装项目依赖"
	@echo "make dev             - 启动开发环境"
	@echo "make build           - 构建生产环境"
	@echo "make clean           - 清理构建文件"
	@echo "make lint            - 运行代码检查"
	@echo "make lint-fix        - 自动修复代码格式"
	@echo "make update          - 更新依赖包"

# 安装依赖
.PHONY: install
install:
	@echo "正在安装项目依赖..."
	$(NPM) install

# 开发环境
.PHONY: dev
dev:
	@echo "启动开发环境..."
	$(NPM) run dev:weapp

# 生产环境构建
.PHONY: build
build:
	@echo "开始构建生产环境..."
	$(NPM) run build:weapp

# 清理构建文件
.PHONY: clean
clean:
	@echo "清理构建文件..."
	rm -rf dist/
	rm -rf .temp/
	rm -rf node_modules/

# 代码检查
.PHONY: lint
lint:
	@echo "运行代码检查..."
	$(NPM) run lint

# 自动修复代码格式
.PHONY: lint-fix
lint-fix:
	@echo "自动修复代码格式..."
	$(NPM) run lint:fix

# 更新依赖包
.PHONY: update
update:
	@echo "更新依赖包..."
	$(NPM) update

# 安装新的依赖
.PHONY: add
add:
	@if [ "$(pkg)" = "" ]; then \
		echo "使用方法: make add pkg=包名"; \
		exit 1; \
	fi
	$(NPM) install $(pkg) --save

# 安装开发依赖
.PHONY: add-dev
add-dev:
	@if [ "$(pkg)" = "" ]; then \
		echo "使用方法: make add-dev pkg=包名"; \
		exit 1; \
	fi
	$(NPM) install $(pkg) --save-dev

# 运行测试
.PHONY: test
test:
	@echo "运行测试..."
	$(NPM) run test

# 创建新页面
.PHONY: new-page
new-page:
	@if [ "$(name)" = "" ]; then \
		echo "使用方法: make new-page name=页面名"; \
		exit 1; \
	fi
	mkdir -p src/pages/$(name)
	touch src/pages/$(name)/index.tsx
	touch src/pages/$(name)/index.scss 
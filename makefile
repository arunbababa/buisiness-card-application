.PHONY: test

# npm test を実行
test:
	npm run test

# Reactアプリをビルド
build:
	npm run build

# Firebaseにデプロイ (ビルド後に実行)
deploy: build
	firebase deploy

# ビルドフォルダを削除
clean:
	rmdir /s /q build
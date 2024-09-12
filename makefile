install:
	npm ci

lint:
	npx eslint .

serve:
	npx webpack serve

build:
	rm -rf dist
	NODE_ENV=production npx webpack
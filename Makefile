
init:
	npm init

start:
	npm start

dist: dist-clean
	npm run build

dist-clean:
	rm -rf ./dist

skyraid-copy:
	cp -r ../skyraid/rel/skyraid ./app

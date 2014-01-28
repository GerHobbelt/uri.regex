
all: uri.js


uri.js: build.js uri.regex
	node ./build.js


clean:
	-touch build.js


.PHONY: all clean


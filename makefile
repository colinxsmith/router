INTERFACE=OPT
CC=gcc
CXX=g++
GYPVER=$$(node_modules/.bin/node -v | sed "s/v//")
CFLAGS=	-fpic \
	'-DNODE_GYP_MODULE_NAME=$(INTERFACE)' \
	'-DUSING_UV_SHARED=1' \
	'-DUSING_V8_SHARED=1' \
	'-DV8_DEPRECATION_WARNINGS=1' \
	'-D_LARGEFILE_SOURCE' \
	'-D_FILE_OFFSET_BITS=64' \
	'-DBUILDING_NODE_EXTENSION'
CXXFLAGS=-I/home/colin/.node-gyp/$(GYPVER)/include/node \
	-I/home/colin/.node-gyp/$(GYPVER)/deps/uv/include \
	-I/home/colin/.node-gyp/$(GYPVER)/deps/v8/include \
	-I/home/colin/safeqp

CXXFLAGS+=	-std=gnu++0x
LDFLAGS=-L/home/colin/safeqp -lsafeqp 
SWIG=/home/colin/SWIGcvs/SWIG/swig
$(INTERFACE).node:	$(INTERFACE)_wrap.o
	$(CC) -shared $(INTERFACE)_wrap.o $(LDFLAGS) -o $@
$(INTERFACE)_wrap.cxx:	$(INTERFACE).i makefile
	$(SWIG) -version
	$(SWIG) -javascript -c++ -node -DV8_VERSION=0x032318 -module $(INTERFACE) -o $@ $(INTERFACE).i
clean:
	$(RM) $(INTERFACE)_wrap.cxx $(INTERFACE)_wrap.o $(INTERFACE).node
$(INTERFACE)_wrap.o:	$(INTERFACE)_wrap.cxx
	$(CXX) $(CFLAGS) $(CXXFLAGS) -c $< -o $@
test:	$(INTERFACE).node
	export LD_LIBRARY_PATH=/home/colin/safeqp && sed "s|/build/Release||" runme.js | node_modules/.bin/node 
server:	$(INTERFACE).node
	export LD_LIBRARY_PATH=/home/colin/safeqp && sed "s|/build/Release||" server.js | node_modules/.bin/node 

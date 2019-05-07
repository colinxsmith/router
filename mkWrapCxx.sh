PATH=$PATH:/usr/bin
swig=c:/SWIGcvs/SWIG/swig
$swig -javascript -c++ -node -o OPT_wrap.cxx OPT.i
bash make_12.1.sed
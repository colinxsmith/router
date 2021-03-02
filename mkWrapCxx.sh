PATH=$PATH:/usr/bin
swig=c:/SWIGcvs/SWIG/swig
$swig -javascript -c++ -node -o OPT_wrap.cxx OPT.i
#dos2unix make_12.1.sed && bash make_12.1.sed
sed -n "/Cvar/p" OPT.i
sed -n "/CVar/p" OPT.i
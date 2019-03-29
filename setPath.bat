set PATH=%PATH%;c:\Users\colin\safeqp64;c:\Python27x64
cl removeendcommas.c -Fe: removeendcommas.exe
copy ..\safe.i OPT.i
copy ..\optimise.h
copy ..\baseoptimise.h
copy ..\ldefns.h
copy ..\constant.h
copy ..\validate.h
{
  'targets': [
    {
      'target_name': 'OPT',
      'sources': [ 'OPT_wrap.cxx' ],
      'include_dirs': ['./', '../safeqp'],
      'cflags_cc': [ '-fexceptions','-Wno-deprecated-declarations','-Wno-unused-but-set-variable' ],
      'libraries': ['-L ~/safeqp', '-lsafeqp']
    }
  ]
}

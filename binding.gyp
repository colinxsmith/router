{
  'targets': [
    {
      'target_name': 'OPT',
      'sources': [ 'OPT_wrap.cxx' ],
      'include_dirs': ['./', '../safeqp'],
      'cflags_cc': [ '-fexceptions' ],
      'libraries': ['-L ~/safeqp', '-lsafeqp']
    }
  ]
}

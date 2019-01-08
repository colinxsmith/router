{
  'targets': [
    {
      'target_name': 'OPT',
      'sources': [ 'OPT_wrap.cxx' ],
      'include_dirs': ['./'],
      'libraries': ['-L ~/safeqp', '-lsafeqp']
    }
  ]
}

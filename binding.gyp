{

    'targets': [
        {
            'target_name': 'OPT',
            'sources': ['OPT_wrap.cxx'],
            'defines': ['MYNOVIRT', 'BITADIRECT', '__SYSNT__', '__SYSNT64__', 'GETTINGREADYFORTHEFUTURE'],
            'include_dirs': ['./', '../'],
            'libraries': ['c:\\Users\\colin\\safeqp64\\safeqp.lib'],
            'configurations':{
                'Release': {'msvs_settings': {
                    'VCCLCompilerTool': {
                        'AdditionalOptions': [
                            '/EHsc'
                        ]
                    }
                }
                },
                'Debug':{'msvs_settings': {
                    'VCCLCompilerTool': {
                        'AdditionalOptions': [
                            '/EHsc'
                        ]
                    }
                }
                }
            },

        }
    ]
}

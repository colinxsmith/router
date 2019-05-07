 sed -i "s/v8::Handle</v8::Local</g" OPT_wrap.cxx
 sed -i "s/->NewInstance()/->NewInstance(isolate->GetCurrentContext()).FromMaybe(v8::Local<v8::Object>())/g" OPT_wrap.cxx 
 sed -i "s/->GetFunction()/->GetFunction(SWIGV8_CURRENT_CONTEXT()).ToLocalChecked()/g" OPT_wrap.cxx 

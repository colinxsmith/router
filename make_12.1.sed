 sed -i "s/v8::Handle</v8::Local</g" OPT_wrap.cxx
 sed -i "s/->NewInstance()/->NewInstance(isolate->GetCurrentContext()).FromMaybe(v8::Local<v8::Object>())/g" OPT_wrap.cxx 
 sed -i "s/->GetFunction()/->GetFunction(SWIGV8_CURRENT_CONTEXT()).ToLocalChecked()/g" OPT_wrap.cxx 
 sed -i "s/Utf8(v8::Isolate::GetCurrent(), cstr, v8::String::kNormalString, len)/Utf8(v8::Isolate::GetCurrent(), cstr, (v8::NewStringType) v8::String::kNormalString, len).FromMaybe(v8::Local<v8::String>())/g" OPT_wrap.cxx
 sed -i "s/Utf8(v8::Isolate::GetCurrent(), sym)/Utf8(v8::Isolate::GetCurrent(), sym,(v8::NewStringType) v8::String::kNormalString).FromMaybe(v8::Local<v8::String>())/g" OPT_wrap.cxx
 sed -i "s/Utf8(v8::Isolate::GetCurrent(), str)/Utf8(v8::Isolate::GetCurrent(), str,(v8::NewStringType) v8::String::kNormalString).FromMaybe(v8::Local<v8::String>())/g" OPT_wrap.cxx
 sed -i "s/->BooleanValue(SWIGV8_CURRENT_CONTEXT()).ToChecked()/->BooleanValue(v8::Isolate::GetCurrent())/g" OPT_wrap.cxx
 sed -i "s/arr->Set(arr->Length(), obj)/arr->Set(SWIGV8_CURRENT_CONTEXT(),arr->Length(), obj).FromMaybe(bool())/g" OPT_wrap.cxx
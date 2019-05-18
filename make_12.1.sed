 file=${1:-OPT_wrap.cxx}
 sed -i "s/v8::Handle</v8::Local</g" $file
 sed -i "s/->NewInstance()/->NewInstance(isolate->GetCurrentContext()).ToLocalChecked()/g" $file 
 sed -i "s/obj->Set(SWIGV8_SYMBOL_NEW(symbol)/obj->Set(SWIGV8_CURRENT_CONTEXT(),SWIGV8_SYMBOL_NEW(symbol)/g" $file
 sed -i "s/->GetFunction())/->GetFunction(SWIGV8_CURRENT_CONTEXT()).ToLocalChecked()).FromJust()/g" $file 
 sed -i "s/->GetFunction()/->GetFunction(SWIGV8_CURRENT_CONTEXT()).ToLocalChecked()/g" $file 
 sed -i "s/Utf8(v8::Isolate::GetCurrent(), cstr, v8::String::kNormalString, len)/Utf8(v8::Isolate::GetCurrent(), cstr, (v8::NewStringType) v8::String::kNormalString, len).ToLocalChecked()/g" $file
 sed -i "s/Utf8(v8::Isolate::GetCurrent(), sym)/Utf8(v8::Isolate::GetCurrent(), sym,(v8::NewStringType) v8::String::kNormalString).ToLocalChecked()/g" $file
 sed -i "s/Utf8(v8::Isolate::GetCurrent(), str)/Utf8(v8::Isolate::GetCurrent(), str,(v8::NewStringType) v8::String::kNormalString).ToLocalChecked()/g" $file
 sed -i "s/->IntegerValue(SWIGV8_CURRENT_CONTEXT()).ToChecked()/->IntegerValue(SWIGV8_CURRENT_CONTEXT()).FromJust()/g" $file
 sed -i "s/->BooleanValue(SWIGV8_CURRENT_CONTEXT()).ToChecked()/->BooleanValue(v8::Isolate::GetCurrent())/g" $file
 sed -i "s/->NumberValue(SWIGV8_CURRENT_CONTEXT()).ToChecked()/->NumberValue(SWIGV8_CURRENT_CONTEXT()).FromJust()/g" $file
 sed -i "s/arr->Set(arr->Length(), obj)/arr->Set(SWIGV8_CURRENT_CONTEXT(),arr->Length(), obj).FromJust()/g" $file
 sed -i "s/exports_obj->Set(/exports_obj->Set(SWIGV8_CURRENT_CONTEXT(),/g" $file
 sed -i "/exports_obj->Set/s/);/).FromJust();/g" $file
 sed -i "/SetHiddenPrototype/s|_exports|// _exports|"  $file
 sed -i "/handle.MarkIndependent(/s|cdata|// cdata|" $file
#include <nan.h>
#include "hello.h"

using namespace Nan;

//void Hello(const FunctionCallbackInfo<v8::Value>& info) {
//    HandleScope scope;
//    info.GetReturnValue().Set(New("worldd").ToLocalChecked());
//}
//
////NAN_METHOD(Hello) {
////    info.GetReturnValue().Set(New("worldd").ToLocalChecked());
////}
//void InitAll(v8::Local<v8::Object> exports) {
//    exports->Set(New<v8::String>("hello").ToLocalChecked(),
//        GetFunction(New<v8::FunctionTemplate>(Hello)).ToLocalChecked());
//}


void InitAll(v8::Local<v8::Object> exports) {
    Hello::Init(exports);
}

NODE_MODULE(addon, InitAll)
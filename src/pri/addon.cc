#include <nan.h>
#include <iostream>

using namespace Nan;
using v8::Local;
using v8::Number;

void Hello(const FunctionCallbackInfo<v8::Value>& info) {
    HandleScope scope;
    long y = 2;
    long x = (long)(info[0]->NumberValue());
    y += x;
    info.GetReturnValue().Set(New<Number>(y));
}

long foo(long x) {
    bool[100]
    return base.size
}


//NAN_METHOD(Hello) {
//    info.GetReturnValue().Set(New("worldd").ToLocalChecked());
//}

void InitAll(v8::Local<v8::Object> exports) {
    exports->Set(New<v8::String>("hello").ToLocalChecked(),
        GetFunction(New<v8::FunctionTemplate>(Hello)).ToLocalChecked());
}

NODE_MODULE(addon, InitAll)
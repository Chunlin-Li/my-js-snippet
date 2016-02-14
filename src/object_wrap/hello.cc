#include "hello.h"

Nan::Persistent<v8::Function> Hello::constructor;

using v8::Local;
using v8::Object;
using v8::Value;

using Nan::HandleScope;
using Nan::FunctionCallbackInfo;


Hello::Hello (int num) {
    this->number = num;
}

Hello::~Hello () {
}

void Hello::Init(Local<Object> exports) {
    HandleScope scope;

    Local<v8::FunctionTemplate> tpl = Nan::New<v8::FunctionTemplate>(Hello::New);
    tpl->SetClassName(Nan::New("ObjHello").ToLocalChecked());
    tpl->InstanceTemplate()->SetInternalFieldCount(1);

    Nan::SetPrototypeMethod(tpl, "toString", ToString);

    constructor.Reset(tpl->GetFunction());
    exports->Set(Nan::New("ObjHello").ToLocalChecked(), tpl->GetFunction());
}

void Hello::New(const FunctionCallbackInfo<Value>& info) {
    HandleScope scope;

    if (info.IsConstructCall()) {
        int number = info[0]->IsNumber() ? info[0]->NumberValue() : 999;
        Hello* hlp = new Hello(number);
        hlp->Wrap(info.This());
        info.GetReturnValue().Set(info.This());
    } else {
        Nan::ThrowError("must call as constructor");
    }
    return;
}

void Hello::ToString(const FunctionCallbackInfo<Value>& info) {
    HandleScope scope;

    Hello* hlp = ObjectWrap::Unwrap<Hello>(info.Holder());
    info.GetReturnValue().Set(Nan::New<v8::Number>(hlp->number));
}
#ifndef HELLO_H
#define HELLO_H

#include <nan.h>

using v8::Local;
using v8::Object;
using v8::Value;
using v8::Function;
using Nan::FunctionCallbackInfo;
using Nan::Persistent;
using Nan::ObjectWrap;

class Hello : public ObjectWrap {
    public:
        static void Init(Local<Object> exports);

    private:
        explicit Hello(int num);
        ~Hello();

        static void New(const FunctionCallbackInfo<Value>& info);
        static void ToString(const FunctionCallbackInfo<Value>& info);
        static Persistent<Function> constructor;

        int number;
};


#endif
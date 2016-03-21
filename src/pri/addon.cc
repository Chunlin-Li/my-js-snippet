#include <nan.h>
#include <iostream>
#include <algorithm>

using namespace Nan;
using v8::Local;
using v8::Number;

int count(int x);

void priCount(const FunctionCallbackInfo<v8::Value>& info) {
    HandleScope scope;
    int x = (int)(info[0]->NumberValue());
    int y = count(x);
    info.GetReturnValue().Set(New<Number>(y));
}

int count(int x) {
    if (x < 3) return 0;

              unsigned char* base = new unsigned char[x];
              memset(base, 1, x);
              base[0] = 0;
              base[1] = 0;

              int count = 0;
              unsigned char* end = base + x;
              unsigned char* t = base + 2;
              int i, j;

              while (t != end) {
                count ++;
                i = t - base;
                j = i * 2;
                while (j < x) {
                  base[j] = 0;
                  j += i;
                }
                t = std::find(base + i + 1, end, 1);
            }
            return count;
}

void InitAll(v8::Local<v8::Object> exports) {
    exports->Set(New<v8::String>("priCount").ToLocalChecked(),
        GetFunction(New<v8::FunctionTemplate>(priCount)).ToLocalChecked());
}

NODE_MODULE(addon, InitAll)
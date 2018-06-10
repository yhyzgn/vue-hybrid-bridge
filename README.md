# HybridBridge

![widget](https://img.shields.io/badge/HybridBridge-1.0.0-brightgreen.svg)

> 为了方便`Web`与移动端的交互实现，该库也对`js`端稍作封装
>
> 同时，对`Android`端也简略地封装了下，具体请参考[`HybridBridge`](https://github.com/yhyzgn/Widgets#HybridBridge)；`IOS`端目前仅支持`JavaScriptCore`框架，直接按其用法使用即可。



#### 用法

* 下载`hybrid.js`，并引入到项目中

  * 下载地址：[`hybrid.js`](https://github.com/yhyzgn/HybridBridge/blob/master/hybrid/hybrid.js)

  * 引入到项目中

    ```html
    <script src="hybrid/hybrid.js"></script>
    ```

* 初始化

  > 无论页面是否已经加载完成都可以初始化
  >
  > 第一个参数是一些配置，改参数可不传，使用默认配置
  >
  > 第二个参数是初始化完成的相关回调
  >
  > **注意：后续的一些列操作都需要初始化成功作为前提**

  ```javascript
  // 使用自定义配置
  // Hy.init({}, function(){});
  Hy.init({
      urlFlagValue: "app"
  }, function (mobile, android, ios) {
      environment(mobile, android, ios);
      
      // 后续的一些列操作都需要在这里执行  	
  });
  
  // 使用默认配置时，可以这样初始化
  Hy.init(function(){});
  ```
  > `Hybrid.config`配置说明

  ```javascript
  config: {
      // 是否使用严格模式（不只是识别移动端内核浏览器，还需要判断“urlFlagName”参数），默认为true
      strict: true,
      // URL标识名称
      urlFlagName: "platform",
      // URL标识值
      urlFlagValue: "app",
      // Android端交互桥梁名称
      bridge: window.app
  }
  ```

* 注册函数到`js`环境，供移动端调用

  > 传入js对象

  ```javascript
  // {方法名：方法体}
  Hy.register({
      test: function (args) {
          args = "接收到原生传过来的参数‘" + args + "’，我再通过原生窗口弹出！";
          alert(args);
      }
  });
  ```

  > 也可以用key-value的方式

  ```javascript
  // (方法名，方法体)
  Hy.register("test", function(args){
      args = "接收到原生传过来的参数‘" + args + "’，我再通过原生窗口弹出！";
      alert(args);
  });
  ```

* 调用原生移动端的方法

  > 只调用方法，不传递任何参数，也不需要返回值

  ```javascript
  // (方法名)
  Hy.native("test");
  ```

  > 调用方法，并传递参数（参数必须是`js`的对象类型，底层使用`json`格式交互）

  ```javascript
  // （方法名，参数）
  Hy.native("test", {
      name: "张三",
      age: 24,
      desc: "js调用了原生方法"
  });
  ```

  > 调用方法，不仅传递参数，还需要返回值

  ```javascript
  // （方法名，参数，接收返回值的回调函数）
  Hy.native("test", {
      name: "张三",
      age: 24,
      desc: "js调用了原生方法"
  }, function (result) {
      console.log(result);
  });
  ```

* 其他无关函数

  ```js
  function print(text) {
      console.log(text);
  }
  function environment(mobile, android, ios) {
      if (mobile) {
          if (android) {
              print("Android")
          } else if (ios) {
              print("IOS")
          } else {
              print("Other mobile")
          }
      } else {
          print("PC")
      }
  }
  ```

> 就这么多啦！！

----

#### License

```tex
Copyright 2018 yhyzgn

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```




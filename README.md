# `vue-hybrid-bridge`

![npm](https://img.shields.io/npm/v/vue-hybrid-bridge?color=orange&label=vue-hybrid-bridge&style=flat-square)

> 为了方便`Web`与移动端的交互实现，该库也对`js`端稍作封装
>
> `Android`端支持`SDK`自带`WebView`集成；`IOS`端目前支持`WKWebView`控件和`JavaScriptCore`框架的`JSExport`方式，直接按其用法使用即可。

## `main.js`

```js
import {createApp} from 'vue'
import App from './App.vue'

import {HybridBridge} from 'vue-hybrid-bridge'

const app = createApp(App)
  .use(HybridBridge)
// 或者
// .use(HybridBridge, {namespace: 'app'}) // 默认即为 app
// 后续可直接通过 this[`$${namespace}`] 调用
app.mount('#app')
```

## 1、当前 `Vue` 实例直接使用

> `this.$app.inject('fnName', () => {})`
> 
> `this.$app.handle('fnName', {})`

```vue

<script>
export default {
  name: "Test",
  created () {
    // ********************************************************************
    // 注册js方法，供原生调用
    // 方式1、方法名-方法体
    this.$app.inject('test', data => {
      console.log(`原生调了js方法，并传了参数：${data}`)
    }).then(() => {
      // 注入成功
    }).catch(err => {
      // 注入失败
      console.log(err)
    })
    
    // 方式2、多个方法注入
    this.$app.inject({
      'test1': () => {
      },
      'test2': data => {
      }
      // ...
    }).then(() => {
      // 注入成功
    }).catch(err => {
      // 注入失败
      console.log(err)
    })
    
    
    // ********************************************************************
    // 调用原生提供的方法
    // 1、无参数传递
    this.$app.handle('method').then(data => {
      // 调用成功
      console.log(`js调了原生的方法，并接收到原生回传的结果：${data}`)
    }).catch(err => {
      // 调用失败
    })
    // 2、传递参数
    this.$app.handle('method'< {
      id: 22,
      name: '一个东西'
    }).then(data => {
      // 调用成功
      console.log(`js调了原生的方法，并接收到原生回传的结果：${data}`)
    }).catch(err => {
      // 调用失败
    })
  },
  methods: {}
}
</script>
```


## 3、单独使用

```js
import {birdge} from "vue-hybrid-bridge"

// ********************************************************************
// 注册js方法，供原生调用
// 跟上述方法类似，只需把 this.$app 换成 bridge，直接使用即可
//
// 方式1、方法名-方法体
birdge.inject('test', (data) => {
  console.log(`原生调了js方法，并传了参数：${data}`)
}).then(() => {
  // 注入成功
}).catch(err => {
  // 注入失败
  console.log(err)
})

// 方式2、多个方法注入
birdge.inject({
  'test1': () => {
  },
  'test2': data => {
  }
  // ...
}).then(() => {
  // 注入成功
}).catch(err => {
  // 注入失败
  console.log(err)
})


// ********************************************************************
// 调用原生提供的方法
// 除了把 this.$app 换成 bridge 外，还需要传递第一个参数 namespace，否则将无法调用成功
// 1、无参数传递
birdge.handle('app', 'method').then(data => {
  // 调用成功
  console.log(`js调了原生的方法，并接收到原生回传的结果：${data}`)
}).catch(err => {
  // 调用失败
})
// 2、传递参数
birdge.handle('app', 'method', {
  id: 22,
  name: '一个东西'
}).then(data => {
  // 调用成功
  console.log(`js调了原生的方法，并接收到原生回传的结果：${data}`)
}).catch(err => {
  // 调用失败
})
```

> 就这么多啦！！

----

#### License

```tex
Copyright 2021 yhyzgn

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




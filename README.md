### redux的理解
> 它主要是一种观察模式设计也叫事件订阅。可以看node.js 的模块EventEmitter  的实现。源代码不多，很多好理解。以下的简化使用也非常好理解。 
[简书地址](https://www.jianshu.com/p/bd71a451fe54)

### redux 简化使用
```
//简化 redux 的实现
import { createStore } from 'redux';

var reducer = (state = 1, action) => {
    switch (action.type) {
        case 'ADD':
            return state + 1;
        case 'DELETE':
            return state - 1;
        default:
            return 100;
    }
}

var store = createStore(reducer);

var init = store.getState();
console.log('init', init);

//VIEW通过connect props注册到store
function lisner() {
    var v = store.getState();
    console.log('the state: ' + v);
}

store.subscribe(lisner);

//定义Action
class Action {
    static add() {
        store.dispatch({ type: 'ADD' });
    }

    static delete() {
        store.dispatch({ type: 'DELETE' });
    }
}

//其它VIEW或者component 调用Action
Action.add();
Action.add();
Action.add();

setTimeout(() => {
    Action.delete();
    Action.delete();
    Action.delete();
}, 2000);

//需要编译成es5, 或者copy以上代码在babel里面转换，运行测试。
```
### 加入到React 中使用。
> 对于Redux结合到React中使用，初始化声明好Reducer Action store.
Reducer的作用是响应并处理state.  而View通过与store进行connect，把View的props与store的state关联。
Action的作用是View可通过dispatch(Action) 。
具体实现请参照代码


## demo 运行

- 1.npm i
- 2.npm run start
- 3.http://localhost:3000/

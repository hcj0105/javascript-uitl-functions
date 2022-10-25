// 例子: 模拟网络请求
function requestData(params) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(params);
    }, 200);
  });
}

// 使用 生成器函数 和 yield 解决回调地狱
function* getData() {
  const res1 = yield requestData("aaa");
  const res2 = yield requestData(res1 + "bbb");
  const res3 = yield requestData(res2 + "ccc");
  console.log("res3: ", res3);
}

// 生成器函数返回一个生成器
const genetator = getData();
// 通过next方式产出值
genetator.next().value.then((res1) => {
  // 将Promise返回的值传给下一个请求作为参数
  genetator.next(res1).value.then((res2) => {
    genetator.next(res2).value.then((res3) => {
      genetator.next(res3);
    });
  });
});


// 自动化执行生成器函数
function exceGenFn(genFn) {
  // 调用生成器函数获取生成器
  const genetator = genFn();
  // 通过递归的方式去执行next
  function exec(res) {
    // 获取产出的值
    const result = genetator.next(res);
    if (result.done) return;
    result.value.then((res) => {
      exec(res);
    });
  }
  exec();
}

exceGenFn(getData)
// bundle
//es6
import 'babel-polyfill';

import minus from './vendor/minus';
console.log(minus(2, 1));

//CommonJS
var add = require('./vendor/add');
console.log(add(1, 1));

//amd,这里为什么最后显示
require(['./vendor/mult'], function(mult) {
    console.log(mult(1, 3));
})

//es6->es5 babel

let func = () => {};
const NUM = 5;
let arr = [1,2,3];
let arr2 = arr.map(i => i * 2);

console.log(arr2.includes(6));
console.log(new Set(arr2));

let clicked = false;
// import base from './base.css';
// window.addEventListener("click", function() {
//   // 需要手动点击页面才会引入样式！！！
//   if (!clicked) {
//     import("./base.css");
//     // base.use();
//   } else {
//     import("./reverse_base.css");
//     //   base.unuse();
//   } 
//   clicked = !clicked;
// });

// import './base.scss';

import "style-loader/lib/addStyles";
import "css-loader/lib/css-base";

import "./base.scss";

var loaded = false;
window.addEventListener("click", function() {
  if (!loaded) {
    import("./common.scss").then(_ => {
      // chunk-name : style
      console.log("Change bg-color of html");
      console.log(_);
      loaded = true;
    });
  }
});

import {a} from './util';
console.log(a, a());

import { chunk } from "lodash-es";
console.log(chunk([1, 2, 3], 2));


import './base.css';
var app = document.getElementById("app");
var div = document.createElement("div");
div.className = "box";
app.appendChild(div);

import "./assets/fonts/iconfont.css";

$("div").addClass("new");

jQueryAlias("div").addClass("old");

$.get(
  "/comments/hotflow",
  {
    id: "4263554020904293",
    mid: "4263554020904293",
    max_id_type: "0"
  },
  function(data) {
    console.log(data);
  }
);

if (module.hot) {
  // 检测是否有模块热更新
  module.hot.accept("./vendor/add.js", function() {
    // 针对被更新的模块, 进行进一步操作
    console.log("/vendor/add.js is changed");
  });
}
console.log('code change');
if (process.env.NODE_ENV === "development") {
  console.log("开发环境");
} else {
  console.log("生产环境");
}
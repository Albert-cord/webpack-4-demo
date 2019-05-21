//直接加载
// import _ from 'lodash';
// import './subPageB';
// console.log("At page 'B' :", _);
// export default "pageB";

//懒加载
import("./subPageA").then(function(subPageA) {
    console.log(subPageA);
  });
  
  import("./subPageB").then(function(subPageB) {
    console.log(subPageB);
  });
  
  import("lodash").then(function(_) {
    console.log(_.join(["3", "4"]));
  });
  export default "pageB";
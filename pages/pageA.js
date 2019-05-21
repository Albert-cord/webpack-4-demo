//直接加载
// import _ from 'lodash';
// import './subPageA';
// console.log("At page 'A' :", _);
// export default "pageA";

//懒加载
import("./subPageA").then(function(subPageA) {
    console.log(subPageA);
  });
  
  import("./subPageB").then(function(subPageB) {
    console.log(subPageB);
  });
  
  import("lodash").then(function(_) {
    console.log(_.join(["1", "2"]));
  });
  export default "pageA";
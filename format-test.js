// 测试格式化功能的文件
// 这个文件包含各种格式不规范的JavaScript代码

function calculateSum(a,b){
return a+b;
}

const multiply=(x,y)=>{
return x*y;
};

let result=calculateSum(10,20);

if(result>15){
console.log('结果大于15');
}else{
console.log('结果小于等于15');
}

const obj={name:'test',value:123,active:true};

for(let i=0;i<10;i++){
if(i%2===0){
console.log(i);
}
}

const arr=[1,2,3,4,5];
const filtered=arr.filter(item=>item>2);

function processData(data){
if(!data){
return null;
}
return data.map(item=>item*2);
}

console.log('测试文件创建完成，可以用来测试格式化功能');
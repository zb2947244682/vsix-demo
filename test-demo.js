// 测试文件 - 用于演示插件功能

// 这是一个没有注释的函数，可以用来测试添加注释功能
function calculateSum(a, b) {
    return a + b;
}

// 这行代码格式不规范，可以用来测试格式化功能
let result = calculateSum(10, 20);


/**
 * 函数功能描述
 * @param {type} param 参数描述
 * @returns {type} 返回值描述
 */
const multiply = (x, y) => {
    return x * y;
};

// 另一个函数用于测试
function processData(data) {
    if (!data) {
        return null;
    }
    return data.map(item => item * 2);
}

console.log('测试文件创建完成，可以用来测试插件功能');
var test = require("./build/Release/OPT");
console.log(test);
Object.keys(test).forEach(function (key) {
    exports[key] = test[key];
});
exports.here = function () {
    return 'Inside runme';
};
console.log(exports);

console.log(test.Return_Message(6));
console.log(test.version());


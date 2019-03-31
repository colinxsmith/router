const test = require('./build/Release/OPT');
const fNames = Object.keys(test);
fNames.forEach(d => {
    console.log(d, test[d]);
    const tttt = Object.entries(test[d]);
    console.log(tttt.entries());
});

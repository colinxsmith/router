const test = require("../build/Release/OPT");
console.log(test);
Object.keys(test).forEach(function (key) {
    exports[key] = test[key];
});
const diagRisk = (n,w,R) => {
    let back = 0;
    R.forEach((d,i)=>{
        back+=d*w[i]*w[i];
    });
    return back;
}
/*
    short SimleOpt(dimen n,long nfac,int ls,int full,vector SV,vector FL,vector FC,
    vector w, dimen m, vector L, vector U, vector A,vector alpha,double gamma, double*ogamma,double minRisk,double maxRisk,
    double five, double ten, double forty)
*/

var n = 20,nfac = 0, ls = 0,full =1, SV=[],FL=[],FC=[],w=[],m=1,L=[],U=[],A=[],alpha=[],gamma=0.5,ogamma=[],minRisk=-1,maxRisk=-1,
five=0.05,ten=0.1,forty=0.4;
for(let i = 0;i<n;++i){
    SV.push(1e-2*(i+1));
    w.push(0);
    L.push(0);
    U.push(1);
    A.push(1);
    alpha.push((i+1)*(i+1)*1e-4);
}
L.push(1);
U.push(1);
ogamma.push(gamma);
console.log(test.version());

gamma=0;
let back = test.SimpleOpt(n,nfac,ls,full,SV,FL,FC,
    w, m, L, U, A,alpha,gamma,ogamma,minRisk,maxRisk,
    five, ten, forty)

console.log(w);
const minV=diagRisk(n,w,SV);

gamma=1;
back = test.SimpleOpt(n,nfac,ls,full,SV,FL,FC,
    w, m, L, U, A,alpha,gamma,ogamma,minRisk,maxRisk,
    five, ten, forty)

console.log(w);
const maxV=diagRisk(n,w,SV);

minRisk = (Math.sqrt(minV) + Math.sqrt(maxV)) / 2;
maxRisk = minRisk;

gamma=1;
back = test.SimpleOpt(n,nfac,ls,full,SV,FL,FC,
    w, m, L, U, A,alpha,gamma,ogamma,minRisk,maxRisk,
    five, ten, forty)

console.log(w);
console.log(ogamma);

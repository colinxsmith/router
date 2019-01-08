const test = require("../build/Release/OPT");
const output={}
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
    double five, double ten, double forty);

    void factor_model_process(unsigned long n,unsigned long nfac,vector FL,vector FC,vector SV,vector Q);

    void Get_RisksC(unsigned long n,long nfac,vector Q,vector w,vector benchmark,double* arisk,
                                double* risk,double* Rrisk,double* brisk,
                                double *pbeta,unsigned long ncomp,vector Composite);*/

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

gamma=0;
let back = test.SimpleOpt(n,nfac,ls,full,SV,FL,FC,
    w, m, L, U, A,alpha,gamma,ogamma,minRisk,maxRisk,
    five, ten, forty)

const minV=diagRisk(n,w,SV);
output.low={};
output.low.gamma=ogamma[0];
output.low.portfolio=w.map((d) => d);
output.low.alpha=alpha;
output.low.risk=Math.sqrt(minV);

gamma=1;
back = test.SimpleOpt(n,nfac,ls,full,SV,FL,FC,
    w, m, L, U, A,alpha,gamma,ogamma,minRisk,maxRisk,
    five, ten, forty)

const maxV=diagRisk(n,w,SV);
output.high={};
output.high.gamma=ogamma[0];
output.high.portfolio=w.map((d) => d);
output.high.alpha=alpha;
output.high.risk=Math.sqrt(maxV);

minRisk = (Math.sqrt(minV) + Math.sqrt(maxV)) / 2;
maxRisk = minRisk;

gamma=1;
back = test.SimpleOpt(n,nfac,ls,full,SV,FL,FC,
    w, m, L, U, A,alpha,gamma,ogamma,minRisk,maxRisk,
    five, ten, forty)

output.medium={};
output.medium.gamma=ogamma[0];
output.medium.portfolio=w.map((d) => d);
output.medium.alpha=alpha;
output.medium.risk=Math.sqrt(diagRisk(n,w,SV));

console.log(output)

exports.output=output;

Q=[];
for(let i = 0;i<n*(nfac+1);++i){
    Q.push(0);
}

// Get it from the optimiser
test.factor_model_process(n,nfac,FL,FC,SV,Q);
var arisk=[0],risk=[0],Rrisk=[0],brisk=[0],pbeta=[0];
test.Get_RisksC(n,nfac,Q,w,0,arisk,
    risk,Rrisk,brisk,
    pbeta,0,0);

console.log(risk);
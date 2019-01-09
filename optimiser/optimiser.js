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
const getRisk = (n,w,nfac,SV,FL,FC) => {
    const Q=[];
    for(let i = 0;i<n*(nfac+1);++i){
        Q.push(0);
    }
    test.factor_model_process(n,nfac,FL,FC,SV,Q);
    const arisk=[0],risk=[0],Rrisk=[0],brisk=[0],pbeta=[0];
    test.Get_RisksC(n,nfac,Q,w,0,arisk,risk,Rrisk,brisk,
        pbeta,0,0);
    return risk[0];
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


// Get it from the optimiser
const risk = getRisk(n,w,nfac,SV,FL,FC);
console.log(risk);

const s1=['Colin', 'Smith'];
const s2=['h','k'];

console.log(s1);
console.log(s2);
test.testchars(2,s1,s2);
console.log(s1);
console.log(s2);
const model='/home/colin/safeqp/USE30305_30MAY03.csv';
const nnn = test.get_nstocks(model);
const nnf = test.get_nfac(model);
console.log(nnn);
console.log(nnf);
const factors=[];
for(let i=0;i<nnf;++i){
    factors.push('');
}
test.get_factornames(factors,model);
console.log(factors);
const stocks=[];
for(let i=0;i<nnn;++i){
    stocks.push('');
}
test.get_stocknames(stocks,model);
console.log(stocks);
const FLOUT = Array(n*nnf);
const SVOUT = Array(n);
const FCOUT= Array(nnf*(nnf+1)/2);
console.log(FLOUT);
console.log(SVOUT);
console.log(FCOUT);

test.getdata(n,nnf,stocks,FLOUT,SVOUT,FCOUT,model);
console.log(FLOUT);
console.log(SVOUT);
console.log(FCOUT);

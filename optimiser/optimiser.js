const test = require('../build/Release/OPT');

Object.keys(test).forEach(function(key) {
    exports[key] = test[key];
});
const diagRisk = (n, w, R) => {
    let back = 0;
    R.forEach((d, i) => {
        back += d * w[i] * w[i];
    });
    return back;
}
const getRisk = (n, w, nfac, SV, FL, FC) => {
    const Q = [];
    for (let i = 0; i < n * (nfac + 1); ++i) {
        Q.push(0);
    }
    test.factor_model_process(n, nfac, FL, FC, SV, Q);
    const arisk = [0],
        risk = [0],
        Rrisk = [0],
        brisk = [0],
        pbeta = [0];
    test.Get_RisksC(n, nfac, Q, w, 0, arisk, risk, Rrisk, brisk,
        pbeta, 0, 0);
    return risk[0];
}
const portfolio = (axis, value, alpha) => {
    const portfolio = [];
    value.forEach((d, i) => {
        portfolio.push({ 'axis': axis[i], 'id': i + 1, 'value': d, 'alpha': alpha[i] });
    });
    return portfolio;
};
const factorval = (axis, value) => {
    const factorval = [];
    value.forEach((d, i) => {
        factorval.push({ 'axis': axis[i], 'id': i + 1, 'value': d });
    });
    return factorval;
};
const opt = (n, optype) => {
    const output = [];
    const radar = [];
    /*
    char* Return_Message(int);
    char* version(char*asetup);
    double ddotvec(unsigned long n,vector a,vector b);
    void factor_model_process(unsigned long n,unsigned long nfac,vector FL,vector FC,vector SV,vector Q);
    void Get_RisksC(unsigned long n,long nfac,vector Q,vector w,vector benchmark,double* arisk,
                                    double* risk,double* Rrisk,double* brisk,
                                    double *pbeta,unsigned long ncomp,vector Composite);
    void getdata(size_t nstocks,size_t nfac,char** namelist,double* FLOUT,double* SVOUT,double* FCOUT,char* name=(char*)"modelgen.txt");
    void get_w(size_t n,vector s,vector x,vector w);
    size_t get_nfac(char* name=(char*)"modelgen.txt");
    void get_stocknames(char** sname,char*name=(char*)"modelgen.txt");
    size_t get_nstocks(char*name=(char*)"modelgen.txt");
    void get_factornames(char** fname,char*name=(char*)"modelgen.txt");*/

    var ls = 0,
        full = 1,
        w = [],
        m = 1,
        L = [],
        U = [],
        A = [],
        alpha = [],
        gamma = 0.5,
        ogamma = [],
        minRisk = -1,
        maxRisk = -1,
        five = 0.05,
        ten = 0.1,
        forty = 0.4;

    const model = '/home/colin/safeqp/USE30305_30MAY03.csv';
    const nnn = test.get_nstocks(model) + 1;
    const nfac = test.get_nfac(model);
    const factors = Array(nfac);
    test.get_factornames(factors, model);
    const stocks = Array(nnn);
    if (n > nnn) {
        n = nnn - 1;
        console.log('Max n is ' + n);
    }
    test.get_stocknames(stocks, model);
    const FL = Array(n * nfac);
    const SV = Array(n);
    const FC = Array(nfac * (nfac + 1) / 2);
    // Use first n names to define portfolio
    test.getdata(n, nfac, stocks, FL, SV, FC, model);
    const annus = 252;
    FC.forEach((d, ii) => {
        FC[ii] /= annus;
    });
    SV.forEach((d, ii) => {
        SV[ii] /= annus;
    });

    for (let i = 0; i < n; ++i) {
        w.push(1.0 / n);
        L.push(optype === 'short' ? -1 : 0);
        U.push(1);
        A.push(1);
        alpha.push((i + 1));
    }
    L.push(optype === 'short' ? 0 : 1);
    U.push(optype === 'short' ? 0 : 1);
    if (optype !== 'KAG') {
        five = -1;
        ten = -1;
        forty = -1;
    }
    if (optype === 'short') {
        ls = 1;
    }
    ogamma.push(gamma);
    const MC = Array(n);

    test.MCAR(n, nfac, w, alpha, FL, SV, FC, MC)
    alpha.forEach((d, ii) => {
        alpha[ii] *= w[ii] * MC[ii];
    });

    gamma = 0;
    let back = test.SimpleOpt(n, nfac, ls, full, SV, FL, FC,
        w, m, L, U, A, alpha, gamma, ogamma, minRisk, maxRisk,
        five, ten, forty, stocks)


    const minV = getRisk(n, w, nfac, SV, FL, FC);
    const FX = Array(nfac);
    test.FX_get(n, nfac, w, FL, SV, FC, FX);

    radar.push(factorval(factors, FX));
    output.push({ gamma: ogamma[0], risk: getRisk(n, w, nfac, SV, FL, FC), 'return': test.ddotvec(n, alpha, w), 'portfolio': portfolio(stocks, w, alpha) });

    gamma = 1;
    back = test.SimpleOpt(n, nfac, ls, full, SV, FL, FC,
        w, m, L, U, A, alpha, gamma, ogamma, minRisk, maxRisk,
        five, ten, forty, stocks)

    const maxV = getRisk(n, w, nfac, SV, FL, FC);
    test.FX_get(n, nfac, w, FL, SV, FC, FX);
    radar.push(factorval(factors, FX));

    output.push({ gamma: ogamma[0], risk: getRisk(n, w, nfac, SV, FL, FC), 'return': test.ddotvec(n, alpha, w), 'portfolio': portfolio(stocks, w, alpha) });
    minRisk = (3 * minV + maxV) / 4;
    maxRisk = minRisk;

    gamma = 0;
    back = test.SimpleOpt(n, nfac, ls, full, SV, FL, FC,
        w, m, L, U, A, alpha, gamma, ogamma, minRisk, maxRisk,
        five, ten, forty, stocks);
    test.FX_get(n, nfac, w, FL, SV, FC, FX);
    radar.push(factorval(factors, FX));

    output.push({ gamma: ogamma[0], risk: getRisk(n, w, nfac, SV, FL, FC), 'return': test.ddotvec(n, alpha, w), 'portfolio': portfolio(stocks, w, alpha) });

    minRisk = (minV + 3 * maxV) / 4;
    maxRisk = minRisk;

    gamma = 0;
    back = test.SimpleOpt(n, nfac, ls, full, SV, FL, FC,
        w, m, L, U, A, alpha, gamma, ogamma, minRisk, maxRisk,
        five, ten, forty, stocks);
    test.FX_get(n, nfac, w, FL, SV, FC, FX);
    radar.push(factorval(factors, FX));

    output.push({ gamma: ogamma[0], risk: getRisk(n, w, nfac, SV, FL, FC), 'return': test.ddotvec(n, alpha, w), 'portfolio': portfolio(stocks, w, alpha) });
    exports.output = output;
    exports.radar = radar;
}

exports.opt = opt;
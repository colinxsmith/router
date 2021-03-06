from Optn import *
from sys import argv
print version()


def kag_check(w, issues=[]):
    n = len(w)
    a = [0]*n
    back = 0
    if issues == []:
        for i in range(n):
            if w[i] > .05+eps256:
                back += w[i]
            if w[i] > .05+eps256:
                a[i] = 1
    else:
        nish = len(issues)/n
        for i in range(nish):
            exp = dot(w, issues[i*n:(i+1)*n])
            if exp > .05+eps256:
                back += exp
    return [back, a]


debug_here = 0
root2 = pow(2, .5)
annus = 252.
llambda = 1e-5
eps256 = epsget()*256
eps = epsget()*8  # pow(epsget(),.5)  #convergence for loop
bound_eps = 0  # better to use bound_eps=0 and > for kag lower limit, than bound_eps=small and >= for kag lower limit
typeOpt = 'KAG'
riskfac = 1e-1
if len(argv) > 1:
    n = int(argv[1])
else:
    n = 40
if len(argv) > 2:
    typeOpt = argv[2]
if len(argv) > 3:
    riskfac = float(argv[3])
model = '/home/colin/Dropbox/data/USE30305_30MAY03.csv'
alpha = range(n)
Quad = Opt()
Quad.getmodel(model, [])
Quad.n = n
Quad.names = [i for i in Quad.mnames[:n]]
Quad.getmodel(model, Quad.names)
annus = 25200
Quad.SV = [Quad.SV[i] / annus for i in range(len(Quad.SV))]
Quad.FC = [Quad.FC[i] / annus for i in range(len(Quad.FC))]
if typeOpt == 'LONGSHORT':
    Quad.simplehedge()
else:
    Quad.simpleset()

Quad.w = [1.0/Quad.n for i in range(Quad.n)]
Quad.props()
Quad.alpha = [Quad.w[i]*Quad.MCAR[i] for i in range(Quad.n)]

if typeOpt == 'KAG':
    Quad.five = .05
    Quad.ten = .1
    Quad.forty = .4


Quad.log = 2

Quad.gamma = 0
ret = Quad.opt()
if typeOpt == 'LONGSHORT':
    if Quad.w[Quad.n-1]*Quad.alpha[Quad.n-1] < 0:
        Quad.w = [-i for i in Quad.w]
Quad.risks()
Quad.margutility()
riskbot = Quad.risk
print Return_Message(ret)
[kag, akag] = kag_check(Quad.w)
print 'Kag total %20.5f, utility %20.15f' % (kag, Quad.utility)
print 'Relative Risk %20.5f, Relative Return %20.5f' % (
    Quad.risk, dot(Quad.w, Quad.alpha) - dot(Quad.bench, Quad.alpha))
print 'Absolute Risk %20.5f, Absolute Return %20.5f' % (
    Quad.arisk, dot(Quad.w, Quad.alpha))

print 'JSON{'
print 'JSON"OPT":[{"gamma": %f, "risk": %f, "return": %f, "portfolio":[' % (
    Quad.ogamma, Quad.risk, dot(Quad.w, Quad.alpha) - dot(Quad.bench, Quad.alpha))
for i in range(Quad.n):
    if i < Quad.n - 1:
        print 'JSON{"id": %d, "axis": "%s", "value": %f, "alpha": %f},' % (
            i+1,Quad.names[i], Quad.w[i], Quad.alpha[i])
    else:
        print 'JSON{"id": %d, "axis": "%s", "value": %f, "alpha": %f}' % (
            i+1,Quad.names[i], Quad.w[i], Quad.alpha[i])
print 'JSON]},'


Quad.gamma = 1
ret = Quad.opt()
Quad.risks()
Quad.margutility()
risktop = Quad.risk
print Return_Message(ret)
[kag, akag] = kag_check(Quad.w)
print 'Kag total %20.5f, utility %20.15f' % (kag, Quad.utility)
print 'Relative Risk %20.5f, Relative Return %20.5f' % (
    Quad.risk, dot(Quad.w, Quad.alpha) - dot(Quad.bench, Quad.alpha))
print 'Absolute Risk %20.5f, Absolute Return %20.5f' % (
    Quad.arisk, dot(Quad.w, Quad.alpha))

print 'JSON{"gamma": %f, "risk": %f, "return": %f, "portfolio":[' % (
    Quad.ogamma, Quad.risk, dot(Quad.w, Quad.alpha) - dot(Quad.bench, Quad.alpha))
for i in range(Quad.n):
    if i < Quad.n - 1:
        print 'JSON{"id": %d, "axis": "%s", "value": %f, "alpha": %f},' % (
            i+1,Quad.names[i], Quad.w[i], Quad.alpha[i])
    else:
        print 'JSON{"id": %d, "axis": "%s", "value": %f, "alpha": %f}' % (
            i+1,Quad.names[i], Quad.w[i], Quad.alpha[i])
print 'JSON]},'

Quad.minrisk = 0
Quad.maxrisk = riskbot + (risktop - riskbot) * riskfac

Quad.gamma = 1

ret = Quad.opt()
Quad.risks()
Quad.margutility()
risktop = Quad.risk
print Return_Message(ret)
[kag, akag] = kag_check(Quad.w)
print 'Kag total %20.5f, utility %20.15f' % (kag, Quad.utility)
print 'Relative Risk %20.5f, Relative Return %20.5f' % (
    Quad.risk, dot(Quad.w, Quad.alpha) - dot(Quad.bench, Quad.alpha))
print 'Absolute Risk %20.5f, Absolute Return %20.5f' % (
    Quad.arisk, dot(Quad.w, Quad.alpha))

print 'JSON{"gamma": %f, "risk": %f, "return": %f, "portfolio":[' % (
    Quad.ogamma, Quad.risk, dot(Quad.w, Quad.alpha) - dot(Quad.bench, Quad.alpha))
for i in range(Quad.n):
    if i < Quad.n - 1:
        print 'JSON{"id": %d, "axis": "%s", "value": %f, "alpha": %f},' % (
            i+1,Quad.names[i], Quad.w[i], Quad.alpha[i])
    else:
        print 'JSON{"id": %d, "axis": "%s", "value": %f, "alpha": %f}' % (
            i+1,Quad.names[i], Quad.w[i], Quad.alpha[i])
print 'JSON]}]}'

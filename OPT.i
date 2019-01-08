%module example
%{
    extern "C" {
        typedef double* vector;
        typedef unsigned long dimen;
        char* Return_Message(int);
        char* version(char*);
        double ddotvec(unsigned long n,vector a,vector b);
        short  Optimise_internalCVPAFblSaMSoftQ(dimen n,long nfac,char** names,vector w,dimen m,
									vector A,vector L,vector U,vector alpha,
									vector benchmark,vector Q,real gamma,vector initial,
									real delta,vector buy,vector sell,real kappa,long basket,
									long trades,int revise,int costs,real min_holding,
									real min_trade,
									int m_LS,int Fully_Invested,real Rmin,real Rmax,
									int m_Round,vector min_lot,vector size_lot,int* shake,
									dimen ncomp,vector Composite,real LSValue,
									dimen npiece,vector hpiece,vector pgrad,
									dimen nabs,vector Abs_A,dimen mabs,dimen* I_A,vector Abs_U,
									vector FC,vector FL,vector SV,double minRisk,double maxRisk,
									double* ogamma,vector mask,int log,char* logfile,
									int downrisk,double downfactor,
									long longbasket,long shortbasket,
									long tradebuy,long tradesell,double zetaS,double zetaF,
									double ShortCostScale,double LSValuel,vector Abs_L,vector shortalphacost,
									int never_slow,size_t*mem_kbytes,dimen soft_m,vector soft_l,vector soft_b,
									vector soft_L,vector soft_U,vector soft_A,vector qbuy,vector qsell,double five,double ten,double forty,int* issues);    };
%}
%typemap(in) double*,int*,unsigned long*
{
    $1 = 0;
    if($input->IsArray())
    {
        v8::Handle<v8::Array> arr= v8::Handle<v8::Array>::Cast($input);
        $1 = new $*1_ltype[arr->Length()];
        for(size_t i = 0;i < arr->Length();++i) {
            $1[i] = ($*1_ltype) arr->Get(i)->NumberValue();
        }
    }
}
%typemap(in) vector
{//This cannot figure out that $*1type is double so we must say double explicitly
    $1 = 0;
    if($input->IsArray())
    {
        v8::Handle<v8::Array> arr= v8::Handle<v8::Array>::Cast($input);
        $1 = new double[arr->Length()];
        for(size_t i = 0;i < arr->Length();++i) {
            $1[i] = (double) arr->Get(i)->NumberValue();
        }
    }
}
%typemap(argout) double*,vector
{
    if($1 && $input->IsArray()) {
        v8::Handle<v8::Array> arr= v8::Handle<v8::Array>::Cast($input);
        for(size_t i = 0;i < arr->Length();++i) {
            arr->Set(i,SWIG_From_double($1[i]));
        }
    }
}
%typemap(argout) int*,unsigned long*
{
    if($1 && $input->IsArray()) {
        v8::Handle<v8::Array> arr= v8::Handle<v8::Array>::Cast($input);
        for(size_t i = 0;i < arr->Length();++i) {
            arr->Set(i,SWIG_From_int($1[i]));
        }
    }
}
%typemap(freearg) double*,char*,int*,unsigned long*,vector
{
   if($1) {delete[] $1;}
}
%typemap(in,numinputs=0) char*asetup
{
    $1=new char[500];
}
%inline
%{
    int SimleOpt(dimen n,long nfac,int ls,int full,vector SV,vector FL,vector FC,
    vector w, dimen m, vector L, vector U, vector A,vector alpha,double gamma, double*ogamma,double minRisk,double maxRisk,
    double five, double ten, double forty)
    {
        int log = 2;
        char* logfile = "JSlog";
        short back = Optimise_internalCVPAFblSaMSoftQ(n,nfac,0,w,m,
									A,L,U,alpha,
									0,0,gamma,0,
									-1.0,0,0,-1.0,n,
									-1,0,0,-1.0,
									-1.0,
									ls,full,-1.0,-1.0,
									0,0,0,0,
									0,0,1.0,
									0,0,0,
									0,0,0,0,0,
									FC,FL,SV,minRisk,maxRisk,
									ogamma,0,log,logfile,
									0,1,
									-1,-1,
									-1,-1,1,1,
									1,0.0,0,0,
									1,0,0,0,0,
									0,0,0,0,0,five,ten,forty,0);       
    }
%}
//The following are programmed in the optimiser
char* Return_Message(int);
char* version(char*asetup);
double ddotvec(unsigned long n,vector a,vector b);




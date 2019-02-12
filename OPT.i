%module example
%{
    extern "C" {
        typedef double real;
        typedef double* vector;
        typedef unsigned long dimen;
        char* Return_Message(int);
        char* version(char*);
        double ddotvec(unsigned long n,vector a,vector b);
        void getdata(size_t nstocks,size_t nfac,char** namelist,double* FLOUT,double* SVOUT,double* FCOUT,char* name=(char*)"modelgen.txt");
        void get_w(size_t n,vector s,vector x,vector w);
        size_t get_nfac(char* name=(char*)"modelgen.txt");
        void get_stocknames(char** sname,char*name=(char*)"modelgen.txt");
        size_t get_nstocks(char*name=(char*)"modelgen.txt");
        void get_factornames(char** fname,char*name=(char*)"modelgen.txt");
        void Get_RisksC(dimen n,long nfac,vector Q,vector w,vector benchmark,double* arisk,
                            double* risk,double* Rrisk,double* brisk,
                            double *pbeta,dimen ncomp,vector Composite);
        void factor_model_process(dimen n,dimen nfac,vector FL,vector FC,vector SV,vector Q);
        void PropertiesC(dimen n,long nfac,char** stocknames,vector w,vector alpha,
                                    vector benchmark,
                                    vector QMATRIX,double* risk,double* arisk,double* Rrisk,
									double* rreturn,
                                    double* areturn,double* Rreturn,
                                    vector MCAR,vector MCTR,vector MCRR,vector FMCRR,
                                    vector FMCTR,vector   bbeta,vector FX,vector RFX,
                                    vector  FLOAD,vector FFC,vector SSV,dimen ncomp,
									vector Composite);
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
            vector soft_L,vector soft_U,vector soft_A,vector qbuy,vector qsell,double five,double ten,double forty,int* issues);
    }

%};

%typemap(in) double*,int*,unsigned long*,size_t*,dimen*
{
    $1 = 0;
    if($input->IsArray())
    {
        v8::Handle<v8::Array> arr= v8::Handle<v8::Array>::Cast($input);
        if(arr->Length()) {
            $1 = new $*1_ltype[arr->Length()];
            for(size_t i = 0;i < arr->Length();++i) {
                $1[i] = ($*1_ltype) arr->Get(i)->NumberValue();
            }
        }
    }
}
%typemap(argout) char**
{
    if($1 && $input->IsArray()) {
        v8::Handle<v8::Array> arr= v8::Handle<v8::Array>::Cast($input);
        for(size_t i = 0;i < arr->Length();++i) {
            arr->Set(i,SWIG_FromCharPtr($1[i]));
        }
    }
}
%typemap(in) char**
{
    $1 = 0;

    if($input->IsArray())
    {
        v8::Handle<v8::Array> arr= v8::Handle<v8::Array>::Cast($input);
        if(arr->Length()){
            $1 = new $*1_ltype[arr->Length()];
            for(size_t i = 0;i < arr->Length();++i) {
                int chars_written, back;
                v8::Handle<v8::String> kkk = v8::Handle<v8::String>::Cast(arr->Get(i)->ToString());
                /*
                V8EXPORT int WriteUtf8(char* buffer,int length = -1,int* nchars_ref = NULL,int options = NO_OPTIONS) const;
                */
                char* kkkk = new char[kkk->Utf8Length() * sizeof(*kkk) + 1]; //needed the sizeoff(*kkk) when the strings were long!
                back = kkk->WriteUtf8(kkkk,kkk->Utf8Length(), &chars_written); 
                kkkk[kkk->Utf8Length()] = '\0';
                $1[i] = kkkk;
    //            printf("%s %d written, back %d **",kkkk,chars_written,back);
            }
        }
    }
}
%typemap(in) vector
{
    $1 = 0;
    if($input->IsArray())
    {
        v8::Handle<v8::Array> arr= v8::Handle<v8::Array>::Cast($input);
        if(arr->Length()){
            $1 = new $*1_ltype[arr->Length()];
            for(size_t i = 0;i < arr->Length();++i) {
                $1[i] = ($*1_ltype) arr->Get(i)->NumberValue();
            }
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
%typemap(argout) int*,unsigned long*,size_t*,dimen*
{
    if($1 && $input->IsArray()) {
        v8::Handle<v8::Array> arr= v8::Handle<v8::Array>::Cast($input);
        for(size_t i = 0;i < arr->Length();++i) {
            arr->Set(i,SWIG_From_long($1[i]));
        }
    }
}
%typemap(freearg) double*,char*,int*,unsigned long*,vector,size_t*,dimen*
{
   if($1 && $input->IsArray()) {delete[] $1;}
}
%typemap(freearg) char**
{
    if($1 && $input->IsArray())
    {
        v8::Handle<v8::Array> arr= v8::Handle<v8::Array>::Cast($input);
        size_t i;
        for(i=0;i<arr->Length();++i)
        {
            delete [] $1[i];
        }     
        delete[] $1;
    }
}
%typemap(in,numinputs=0) char*asetup
{
    $1=new char[500];
}
%inline
%{
    extern "C" void MCAR(unsigned long n,unsigned long nf,vector w,vector alpha,vector FL,vector SV,vector FC,vector MC)
    {
        vector Q=0,MCTR=new double[n],MCRR=new double[n],FMCRR=0,FMCTR=0,FX=0,RFX=0,bbeta=new double[n+1];
        double risk=0,arisk=0,Rrisk=0,rreturn=0,areturn=0,Rreturn=0;
        PropertiesC(n,nf,0,w,alpha,0,Q,&risk,&arisk,&Rrisk,
									&rreturn,
                                    &areturn,&Rreturn,
                                    MC,MCTR,MCRR,FMCRR,
                                    FMCTR,bbeta,FX,RFX,
                                    FL,FC,SV,0,0);
        delete[] MCTR;
        delete[] MCRR;
        delete[] bbeta;
    }
    extern "C" void FX_get(unsigned long n,unsigned long nf,vector w,vector FL,vector SV,vector FC,vector FX)
    {
        vector Q=0,MCAR=new double[n],MCTR=new double[n],MCRR=new double[n],FMCRR=0,FMCTR=new double[n+nf],alpha=0,RFX=0,bbeta=new double[n+1];
        double risk=0,arisk=0,Rrisk=0,rreturn=0,areturn=0,Rreturn=0;
        PropertiesC(n,nf,0,w,alpha,0,Q,&risk,&arisk,&Rrisk,
									&rreturn,
                                    &areturn,&Rreturn,
                                    MCAR,MCTR,MCRR,FMCRR,
                                    FMCTR,bbeta,FX,RFX,
                                    FL,FC,SV,0,0);
        delete[] MCAR;
        delete[] MCTR;
        delete[] MCRR;
        delete[] bbeta;
        delete[] FMCTR;
    }
    extern "C" short SimpleOpt(unsigned long n,long nfac,int ls,int full,vector SV,vector FL,vector FC,
    vector w, unsigned long m, vector L, vector U, vector A,vector alpha,double gamma, double*ogamma,double minRisk,double maxRisk,
    double five, double ten, double forty, char** names)
    {
        int log = 2;
        char* logfile = "JSlog";
        gamma=gamma>=1.0?gamma-1e-15:gamma;
        short back = Optimise_internalCVPAFblSaMSoftQ(n,nfac,names,w,m,
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
        return back;    
    }
    extern "C" void testchars(int n,char** in,char** out)
    {
        int i,l1,l2,j;
        for(i=0;i<n;++i){
            l1=strlen(in[i]);
            l2=strlen(out[i]);
            printf("%s\n",in[i]);
            printf("Before %s\n",out[i]);
            for(j=0;j<l2;++j)
            {
               if(j<l1)out[i][j]=in[i][j];
            }
            printf("Changed %s\n",out[i]);
        }
    }
%}
//The following are programmed in the optimiser
typedef unsigned long dimen;
typedef double real;
typedef double* vector;
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
void get_factornames(char** fname,char*name=(char*)"modelgen.txt");
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
            vector soft_L,vector soft_U,vector soft_A,vector qbuy,vector qsell,double five,double ten,double forty,int* issues);

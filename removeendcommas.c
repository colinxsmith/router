#include <stdio.h>
/* Removes ,,,,,,,, introduced by EXL */
int main()
{
    size_t in1, in2;
    unsigned char found = 0;
    while ((in1 = getchar()) != EOF)
    {
        if ((in2 = getchar()) != EOF)
        {
            if (!(in2 == ',' && in1 == ','))
            {
                if (!found)
                {
                    if (!(in1 == ',' && in2 == '\n'))
                    {
                        putchar(in1);
                    }
                    if (in2 == '\n')
                    {
                        found = 0;
                    }
                }
                if (in2 == '\n')
                {
                    found = 0;
                }
            }
            else
            {
                found = 1;
            }
        }
        else if (in1 != ',')
        {
            putchar(in1);
        }
        ungetc(in2, stdin);
    }
}
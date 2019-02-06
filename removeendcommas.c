#include <stdio.h>
/* Removes the trailing commas put in csv files by EXL */
int main()
{
    size_t in1, in2;
    while ((in1 = getchar()) != EOF)
    {
        if ((in2 = getchar()) != EOF)
        {
            if (!(in2 == ',' && in1 == ','))
            {
                if (!(in1 == ',' && in2 == '\n'))
                {
                    putchar(in1);
                }
                putchar(in2);
            }
        }
        else if (in1 != ',')
        {
            putchar(in1);
        }
    }
}
window.onload=function(){ //entry point
}

/* pseudo-asm code
  'nop'       ... do nothing
  'A'--'Z'    ... pointer A--Z
  'p',A,X,Y   ... pointer at (X,Y) in 2 dimensional array A
  'mov',X,Y   ... copy X into Y
  '-',X,Y     ... X minus Y
  '+',X,Y     ... X plus  Y
  '*',X,Y     ... X times Y
  '|',X,Y     ... X or    Y
  '&',X,Y     ... X and   Y
  'jmp',X     ... jump to line X
  'cnj',V,X,Y ... jump to line X if V otherwise jump to line Y
  'lpu',A,X,Y ... push loop stack with address A from X to Y
  'lpo'       ... pop loop stack
  'prn',V     ... print V
*/
var list=[
  [0,'A=9:'                             ,['mov','A',9]],
  [1,'dim B[Åá,Åá],C[Åá,Åá],D[Åá]<br>'  ,['nop']],
  [2,'for E=0 to 9<br>'                 ,['lpu','E',0,9,1]],
  [3,' for F=0 to A<br>'                ,['lpu','F',0,'A']],
  [4,'  B[1,F]=1:'                      ,['mov','p','B',1,'F',1]], 
  [5,'  C[1,F]=1<br>'                   ,['mov','p','C',1,'F',1]], 
  [6,' next<br>'                        ,['lpo']],
  [7,' for G=1 to 0 step -1<br>'        ,['lpu','G',1,0,-1]],
  [8,'  A=A*A<br>'                      ,['mov','A','mul','A','A']],
  [9,'  for H=0 to G<br>'               ,['lpu','H',0,'G']],
  [10,'   for I=0 to F<br>'             ,['lpu','H',0,'G']],
  [11,'    if '                         ,['nop']],
  [12,'B[G-H,I]'                        ,['mov','d0','p','B','-','G','H','I']],
  [15,'&lt;'                            ,['mov','d0','<','d0','d1']],
  [13,'B[G,I]'                          ,['mov','d1','p','B','G','I']],
  [14,'-D[I] '                          ,['mov','d0','-','d1','p','D','I',0]],
  [17,'|'                               ,['mov','d0','|','d0','d1']],
  [16,'B[G,1]=0'                        ,['mov','d1','==','p','B','G',1,0]],
  [18,'then<br>'                        ,['cnj','d0',19,28]],
  [19,'     if'                         ,['nop']],
  [20,'B[G,I+1]=0'                      ,['mov','p','B','G','+','I',1,0]],
  [21,'then'                            ,['cnj','d0',22,25]],
  [22,' I=F:'                           ,['mov','I','F']],
  [23,'J=H:'                            ,['mov','J','H']],
  [24,'H=G'                             ,['mov','H','G']],
  [24,'else'                            ,['jmp',27]],
  [25,' D[I]=B[G,I]-B[G-H,I]<br>'       ,['mov','p','D','I',0,'-','p','B','G','I','p','B','-','G','H','I']],
  [27,'    else<br>'                    ,['jmp',29]],
  [28,'     I=F<br>'                    ,['mov','I','F']],
  [29,'    endif<br>'                   ,['nop']],
  [30,'   next<br>'                     ,['lpo']],
  [31,'  next<br>'                      ,['lpo']],
  [32,'  for K=1 to J<br>'              ,['lpu','K',1,'J']],
  [33,'   for L=K to 0 step -1<br>'     ,['lpu','H',0,'G']],
  [34,'    if '                         ,['nop']],
  [35,'B[G-J+L,0]'                      ,['mov','d0','p','B','+','-','G','J','L',0]],
  [37,'&lt;'                            ,['mov','d0','d0','d1']],
  [36,'B[G-J+K,0]' ,                    ,['mov','d1','p','B','+','-','G','J','K',0]],
  [38,'then<br>'                        ,['cnj','d0',39,52]],
  [39,'     for M=0 to F<br>'           ,['lpu','M',0,'F']],
  [40,'      if '                       ,['nop']],
  [41,'B[G-J,M]'                        ,['mov','d0','p','B','-','G','J','M']],
  [43,'<lt;'                            ,['mov','d0','<','d0','d1']],
  [42,'B[G-J+K,M] ',                    ,['mov','d1','p','B','-','+','G','J','K']],
  [45,'&amp;'                           ,['mov','d0','&','d0','d1']],
  [44,'C[L+1,M]=1'                      ,['mov','p','C','+','L',1,'M',1]],
  [46,' then'                           ,['cnj',47,50]],
  [47,'C[K+1,M]=1'                      ,['mov','p','C','+','K',1,'M',1]],
  [48,'else'                            ,['jmp',50]],
  [49,'C[K+1,M]=0<br>'                  ,['mov','p','C','+','K',1,'M',0]],
  [50,'     next<br>'                   ,['lpo']],
  [51,'     L=0<br>'                    ,['mov','L',0]],
  [52,'    endif<br>'                   ,['nop']],
  [53,'   next<br>'                     ,['lpo']],
  [54,'  next<br>'                      ,['lpo']],
  [55,'  for N=1 to A<br>'              ,['lpu','N',1,'A']],
  [56,'   for O=1 to J<br>'             ,['lpu','O',1,'K']],
  [57,'    for P=0 to F<br>'            ,['lpu','P',0,'F']],
  [58,'     B[G,P]=B[G-J,P]<br>'        ,['mov','p','B','G','P','p','B','-','G','J','P']],
  [59,'     if'                         ,['nop']],
  [60,' C[O,P]=1'                       ,['mov','d0','==','p','C','O','P',1]],
  [61,' then'                           ,['cnj','d0',62,63]],
  [62,'B[G,P]=B[G,P]+D[P]<br>'          ,['mov','p','B','G','P','+','p','G','P','p','D',0]],
  [63,'    next<br>'                    ,['lpo']],
  [64,'    G=G+1<br>'                   ,['mov','G','+','G',1]],
  [65,'   next<br>'                     ,['lpo']],
  [66,'  next<br>'                      ,['lpo']],
  [67,'  for Q=1 to F<br>'              ,['lpu','Q',1,'F']],
  [68,'   D[Q]=0<br>'                   ,['mov','p','Q',0,0]],
  [69,'  next<br>'                      ,['lpo']],
  [70,' next<br>'                       ,['lpo']],
  [71,'next<br>'                        ,['lpo']],
  [72,'print A<br>'                     ,['prn','A']]
];

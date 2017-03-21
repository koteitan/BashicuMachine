window.onload=function(){ //entry point
  //display code
  document.getElementById('code').innerHTML="";
  for(var i=0;i<cmds;i++){
    var str=list[i][1].replace(/\s/g,'&nbsp');
    document.getElementById('code').innerHTML+="<span id=cmd"+i+">"+str+"</span>";
  }
  //init
  init();
};

var pc;
var init=function(){
  pc=0;
  var pcci=pc2cmd(pc);
  hilight(pcci);
};

var pc2cmd=function(_pc){
  var ci;
  for(ci=0;ci<cmds;ci++){
    if(list[ci][0]==_pc) return ci;
  }
  if(ci==cmds) return null;
};

var step1=function(){
  //interpret
  var pcci=pc2cmd(pc);
  interpret(list[pcci][2]);
  //next
  pc++;
  var pcci=pc2cmd(pc);
  if(pcci!=null){
    hilight(pcci);
  }else{
    init();
  }
}

var hilight=function(_ci){
  for(ci=0;ci<_ci;ci++){
    document.getElementById('cmd'+ci).style="";
  }
  document.getElementById('cmd'+_ci).style="color:white;background-color:red";
  for(ci=_ci+1;ci<cmds;ci++){
    document.getElementById('cmd'+ci).style="";
  }
};

var interpret=function(_asm){
  var asm=_asm.clone();
  while(asm.length>0){
    var opr=asm.shift();
    switch(opr){
      case 'mov':
        var opd=asm.shift(); // dst = A-Z or w
        var dst;
        var dstx;
        var dsty;
        if(opd.match(/[A-Z]/)!=null){
          dst  = opd.charCodeAt(0)-opd.charCodeAt('A');
          dstx = 0;
          dsty = 0;
        }else if(dst=='w'){
          opd  = asm.shift(); // A-Z
          dst  = opd.charCodeAt(0)-opd.charCodeAt('A');
        }
      break;
    }
  }
};

/* pseudo-asm code
  command:
   'nop'       ... do nothing
   'mov',X,Y   ... copy X into Y
   'jmp',X     ... jump to line X
   'cnj',V,X,Y ... jump to line X if V otherwise jump to line Y
   'lpu',A,X,Y ... push loop stack with address A from X to Y
   'lpo'       ... pop loop stack
   'prn',V     ... print V
  
  value and pointer:
   integers    ... immediate integer
   'A'--'Z'    ... read/write pointer at A--Z
   'w',A,X,Y   ... write pointer at A[X,Y]
   'r',A,X,Y   ... read  pointer at A[X,Y]

  operator:
   '-',X,Y     ... X minus Y
   '+',X,Y     ... X plus  Y
   '*',X,Y     ... X times Y
   '|',X,Y     ... X or    Y
   '&',X,Y     ... X and   Y
   '>',X,Y     ... is X greater than Y
   '<',X,Y     ... is X less than Y
*/
var list=[
  [0,'A=9:'                             ,['mov','A',9]],
  [1,'dim B[‡,‡],C[‡,‡],D[‡]<br>'  ,['nop']],
  [2,'for E=0 to 9<br>'                 ,['lpu','E',0,9,1]],
  [3,' for F=0 to A<br>'                ,['lpu','F',0,'A']],
  [4,'  B[1,F]=1:'                      ,['mov','w','B',1,'F',1]], 
  [5,'C[1,F]=1<br>'                   ,['mov','w','C',1,'F',1]], 
  [6,' next<br>'                        ,['lpo']],
  [7,' for G=1 to 0 step -1<br>'        ,['lpu','G',1,0,-1]],
  [8,'  A=A*A<br>'                      ,['mov','A','*','A','A']],
  [9,'  for H=0 to G<br>'               ,['lpu','H',0,'G']],
  [10,'   for I=0 to F<br>'             ,['lpu','H',0,'G']],
  [11,'    if '                         ,['nop']],
  [12,'B[G-H,I]'                        ,['mov','X','r','B','-','G','H','I']],
  [15,'&lt;'                            ,['mov','X','<','X','Y']],
  [13,'B[G,I]'                          ,['mov','Y','r','B','G','I']],
  [14,'-D[I] '                          ,['mov','X','-','Y','r','D','I',0]],
  [17,'| '                               ,['mov','X','|','X','Y']],
  [16,'B[G,1]=0 '                        ,['mov','Y','==','r','B','G',1,0]],
  [18,'then<br>'                        ,['cnj','X',19,28]],
  [19,'     if '                        ,['nop']],
  [20,'B[G,I+1]=0 '                     ,['mov','w','B','G','+','I',1,0]],
  [21,'then'                            ,['cnj','X',22,25]],
  [22,' I=F:'                           ,['mov','I','F']],
  [23,'J=H:'                            ,['mov','J','H']],
  [24,'H=G '                            ,['mov','H','G']],
  [25,'else '                            ,['jmp',27]],
  [26,'D[I]=B[G,I]-B[G-H,I]<br>'       ,['mov','w','D','I',0,'-','r','B','G','I','r','B','-','G','H','I']],
  [27,'    else<br>'                    ,['jmp',29]],
  [28,'     I=F<br>'                    ,['mov','I','F']],
  [29,'    endif<br>'                   ,['nop']],
  [30,'   next<br>'                     ,['lpo']],
  [31,'  next<br>'                      ,['lpo']],
  [32,'  for K=1 to J<br>'              ,['lpu','K',1,'J']],
  [33,'   for L=K to 0 step -1<br>'     ,['lpu','H',0,'G']],
  [34,'    if '                         ,['nop']],
  [35,'B[G-J+L,0]'                      ,['mov','X','r','B','+','-','G','J','L',0]],
  [37,'&lt;'                            ,['mov','X','X','Y']],
  [36,'B[G-J+K,0] ' ,                    ,['mov','Y','r','B','+','-','G','J','K',0]],
  [38,'then<br>'                        ,['cnj','X',39,52]],
  [39,'     for M=0 to F<br>'           ,['lpu','M',0,'F']],
  [40,'      if '                       ,['nop']],
  [41,'B[G-J,M]'                        ,['mov','X','r','B','-','G','J','M']],
  [43,'<lt;'                            ,['mov','X','<','X','Y']],
  [42,'B[G-J+K,M] ',                    ,['mov','Y','r','B','-','+','G','J','K']],
  [45,'&amp;'                           ,['mov','X','&','X','Y']],
  [44,'C[L+1,M]=1'                      ,['mov','w','C','+','L',1,'M',1]],
  [46,' then'                           ,['cnj',47,50]],
  [47,'C[K+1,M]=1 '                      ,['mov','w','C','+','K',1,'M',1]],
  [48,'else '                            ,['jmp',50]],
  [49,'C[K+1,M]=0<br>'                  ,['mov','w','C','+','K',1,'M',0]],
  [50,'     next<br>'                   ,['lpo']],
  [51,'     L=0<br>'                    ,['mov','L',0]],
  [52,'    endif<br>'                   ,['nop']],
  [53,'   next<br>'                     ,['lpo']],
  [54,'  next<br>'                      ,['lpo']],
  [55,'  for N=1 to A<br>'              ,['lpu','N',1,'A']],
  [56,'   for O=1 to J<br>'             ,['lpu','O',1,'K']],
  [57,'    for P=0 to F<br>'            ,['lpu','P',0,'F']],
  [58,'     B[G,P]=B[G-J,P]<br>'        ,['mov','w','B','G','P','r','B','-','G','J','P']],
  [59,'     if'                         ,['nop']],
  [60,' C[O,P]=1'                       ,['mov','X','==','r','C','O','P',1]],
  [61,' then '                           ,['cnj','X',62,63]],
  [62,'B[G,P]=B[G,P]+D[P]<br>'          ,['mov','w','B','G','P','+','r','G','P','r','D',0]],
  [63,'    next<br>'                    ,['lpo']],
  [64,'    G=G+1<br>'                   ,['mov','G','+','G',1]],
  [65,'   next<br>'                     ,['lpo']],
  [66,'  next<br>'                      ,['lpo']],
  [67,'  for Q=1 to F<br>'              ,['lpu','Q',1,'F']],
  [68,'   D[Q]=0<br>'                   ,['mov','w','Q',0,0]],
  [69,'  next<br>'                      ,['lpo']],
  [70,' next<br>'                       ,['lpo']],
  [71,'next<br>'                        ,['lpo']],
  [72,'print A<br>'                     ,['prn','A']]
];
var cmds=list.length;

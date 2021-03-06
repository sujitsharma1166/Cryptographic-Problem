



	//output should be::ddaf35a193617abacc417349ae20413112e6fa4e89a97ea20a9eeee64b55d39a2192992a274fc1a836ba3c23a3feebbd454d4423643ce80e2a9ac94fa54ca49f
	const object= {
        Zeros: '0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
        H: [
       '6a09e667f3bcc908', 'bb67ae8584caa73b', '3c6ef372fe94f82b', 'a54ff53a5f1d36f1',
       '510e527fade682d1', '9b05688c2b3e6c1f', '1f83d9abfb41bd6b', '5be0cd19137e2179'
           ],
    };
       
   class GeneralConversion
   {
       str2Binary(str)
       {
           //console.log(str);
          // document.write(str.charCodeAt(1));
          
           var binaryForm="";
           for (let i=0; i< str.length; i++)
           {   let Ascii = str.charCodeAt(i);
               var binary =str.toString(2);//to find binary value of character
               var msbPos = Math.floor(Math.log2(Ascii));//to find position of MSB
               var msbapend=8-msbPos-1;//append 0 at msb of binary value to make all value of 8 bit
               var NoOfZeros="";
               while(msbapend>0)
               {
                   NoOfZeros = NoOfZeros + '0';
                   msbapend--;
               }
               NoOfZeros= (NoOfZeros + Ascii.toString(2));//Actual 8 bit Ascii values
               //document.write(NoOfZeros.length);
                       binaryForm = binaryForm + NoOfZeros;
           }
           //document.write("<br>" + binaryForm + " => " + binaryForm.length)//  "<br><br>");
           return binaryForm;
           
       }
       paddingBits(str, n)
       {	
           return (str + object.Zeros.substring(0,n));
       }
       appendLength(messageBlock, originalLength)
       {
           var bitsLength = (originalLength * 8).toString(2);
           let requiredBit= 128 - bitsLength.length;
           let Zero = object.Zeros.substring(0,requiredBit); 
           return (messageBlock + Zero + bitsLength);//now 128 bits message length is added
       }
   }
 
   
   class MessageSpliter extends GeneralConversion
   {
        //constructor(){}
       // {
       // 	this.message = "abc";
       // }
       constructor(plaintext)
       {   super();
            console.log(plaintext+ '444444444444444444');
            //console.log("Plaintext",plaintext)
           //This sujit is a companion to the SHA-256 script (where there’s more explanation). This is a reference implementation, as close as possible to the NIST specification, to help in understanding the algorithm (section numbers relate the code back to sections in the standard); it is not at all optimised (using Chrome on a low-to-middling Core i5 PC, in timing tests this script will hash a short message in around 0.4 – 0.6 ms; longer messages will be hashed at a speed of around 0.5 – 1 MB/sec.As SHA-512 is based on 64-bit unsigned integers, which are not natively supported by JavaScript, this is more complex to implement in JavaScript than SHA-256. Here I’ve implemented a Long library for UInt64 operations; there would be more efficient means of doing this for an optimised implementation.Note that these scripts are intended to assist in studying the algorithms, not for production use. For production use, I would recommend the Web Cryptography API for the browser (see example), or the crypto library in Node.js. For password hashing, I have a WebCrypto example using PBKDF2.";
           let message= plaintext; 
           var binaryMessage = super.str2Binary(message);
           var n =Math.ceil(binaryMessage.length / 896);//since block size is 896+128=1024
   //document.write(binaryMessage + "<br><br>" + binaryMessage.length);
   //console.log(binaryMessage)
           var messageBlocks = new Array(n);
           let blockSize= 896; //blocksize before adding padding and extra bit 
           for ( var i = 0; i < n; i++)
           {
               //let temp =(binaryMessage.substring(i*blockSize,(i+1)*blockSize));
               let temp = (binaryMessage.substring(0,24));
               messageBlocks[i] = temp;
       //document.write("<br> Block "+ temp[894] + " ::  " + messageBlocks[i] + " => " + messageBlocks[i].length);
           }
           if (messageBlocks[n-1].length < 896	)
           {
               let pade = 896 - (messageBlocks[n-1].length)-1;
               messageBlocks[n-1] += '1'; //padding is done by appending 1 and necessary number of zeros
               messageBlocks[n-1]=super.paddingBits(messageBlocks[n-1], pade);//to pade bits to make 896bit of message block for last block only
   //document.write("<br> Block "+ n + " ::  " + messageBlocks[n-1] + " => " + messageBlocks[n-1].length);
           }
           //adding original messsage length for each blocks by 128 bit representation
           for(var i = 0; i< n; i++)
           {
               messageBlocks[i] = super.appendLength(messageBlocks[i],message.length);
   //document.write("Message block " + i + " is " + messageBlocks[i] + "      : :"+ messageBlocks[i].length);
           }
           const RF = new RoundFunction(); //Object of RoundFunction Class is made here
            for(var i = 0; i< n; i++)
            {
               //document.write("passing to round function is:<br>" +messageBlocks[i] +"<br>" + messageBlocks[i].length);
                RF.round(messageBlocks[i]);
                
                
            }
               
       let messageDigest = "";
       messageDigest += object.H[0] + object.H[1] + object.H[2] + object.H[3] + object.H[4] + object.H[5] + object.H[6] +object.H[7];
       
       return Promise.resolve(messageDigest);
       }
   }

   class RoundFunction extends GeneralConversion
   {
       wt(messageBlock,W)
       {
           for( var t=0; t<=79; t++)
           {
               if(t<=15)
               {
                  
                   W[t] = (messageBlock.substring(t*64,(t+1)*64));
                   //document.write("<br>W " + t + " =>"  + W[t]);
               }
               else 
               {
                   //add('101110', '1100010');
                   //document.write("<br>W " + t + " =>"  + W[t-2] + " :" + W[t-7]);
                   // let temp1 = sigma_0_to_512(W[t-15]);
                   // let temp2 = sigma_1_to_512(W[t-2]);
                   // let temp3 = xor(temp2, W[t-7]);
                   // let temp4 = xor(temp1, W[t-16]);
                   // let temp5 = xor(temp3, temp4);
                   // W[t] = temp5;
                   W[t] = moduloAdd (moduloAdd (moduloAdd (sigma_1_to_512(W[t-2]), (W[t-7])), (sigma_0_to_512(W[t-15]))), (W[t-16]));
                   //document.write("<br>W " + t + " =>"  + W[t]);
               }
           }
           return W;
       }
   
       round(messageBlock)
       {
           //initial hash value represented in hexadecimal system
           
       
           // initialise working variables a, b, c, d, e, f, g, h with previous hash value
           let a = HTB(object.H[0]), b = HTB(object.H[1]), c = HTB(object.H[2]), d = HTB(object.H[3]), e = HTB(object.H[4]), f = HTB(object.H[5]), g = HTB(object.H[6]), h = HTB(object.H[7]);
          //document.write("<br>a:" +h +" length:" +h.length);
          // 80 constants required for encoding message in a round represented in hexadecimal system
           const K = [
           '428a2f98d728ae22', '7137449123ef65cd', 'b5c0fbcfec4d3b2f', 'e9b5dba58189dbbc',
           '3956c25bf348b538', '59f111f1b605d019', '923f82a4af194f9b', 'ab1c5ed5da6d8118',
           'd807aa98a3030242', '12835b0145706fbe', '243185be4ee4b28c', '550c7dc3d5ffb4e2',
           '72be5d74f27b896f', '80deb1fe3b1696b1', '9bdc06a725c71235', 'c19bf174cf692694',
           'e49b69c19ef14ad2', 'efbe4786384f25e3', '0fc19dc68b8cd5b5', '240ca1cc77ac9c65',
           '2de92c6f592b0275', '4a7484aa6ea6e483', '5cb0a9dcbd41fbd4', '76f988da831153b5',
           '983e5152ee66dfab', 'a831c66d2db43210', 'b00327c898fb213f', 'bf597fc7beef0ee4',
           'c6e00bf33da88fc2', 'd5a79147930aa725', '06ca6351e003826f', '142929670a0e6e70',
           '27b70a8546d22ffc', '2e1b21385c26c926', '4d2c6dfc5ac42aed', '53380d139d95b3df',
           '650a73548baf63de', '766a0abb3c77b2a8', '81c2c92e47edaee6', '92722c851482353b',
           'a2bfe8a14cf10364', 'a81a664bbc423001', 'c24b8b70d0f89791', 'c76c51a30654be30',
           'd192e819d6ef5218', 'd69906245565a910', 'f40e35855771202a', '106aa07032bbd1b8',
           '19a4c116b8d2d0c8', '1e376c085141ab53', '2748774cdf8eeb99', '34b0bcb5e19b48a8',
           '391c0cb3c5c95a63', '4ed8aa4ae3418acb', '5b9cca4f7763e373', '682e6ff3d6b2b8a3',
           '748f82ee5defb2fc', '78a5636f43172f60', '84c87814a1f0ab72', '8cc702081a6439ec',
           '90befffa23631e28', 'a4506cebde82bde9', 'bef9a3f7b2c67915', 'c67178f2e372532b',
           'ca273eceea26619c', 'd186b8c721c0c207', 'eada7dd6cde0eb1e', 'f57d4f7fee6ed178',
           '06f067aa72176fba', '0a637dc5a2c898a6', '113f9804bef90dae', '1b710b35131c471b',
           '28db77f523047d84', '32caab7b40c72493', '3c9ebe0a15c9bebc', '431d67c49c100d4c',
           '4cc5d4becb3e42b6', '597f299cfc657e2a', '5fcb6fab3ad6faec', '6c44198c4a475817',
       ]
       //document.write(messageBlock + "<br><br>");
       
           let W = new Array(80);
           W= this.wt(messageBlock,W);
       //document.write(W.length + "<br><br>");
       
   
           for (let t = 0; t <=79; t++)
           {
           var T1 = moduloAdd(moduloAdd(moduloAdd(moduloAdd(h, Ch(e,f,g)), sum_1_to_512(e)), W[t]), HTB(K[t]));
           var T2 = moduloAdd(sum_0_to_512(a), Maj(a,b,c));
               h = g;
               g = f;
               f = e;
               e = moduloAdd(d,T1);
               d = c;
               c = b;
               b = a;
               a = moduloAdd(T1,T2);
           }
               //storing intermediate hash value
               //document.write(BTH(add(HTB(object.H[0]),a)));
               object.H[0] = BTH(add(HTB(object.H[0]), a));
               object.H[1] = BTH(add(HTB(object.H[1]), b));
               object.H[2] = BTH(add(HTB(object.H[2]), c));
               object.H[3] = BTH(add(HTB(object.H[3]), d));
               object.H[4] = BTH(add(HTB(object.H[4]), e));
               object.H[5] = BTH(add(HTB(object.H[5]), f));
               object.H[6] = BTH(add(HTB(object.H[6]), g));
               object.H[7] = BTH(add(HTB(object.H[7]), h));
               //document.write("<br>" +object.H[0] + "<br> " +BTH(a));
           
       }
   }
       
       
       function Ch(e,f,g)
       {
           let temp1 = and(e, f);
           let temp2 = not(e);
           let temp3 = and(temp2, g);
           let result = xor(temp1, temp3);
           return result;
       }
       function Maj(a,b,c)
       {
           let temp1 = and(a, b);
           let temp2 = and(a, c);
           let temp3 = and (b, c);
           let result = xor(temp1,temp2);
           result = xor(result, temp3);
           return result;
           
       }
       function sum_0_to_512(a)
       {
           return(xor(xor(ROTR(28,a),ROTR(34,a)),ROTR(39,a)));
       }
       function sum_1_to_512(e)
       {
           return(xor(xor(ROTR(14,e),ROTR(18,e)),ROTR(41,e)));	
       }
       function sigma_1_to_512(x)
       {
           //document.write("sigma1_512" + x);
            return(xor (xor (ROTR(19,x), ROTR(61,x)), SHR(6,x)));
       }
       function sigma_0_to_512(x)
       {
           return(xor (xor (ROTR(1,x), ROTR(8,x)), SHR(7,x)));
       }
       function ROTR(n,x)
       { 
           'sujit'.substring(1,3);
           let unchangeValue = x.substring(64-n,64);
           
           unchangeValue = unchangeValue.split('');
           let newx = x.split('');
           //document.write("<br> unchange value is =>" +unchangeValue);
           //document.write("<br>" +newx);
           for (let i = 63; i >= n; i--)
           { 
               newx[i] = newx[i-n];
           }
           for(let i=0; i< n; i++)
           {
               newx[i]=unchangeValue[i];
           }
           let unsplit = "";
           for (let i= 0; i<=63; i++)
           {
               unsplit += newx[i];
           }
           return unsplit;
       }
       function SHR(n,x)
       {
           let unchangeValue = x.substring(64-n-1,64);
           unchangeValue = unchangeValue.split('');
           let newX= x.split('');
           for (let i = 0; i < 64-n; i++)
           { 
               newX[i] = newX[i+n];
           }
           for(let i = 64-n; i <= 63;i++)
           {
               newX[i] = '0';
           }
           
           let unsplit = "";
           for (let i= 0; i<=63; i++)
           {
               unsplit += newX[i];
           }
           return unsplit;
       }
       function add(arg1,arg2)
       {
           let result="";
           result = result.split('');
           let flag=0;
           for (let i=63; i>=0; i--)
           {
               if(arg1[i] == 0 && arg2[i] == 0)
                   {
                       
                       result[i] = (0 + flag);
                       flag = 0;
                   }
               else if (arg1[i] == 1 && arg2[i] == 1)
                   {
                       result[i] = (0+flag);
                       flag = 1;
                   }
               else {
                   result[i] = (1-flag);
                   }
           }
           let val ="";
           for (let i=0; i<= 63; i++)
           {
               val += result[i]
           }
           return val;
           
       }
       function xor(arg1,arg2)
       {
           let result ="";
           result = result.split('');
           for (let i = 0; i<= 63; i++)
           {
               
               if((arg1[i] == 0 && arg2[i] == 0)||(arg1[i] == 1 && arg2[i] == 1)){
                   result += 0;
               }
               else {
               result += 1;
               }
           }
           return result;
       }
       function and(arg1,arg2)
       {
           let result ="";
           //result = result.split('');
           for (let i = 0; i<= 63; i++)
           {
               
               if(arg1[i] == 1 && arg2[i] == 1){
                   result += 1;
               }
               else {
               result += 0;
               }
           }
           return result;
       }
       function not(arg)
       {
           let result ="";
           //result = result.split('');
           for (let i = 0; i<= 63; i++)
           {
               
               if(arg[i] == 1){
                   result += 0;
               }
               else {
               result += 1;
               }
           }
           return result;
       }
       function moduloAdd(arg1, arg2)
       {
           return (xor(arg1, arg2));
       }
       function HTB(hexa)
       {		hexa = hexa.split('');
           let i = 0;
           let binary ="";
           while (hexa[i])
           {
               switch (hexa[i])
               {
               case '0':
                   binary +="0000"; break;
               case '1':
                   binary +="0001"; break;
               case '2':
                   binary +="0010"; break;
               case '3':
                   binary +="0011"; break;
               case '4':
                   binary +="0100"; break;
               case '5':
                   binary +="0101"; break;
               case '6':
                   binary +="0110"; break;
               case '7':
                   binary +="0111"; break;
               case '8':
                   binary +="1000"; break;
               case '9':
                   binary +="1001"; break;
               case 'A':
                   binary +="1010"; break;
               case 'B':
                   binary +="1011"; break;
               case 'C':
                   binary +="1100"; break;
               case 'D':
                   binary +="1101"; break;
               case 'E':
                   binary +=+"1110"; break;
               case 'F':
                   binary +="1111"; break;
               case 'a':
                   binary +="1010"; break;
               case 'b':
                   binary +="1011"; break;
               case 'c':
                   binary +="1100"; break;
               case 'd':
                   binary +="1101"; break;
               case 'e':
                   binary +="1110"; break;
               case 'f':
                   binary +="1111"; break;
                   
               }
               i++;
           }
   return binary;
}
function BTH(bin)
{ 
   let hex ="";
   let v;
   for( let i=0;i< bin.length; i++)
       // if( i== 0);
       //    { v = 5;}
       // else {
       //     v = 4;}
   {   let temp = bin.substring(i, i+4);
       //document.write("<br> " +temp);
        switch (temp)
        {
           case '0000':
               hex +="0"; break;
           case '0001':
           hex +="1"; break;
           case '0010':
               hex +="2"; break;
           case '0011':
               hex +="3"; break;
           case '0100':
               hex +="4"; break;
           case '0101':
               hex +="5"; break;
           case '0110':
               hex +="6"; break;
           case '0111':
               hex +="7"; break;
           case '1000':
               hex +="8"; break;
           case '1001':
               hex +="9"; break;
           case '1010':
               hex +="a"; break;
           case '1011':
               hex +="b"; break;
           case '1100':
               hex +="c"; break;
           case '1101':
               hex +="d"; break;
           case '1110':
               hex +="e"; break;
           case '1111':
               hex +="f"; break;
           // default:
           //     document.write("incorrect input");
        }
       i=i+3;
   }
   return hex;
}


module.exports=MessageSpliter;

!function(){AV.Demuxer.extend(function(){AV.Demuxer.register(this),this.probe=function(a){return"fLaC"===a.peekString(0,4)};const a=0,b=3,c=4,d=6,e=34;this.prototype.readChunk=function(){var f=this.stream;if(!this.readHeader&&f.available(4)){if("fLaC"!==f.readString(4))return this.emit("error","Invalid FLAC file.");this.readHeader=!0}for(;f.available(1)&&!this.last;){if(!this.readBlockHeaders){var g=f.readUInt8();this.last=128===(128&g),this.type=127&g,this.size=f.readUInt24()}if(!this.foundStreamInfo&&this.type!==a)return this.emit("error","STREAMINFO must be the first block");if(!f.available(this.size))return;switch(this.type){case a:if(this.foundStreamInfo)return this.emit("error","STREAMINFO can only occur once.");if(this.size!==e)return this.emit("error","STREAMINFO size is wrong.");this.foundStreamInfo=!0;var h=new AV.Bitstream(f),i={minBlockSize:h.read(16),maxBlockSize:h.read(16),minFrameSize:h.read(24),maxFrameSize:h.read(24)};this.format={formatID:"flac",sampleRate:h.read(20),channelsPerFrame:h.read(3)+1,bitsPerChannel:h.read(5)+1},this.emit("format",this.format),this.emit("cookie",i);var j=h.read(36);this.emit("duration",j/this.format.sampleRate*1e3|0),f.advance(16),this.readBlockHeaders=!1;break;case b:for(var k=0;k<this.size/18;k++)if(4294967295==f.peekUInt32(0)&&4294967295==f.peekUInt32(1))f.advance(18);else{f.readUInt32()>0&&this.emit("error","Seek points with sample number >UInt32 not supported");var l=f.readUInt32();f.readUInt32()>0&&this.emit("error","Seek points with stream offset >UInt32 not supported");var m=f.readUInt32();f.advance(2),this.addSeekPoint(m,l)}break;case c:this.metadata||(this.metadata={});var n=f.readUInt32(!0);this.metadata.vendor=f.readString(n);for(var o=f.readUInt32(!0),p=0;o>p;p++){n=f.readUInt32(!0);var q=f.readString(n,"utf8"),r=q.indexOf("=");this.metadata[q.slice(0,r).toLowerCase()]=q.slice(r+1)}break;case d:var s=f.readUInt32();if(3!==s)f.advance(this.size-4);else{var t=f.readUInt32(),u=(f.readString(t),f.readUInt32()),o=(f.readString(u),f.readUInt32(),f.readUInt32(),f.readUInt32(),f.readUInt32(),f.readUInt32()),v=f.readBuffer(o);this.metadata||(this.metadata={}),this.metadata.coverArt=v}break;default:f.advance(this.size),this.readBlockHeaders=!1}this.last&&this.metadata&&this.emit("metadata",this.metadata)}for(;f.available(1)&&this.last;){var w=f.readSingleBuffer(f.remainingBytes());this.emit("data",w)}}}),AV.Decoder.extend(function(){function a(a){for(var b=0,c=0;;){if(c=a>>>24)break;if(b+=8,c=a>>>16,255&c)break;if(b+=8,c=a>>>8,255&c)break;if(b+=8,c=a,255&c)break;return b+=8}return 240&c?c>>>=4:b+=4,8&c?b:4&c?b+1:2&c?b+2:1&c?b+3:b+4}AV.Decoder.register("flac",this),this.prototype.setCookie=function(a){this.cookie=a,this.decoded=[];for(var b=0;b<this.format.channelsPerFrame;b++)this.decoded[b]=new Int32Array(a.maxBlockSize)};const b=new Int16Array([0,192,576,1152,2304,4608,0,0,256,512,1024,2048,4096,8192,16384,32768]),c=new Int32Array([0,88200,176400,192e3,8e3,16e3,22050,24e3,32e3,44100,48e3,96e3,0,0,0,0]),d=new Int8Array([0,8,12,0,16,20,24,0]),e=8,f=0,g=8,h=9,i=10;this.prototype.readChunk=function(){var a=this.bitstream;if(a.available(32)){if(32764!==(32767&a.read(15)))throw new Error("Invalid sync code");var j=(a.read(1),a.read(4)),k=a.read(4),l=a.read(4),m=a.read(3);a.advance(1),this.chMode=l;var n;if(e>l)n=l+1,this.chMode=f;else{if(!(i>=l))throw new Error("Invalid channel mode");n=2}if(n!==this.format.channelsPerFrame)throw new Error("Switching channel layout mid-stream not supported.");if(3===m||7===m)throw new Error("Invalid sample size code");if(this.bps=d[m],this.bps!==this.format.bitsPerChannel)throw new Error("Switching bits per sample mid-stream not supported.");var o,p;this.bps>16?(o=32-this.bps,p=!0):(o=16-this.bps,p=!1);for(var q=0;1===a.read(1);)q++;for(var r=a.read(7-q);q>1;q--)a.advance(2),r=r<<6|a.read(6);if(0===j)throw new Error("Reserved blocksize code");6===j?this.blockSize=a.read(8)+1:7===j?this.blockSize=a.read(16)+1:this.blockSize=b[j];var s;if(12>k)s=c[k];else if(12===k)s=1e3*a.read(8);else if(13===k)s=a.read(16);else{if(14!==k)throw new Error("Invalid sample rate code");s=10*a.read(16)}a.advance(8);for(var t=0;n>t;t++)this.decodeSubframe(t);a.align(),a.advance(16);var u=new ArrayBuffer(this.blockSize*n*this.bps/8),v=p?new Int32Array(u):new Int16Array(u),w=this.blockSize,x=this.decoded,y=0;switch(this.chMode){case f:for(var z=0;w>z;z++)for(var t=0;n>t;t++)v[y++]=x[t][z]<<o;break;case g:for(var t=0;w>t;t++){var A=x[0][t],B=x[1][t];v[y++]=A<<o,v[y++]=A-B<<o}break;case h:for(var t=0;w>t;t++){var A=x[0][t],B=x[1][t];v[y++]=A+B<<o,v[y++]=B<<o}break;case i:for(var t=0;w>t;t++){var A=x[0][t],B=x[1][t];A-=B>>1,v[y++]=A+B<<o,v[y++]=A<<o}}return v}},this.prototype.decodeSubframe=function(a){var b=0,c=this.bitstream,d=this.blockSize,e=this.decoded;if(this.curr_bps=this.bps,0===a?this.chMode===h&&this.curr_bps++:(this.chMode===g||this.chMode===i)&&this.curr_bps++,c.read(1))throw new Error("Invalid subframe padding");var f=c.read(6);if(c.read(1)){for(b=1;!c.read(1);)b++;this.curr_bps-=b}if(this.curr_bps>32)throw new Error("decorrelated bit depth > 32 ("+this.curr_bps+")");if(0===f)for(var j=c.read(this.curr_bps,!0),k=0;d>k;k++)e[a][k]=j;else if(1===f)for(var l=this.curr_bps,k=0;d>k;k++)e[a][k]=c.read(l,!0);else if(f>=8&&12>=f)this.decode_subframe_fixed(a,-9&f);else{if(!(f>=32))throw new Error("Invalid coding type");this.decode_subframe_lpc(a,(-33&f)+1)}if(b)for(var k=0;d>k;k++)e[a][k]<<=b},this.prototype.decode_subframe_fixed=function(a,b){for(var c=this.decoded[a],d=this.bitstream,e=this.curr_bps,f=0;b>f;f++)c[f]=d.read(e,!0);this.decode_residuals(a,b);var g=0,h=0,i=0,j=0;switch(b>0&&(g=c[b-1]),b>1&&(h=g-c[b-2]),b>2&&(i=h-c[b-2]+c[b-3]),b>3&&(j=i-c[b-2]+2*c[b-3]-c[b-4]),b){case 0:break;case 1:case 2:case 3:case 4:for(var k=new Int32Array([g,h,i,j]),l=this.blockSize,f=b;l>f;f++){k[b-1]+=c[f];for(var m=b-2;m>=0;m--)k[m]+=k[m+1];c[f]=k[0]}break;default:throw new Error("Invalid Predictor Order "+b)}},this.prototype.decode_subframe_lpc=function(a,b){for(var c=this.bitstream,d=this.decoded[a],e=this.curr_bps,f=this.blockSize,g=0;b>g;g++)d[g]=c.read(e,!0);var h=c.read(4)+1;if(16===h)throw new Error("Invalid coefficient precision");var i=c.read(5,!0);if(0>i)throw new Error("Negative qlevel, maybe buggy stream");for(var j=new Int32Array(32),g=0;b>g;g++)j[g]=c.read(h,!0);if(this.decode_residuals(a,b),this.bps>16)throw new Error("no 64-bit integers in JS, could probably use doubles though");for(var g=b;f-1>g;g+=2){for(var k,l=d[g-b],m=0,n=0,o=b-1;o>0;o--)k=j[o],m+=k*l,l=d[g-o],n+=k*l;k=j[0],m+=k*l,l=d[g]+=m>>i,n+=k*l,d[g+1]+=n>>i}if(f>g){for(var p=0,o=0;b>o;o++)p+=j[o]*d[g-o-1];d[g]+=p>>i}};const j=32767;this.prototype.decode_residuals=function(a,b){var c=this.bitstream,d=c.read(2);if(d>1)throw new Error("Illegal residual coding method "+d);var e=c.read(4),f=this.blockSize>>>e;if(b>f)throw new Error("Invalid predictor order "+b+" > "+f);for(var g=this.decoded[a],h=b,i=b,k=0;1<<e>k;k++){var l=c.read(0===d?4:5);if(l===(0===d?15:31))for(l=c.read(5);f>i;i++)g[h++]=c.read(l,!0);else for(;f>i;i++)g[h++]=this.golomb(l,j,0);i=0}};this.prototype.golomb=function(b,c,d){var e=this.bitstream,f=e.bitPosition,g=e.peek(32-f)<<f,h=0,i=31-a(1|g);if(i-b>=7&&c>32-i)g>>>=i-b,g+=30-i<<b,e.advance(32+b-i),h=g;else{for(var j=0;0===e.read(1);j++)g=e.peek(32-f)<<f;c-1>j?(g=b?e.read(b):0,h=g+(j<<b)):j===c-1?(g=e.read(d),h=g+1):h=-1}return h>>1^-(1&h)}})}();
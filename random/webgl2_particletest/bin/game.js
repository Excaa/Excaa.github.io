// Generated by Haxe 3.4.0
(function ($hx_exports, $global) { "use strict";
var $estr = function() { return js_Boot.__string_rec(this,''); };
function $extend(from, fields) {
	function Inherit() {} Inherit.prototype = from; var proto = new Inherit();
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var GLUtil = function() {
};
GLUtil.__name__ = true;
GLUtil.createShader = function(gl,source,type) {
	var shader = gl.createShader(type);
	gl.shaderSource(shader,source);
	gl.compileShader(shader);
	return shader;
};
GLUtil.createProgram = function(gl,vertex,fragment,varyings,feedbackType) {
	var vert = GLUtil.createShader(gl,vertex,35633);
	var frag = GLUtil.createShader(gl,fragment,35632);
	var program = gl.createProgram();
	gl.attachShader(program,vert);
	gl.attachShader(program,frag);
	gl.deleteShader(vert);
	gl.deleteShader(frag);
	if(varyings != null && varyings.length > 0) {
		gl.transformFeedbackVaryings(program,varyings,feedbackType);
	}
	gl.linkProgram(program);
	var failed = false;
	var log = gl.getProgramInfoLog(program);
	if(log.length > 0) {
		console.log("---Webgl program error---");
		console.log(log);
		failed = true;
	}
	log = gl.getShaderInfoLog(vert);
	if(log.length > 0) {
		console.log("---webgl shader error---");
		console.log(log);
		failed = true;
	}
	log = gl.getShaderInfoLog(frag);
	if(log.length > 0) {
		console.log("---webgl shader error---");
		console.log(log);
		failed = true;
	}
	if(failed) {
		gl.deleteProgram(program);
		return null;
	}
	return program;
};
GLUtil.createBufferFromArray = function(gl,data,type) {
	var buffer = gl.createBuffer();
	gl.bindBuffer(34962,buffer);
	gl.bufferData(34962,data,type);
	gl.bindBuffer(34962,null);
	return buffer;
};
GLUtil.createBufferWithSize = function(gl,size,type) {
	var buffer = gl.createBuffer();
	gl.bindBuffer(34962,buffer);
	gl.bufferData(34962,size,type);
	gl.bindBuffer(34962,null);
	return buffer;
};
GLUtil.createVAO = function(gl,buffers) {
	var vao = gl.createVertexArray();
	gl.bindVertexArray(vao);
	var _g = 0;
	while(_g < buffers.length) {
		var buffer = buffers[_g];
		++_g;
		gl.bindBuffer(34962,buffer.data);
		gl.enableVertexAttribArray(buffer.location);
		gl.vertexAttribPointer(buffer.location,buffer.elementSize,5126,false,0,0);
	}
	gl.bindBuffer(34962,null);
	gl.bindVertexArray(null);
	return vao;
};
GLUtil.prototype = {
	__class__: GLUtil
};
var HxOverrides = function() { };
HxOverrides.__name__ = true;
HxOverrides.cca = function(s,index) {
	var x = s.charCodeAt(index);
	if(x != x) {
		return undefined;
	}
	return x;
};
HxOverrides.substr = function(s,pos,len) {
	if(len == null) {
		len = s.length;
	} else if(len < 0) {
		if(pos == 0) {
			len = s.length + len;
		} else {
			return "";
		}
	}
	return s.substr(pos,len);
};
var Main = $hx_exports["Main"] = function() {
	this.currentIndex = 0;
	this.displayVAO = [];
	this.feedbackVAO = [];
	this.mousePoint = { x : 0, y : 0};
	var _gthis = this;
	if(window.location.hash.length > 0) {
		var p = Std.parseInt(HxOverrides.substr(window.location.hash,1,null));
		if(typeof(p) == "number" && ((p | 0) === p)) {
			Main.points = p;
		}
	}
	Main.instance = this;
	this.initRenderer();
	this.initializeControls();
	this.resize();
	window.addEventListener("resize",$bind(this,this.resize));
	this.canvas.addEventListener("mousemove",function(event) {
		_gthis.mousePoint.x = event.clientX / _gthis.canvas.width * 2 - 1;
		_gthis.mousePoint.y = (event.clientY / _gthis.canvas.height * 2 - 1) * -1;
	});
	this.ontick(0);
};
Main.__name__ = true;
Main.main = function() {
};
Main.prototype = {
	initRenderer: function() {
		this.canvas = window.document.getElementById("game");
		this.gl = this.canvas.getContext("webgl2",{ antialias : false});
		if(this.gl == null) {
			window.alert("No webgl2 support");
		}
		this.gl.enable(3042);
		this.gl.blendFunc(1,771);
	}
	,resize: function() {
		var w = window.innerWidth;
		var h = window.innerHeight;
		if(w > h * 1.7777777777777777) {
			w = Math.round(h * 1.7777777777777777);
		}
		if(h * 1.7777777777777777 > w) {
			h = Math.round(w / 1.7777777777777777);
		}
		this.canvas.width = w;
		this.canvas.height = h;
		this.gl.viewport(0,0,w,h);
	}
	,initializeControls: function() {
		this.vertices = new Float32Array(Main.points * 2);
		this.velocities = new Float32Array(Main.points * 2);
		this.indices = new Float32Array(Main.points * 2);
		var _g1 = 0;
		var _g = this.vertices.length;
		while(_g1 < _g) {
			var i = _g1++;
			this.vertices[i] = Math.random() * 2 - 1;
			this.velocities[i] = 0;
			this.indices[i] = i;
		}
		this.vertexBuffers = [GLUtil.createBufferFromArray(this.gl,this.vertices,35044),GLUtil.createBufferWithSize(this.gl,Main.points * 2 * 4,35044)];
		this.velocityBuffers = [GLUtil.createBufferFromArray(this.gl,this.velocities,35044),GLUtil.createBufferWithSize(this.gl,Main.points * 2 * 4,35044)];
		this.indexBuffers = [GLUtil.createBufferFromArray(this.gl,this.indices,35044),GLUtil.createBufferWithSize(this.gl,Main.points * 2 * 4,35044)];
		this.feedbackProgram = GLUtil.createProgram(this.gl,haxe_Resource.getString("calc.vert"),haxe_Resource.getString("empty.frag"),["v_position","v_velocity"],this.gl.SEPARATE_ATTRIBS);
		this.displayProgram = GLUtil.createProgram(this.gl,haxe_Resource.getString("display.vert"),haxe_Resource.getString("display.frag"),null,null);
		this.feedbackVAO.push(GLUtil.createVAO(this.gl,[{ data : this.vertexBuffers[0], location : 0, elementSize : 2},{ data : this.velocityBuffers[0], location : 1, elementSize : 2},{ data : this.indexBuffers[0], location : 2, elementSize : 2}]));
		this.feedbackVAO.push(GLUtil.createVAO(this.gl,[{ data : this.vertexBuffers[1], location : 0, elementSize : 2},{ data : this.velocityBuffers[1], location : 1, elementSize : 2},{ data : this.indexBuffers[0], location : 2, elementSize : 2}]));
		this.displayVAO.push(GLUtil.createVAO(this.gl,[{ data : this.vertexBuffers[0], location : 0, elementSize : 2},{ data : this.velocityBuffers[0], location : 1, elementSize : 2}]));
		this.displayVAO.push(GLUtil.createVAO(this.gl,[{ data : this.vertexBuffers[1], location : 0, elementSize : 2},{ data : this.velocityBuffers[1], location : 1, elementSize : 2}]));
		this.transformFeedback = this.gl.createTransformFeedback();
		this.mouseLocation = this.gl.getUniformLocation(this.feedbackProgram,"u_mouse");
		this.timeLocation = this.gl.getUniformLocation(this.feedbackProgram,"time");
	}
	,draw: function(vao) {
		this.gl.bindVertexArray(vao);
		this.gl.drawArrays(0,0,Main.points);
	}
	,calculateFeedback: function(currentIndex,time) {
		var invertedIndex = (currentIndex + 1) % 2;
		this.gl.enable(this.gl.RASTERIZER_DISCARD);
		this.gl.bindTransformFeedback(this.gl.TRANSFORM_FEEDBACK,this.transformFeedback);
		this.gl.bindBufferBase(this.gl.TRANSFORM_FEEDBACK_BUFFER,0,this.vertexBuffers[invertedIndex]);
		this.gl.bindBufferBase(this.gl.TRANSFORM_FEEDBACK_BUFFER,1,this.velocityBuffers[invertedIndex]);
		this.gl.useProgram(this.feedbackProgram);
		this.gl.uniform2fv(this.mouseLocation,[this.mousePoint.x,this.mousePoint.y]);
		this.gl.uniform1f(this.timeLocation,time);
		this.gl.beginTransformFeedback(0);
		this.draw(this.feedbackVAO[currentIndex]);
		this.gl.endTransformFeedback();
		this.gl.disable(this.gl.RASTERIZER_DISCARD);
		this.gl.bindBufferBase(this.gl.TRANSFORM_FEEDBACK_BUFFER,0,null);
		this.gl.bindBufferBase(this.gl.TRANSFORM_FEEDBACK_BUFFER,1,null);
	}
	,ontick: function(t) {
		var invertedIndex = (this.currentIndex + 1) % 2;
		this.gl.clearColor(0.0,0.0,0.0,1.0);
		this.gl.clear(16384);
		this.calculateFeedback(this.currentIndex,t * 0.01);
		this.gl.useProgram(this.displayProgram);
		this.draw(this.displayVAO[invertedIndex]);
		this.currentIndex = (this.currentIndex + 1) % 2;
		window.requestAnimationFrame($bind(this,this.ontick));
	}
	,__class__: Main
};
Math.__name__ = true;
var Std = function() { };
Std.__name__ = true;
Std.string = function(s) {
	return js_Boot.__string_rec(s,"");
};
Std.parseInt = function(x) {
	var v = parseInt(x,10);
	if(v == 0 && (HxOverrides.cca(x,1) == 120 || HxOverrides.cca(x,1) == 88)) {
		v = parseInt(x);
	}
	if(isNaN(v)) {
		return null;
	}
	return v;
};
var haxe_Resource = function() { };
haxe_Resource.__name__ = true;
haxe_Resource.getString = function(name) {
	var _g = 0;
	var _g1 = haxe_Resource.content;
	while(_g < _g1.length) {
		var x = _g1[_g];
		++_g;
		if(x.name == name) {
			if(x.str != null) {
				return x.str;
			}
			return haxe_crypto_Base64.decode(x.data).toString();
		}
	}
	return null;
};
var haxe_io_Bytes = function(data) {
	this.length = data.byteLength;
	this.b = new Uint8Array(data);
	this.b.bufferValue = data;
	data.hxBytes = this;
	data.bytes = this.b;
};
haxe_io_Bytes.__name__ = true;
haxe_io_Bytes.ofString = function(s) {
	var a = [];
	var i = 0;
	while(i < s.length) {
		var c = s.charCodeAt(i++);
		if(55296 <= c && c <= 56319) {
			c = c - 55232 << 10 | s.charCodeAt(i++) & 1023;
		}
		if(c <= 127) {
			a.push(c);
		} else if(c <= 2047) {
			a.push(192 | c >> 6);
			a.push(128 | c & 63);
		} else if(c <= 65535) {
			a.push(224 | c >> 12);
			a.push(128 | c >> 6 & 63);
			a.push(128 | c & 63);
		} else {
			a.push(240 | c >> 18);
			a.push(128 | c >> 12 & 63);
			a.push(128 | c >> 6 & 63);
			a.push(128 | c & 63);
		}
	}
	return new haxe_io_Bytes(new Uint8Array(a).buffer);
};
haxe_io_Bytes.prototype = {
	getString: function(pos,len) {
		if(pos < 0 || len < 0 || pos + len > this.length) {
			throw new js__$Boot_HaxeError(haxe_io_Error.OutsideBounds);
		}
		var s = "";
		var b = this.b;
		var fcc = String.fromCharCode;
		var i = pos;
		var max = pos + len;
		while(i < max) {
			var c = b[i++];
			if(c < 128) {
				if(c == 0) {
					break;
				}
				s += fcc(c);
			} else if(c < 224) {
				s += fcc((c & 63) << 6 | b[i++] & 127);
			} else if(c < 240) {
				s += fcc((c & 31) << 12 | (b[i++] & 127) << 6 | b[i++] & 127);
			} else {
				var u = (c & 15) << 18 | (b[i++] & 127) << 12 | (b[i++] & 127) << 6 | b[i++] & 127;
				s += fcc((u >> 10) + 55232);
				s += fcc(u & 1023 | 56320);
			}
		}
		return s;
	}
	,toString: function() {
		return this.getString(0,this.length);
	}
	,__class__: haxe_io_Bytes
};
var haxe_crypto_Base64 = function() { };
haxe_crypto_Base64.__name__ = true;
haxe_crypto_Base64.decode = function(str,complement) {
	if(complement == null) {
		complement = true;
	}
	if(complement) {
		while(HxOverrides.cca(str,str.length - 1) == 61) str = HxOverrides.substr(str,0,-1);
	}
	return new haxe_crypto_BaseCode(haxe_crypto_Base64.BYTES).decodeBytes(haxe_io_Bytes.ofString(str));
};
var haxe_crypto_BaseCode = function(base) {
	var len = base.length;
	var nbits = 1;
	while(len > 1 << nbits) ++nbits;
	if(nbits > 8 || len != 1 << nbits) {
		throw new js__$Boot_HaxeError("BaseCode : base length must be a power of two.");
	}
	this.base = base;
	this.nbits = nbits;
};
haxe_crypto_BaseCode.__name__ = true;
haxe_crypto_BaseCode.prototype = {
	initTable: function() {
		var tbl = [];
		var _g = 0;
		while(_g < 256) tbl[_g++] = -1;
		var _g1 = 0;
		var _g2 = this.base.length;
		while(_g1 < _g2) {
			var i = _g1++;
			tbl[this.base.b[i]] = i;
		}
		this.tbl = tbl;
	}
	,decodeBytes: function(b) {
		var nbits = this.nbits;
		if(this.tbl == null) {
			this.initTable();
		}
		var tbl = this.tbl;
		var size = b.length * nbits >> 3;
		var out = new haxe_io_Bytes(new ArrayBuffer(size));
		var buf = 0;
		var curbits = 0;
		var pin = 0;
		var pout = 0;
		while(pout < size) {
			while(curbits < 8) {
				curbits += nbits;
				buf <<= nbits;
				var i = tbl[b.b[pin++]];
				if(i == -1) {
					throw new js__$Boot_HaxeError("BaseCode : invalid encoded char");
				}
				buf |= i;
			}
			curbits -= 8;
			out.b[pout++] = buf >> curbits & 255 & 255;
		}
		return out;
	}
	,__class__: haxe_crypto_BaseCode
};
var haxe_io_Error = { __ename__ : true, __constructs__ : ["Blocked","Overflow","OutsideBounds","Custom"] };
haxe_io_Error.Blocked = ["Blocked",0];
haxe_io_Error.Blocked.toString = $estr;
haxe_io_Error.Blocked.__enum__ = haxe_io_Error;
haxe_io_Error.Overflow = ["Overflow",1];
haxe_io_Error.Overflow.toString = $estr;
haxe_io_Error.Overflow.__enum__ = haxe_io_Error;
haxe_io_Error.OutsideBounds = ["OutsideBounds",2];
haxe_io_Error.OutsideBounds.toString = $estr;
haxe_io_Error.OutsideBounds.__enum__ = haxe_io_Error;
haxe_io_Error.Custom = function(e) { var $x = ["Custom",3,e]; $x.__enum__ = haxe_io_Error; $x.toString = $estr; return $x; };
var haxe_io_FPHelper = function() { };
haxe_io_FPHelper.__name__ = true;
haxe_io_FPHelper.i32ToFloat = function(i) {
	var exp = i >>> 23 & 255;
	var sig = i & 8388607;
	if(sig == 0 && exp == 0) {
		return 0.0;
	}
	return (1 - (i >>> 31 << 1)) * (1 + Math.pow(2,-23) * sig) * Math.pow(2,exp - 127);
};
haxe_io_FPHelper.floatToI32 = function(f) {
	if(f == 0) {
		return 0;
	}
	var af = f < 0 ? -f : f;
	var exp = Math.floor(Math.log(af) / 0.6931471805599453);
	if(exp < -127) {
		exp = -127;
	} else if(exp > 128) {
		exp = 128;
	}
	var sig = Math.round((af / Math.pow(2,exp) - 1) * 8388608);
	if(sig == 8388608 && exp < 128) {
		sig = 0;
		++exp;
	}
	return (f < 0 ? -2147483648 : 0) | exp + 127 << 23 | sig;
};
var js__$Boot_HaxeError = function(val) {
	Error.call(this);
	this.val = val;
	this.message = String(val);
	if(Error.captureStackTrace) {
		Error.captureStackTrace(this,js__$Boot_HaxeError);
	}
};
js__$Boot_HaxeError.__name__ = true;
js__$Boot_HaxeError.wrap = function(val) {
	if((val instanceof Error)) {
		return val;
	} else {
		return new js__$Boot_HaxeError(val);
	}
};
js__$Boot_HaxeError.__super__ = Error;
js__$Boot_HaxeError.prototype = $extend(Error.prototype,{
	__class__: js__$Boot_HaxeError
});
var js_Boot = function() { };
js_Boot.__name__ = true;
js_Boot.getClass = function(o) {
	if((o instanceof Array) && o.__enum__ == null) {
		return Array;
	} else {
		var cl = o.__class__;
		if(cl != null) {
			return cl;
		}
		var name = js_Boot.__nativeClassName(o);
		if(name != null) {
			return js_Boot.__resolveNativeClass(name);
		}
		return null;
	}
};
js_Boot.__string_rec = function(o,s) {
	if(o == null) {
		return "null";
	}
	if(s.length >= 5) {
		return "<...>";
	}
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) {
		t = "object";
	}
	switch(t) {
	case "function":
		return "<function>";
	case "object":
		if(o instanceof Array) {
			if(o.__enum__) {
				if(o.length == 2) {
					return o[0];
				}
				var str = o[0] + "(";
				s += "\t";
				var _g1 = 2;
				var _g = o.length;
				while(_g1 < _g) {
					var i = _g1++;
					if(i != 2) {
						str += "," + js_Boot.__string_rec(o[i],s);
					} else {
						str += js_Boot.__string_rec(o[i],s);
					}
				}
				return str + ")";
			}
			var l = o.length;
			var i1;
			var str1 = "[";
			s += "\t";
			var _g11 = 0;
			var _g2 = l;
			while(_g11 < _g2) {
				var i2 = _g11++;
				str1 += (i2 > 0 ? "," : "") + js_Boot.__string_rec(o[i2],s);
			}
			str1 += "]";
			return str1;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e ) {
			return "???";
		}
		if(tostr != null && tostr != Object.toString && typeof(tostr) == "function") {
			var s2 = o.toString();
			if(s2 != "[object Object]") {
				return s2;
			}
		}
		var k = null;
		var str2 = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) {
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str2.length != 2) {
			str2 += ", \n";
		}
		str2 += s + k + " : " + js_Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str2 += "\n" + s + "}";
		return str2;
	case "string":
		return o;
	default:
		return String(o);
	}
};
js_Boot.__interfLoop = function(cc,cl) {
	if(cc == null) {
		return false;
	}
	if(cc == cl) {
		return true;
	}
	var intf = cc.__interfaces__;
	if(intf != null) {
		var _g1 = 0;
		var _g = intf.length;
		while(_g1 < _g) {
			var i = intf[_g1++];
			if(i == cl || js_Boot.__interfLoop(i,cl)) {
				return true;
			}
		}
	}
	return js_Boot.__interfLoop(cc.__super__,cl);
};
js_Boot.__instanceof = function(o,cl) {
	if(cl == null) {
		return false;
	}
	switch(cl) {
	case Array:
		if((o instanceof Array)) {
			return o.__enum__ == null;
		} else {
			return false;
		}
		break;
	case Bool:
		return typeof(o) == "boolean";
	case Dynamic:
		return true;
	case Float:
		return typeof(o) == "number";
	case Int:
		if(typeof(o) == "number") {
			return (o|0) === o;
		} else {
			return false;
		}
		break;
	case String:
		return typeof(o) == "string";
	default:
		if(o != null) {
			if(typeof(cl) == "function") {
				if(o instanceof cl) {
					return true;
				}
				if(js_Boot.__interfLoop(js_Boot.getClass(o),cl)) {
					return true;
				}
			} else if(typeof(cl) == "object" && js_Boot.__isNativeObj(cl)) {
				if(o instanceof cl) {
					return true;
				}
			}
		} else {
			return false;
		}
		if(cl == Class ? o.__name__ != null : false) {
			return true;
		}
		if(cl == Enum ? o.__ename__ != null : false) {
			return true;
		}
		return o.__enum__ == cl;
	}
};
js_Boot.__nativeClassName = function(o) {
	var name = js_Boot.__toStr.call(o).slice(8,-1);
	if(name == "Object" || name == "Function" || name == "Math" || name == "JSON") {
		return null;
	}
	return name;
};
js_Boot.__isNativeObj = function(o) {
	return js_Boot.__nativeClassName(o) != null;
};
js_Boot.__resolveNativeClass = function(name) {
	return $global[name];
};
var js_html_compat_ArrayBuffer = function(a) {
	if((a instanceof Array) && a.__enum__ == null) {
		this.a = a;
		this.byteLength = a.length;
	} else {
		var len = a;
		this.a = [];
		var _g1 = 0;
		var _g = len;
		while(_g1 < _g) this.a[_g1++] = 0;
		this.byteLength = len;
	}
};
js_html_compat_ArrayBuffer.__name__ = true;
js_html_compat_ArrayBuffer.sliceImpl = function(begin,end) {
	var u = new Uint8Array(this,begin,end == null ? null : end - begin);
	var result = new ArrayBuffer(u.byteLength);
	new Uint8Array(result).set(u);
	return result;
};
js_html_compat_ArrayBuffer.prototype = {
	slice: function(begin,end) {
		return new js_html_compat_ArrayBuffer(this.a.slice(begin,end));
	}
	,__class__: js_html_compat_ArrayBuffer
};
var js_html_compat_Float32Array = function() { };
js_html_compat_Float32Array.__name__ = true;
js_html_compat_Float32Array._new = function(arg1,offset,length) {
	var arr;
	if(typeof(arg1) == "number") {
		arr = [];
		var _g1 = 0;
		var _g = arg1;
		while(_g1 < _g) {
			var i = _g1++;
			arr[i] = 0;
		}
		arr.byteLength = arr.length << 2;
		arr.byteOffset = 0;
		var _g2 = [];
		var _g21 = 0;
		var _g11 = arr.length << 2;
		while(_g21 < _g11) {
			var i1 = _g21++;
			_g2.push(0);
		}
		arr.buffer = new js_html_compat_ArrayBuffer(_g2);
	} else if(js_Boot.__instanceof(arg1,js_html_compat_ArrayBuffer)) {
		var buffer = arg1;
		if(offset == null) {
			offset = 0;
		}
		if(length == null) {
			length = buffer.byteLength - offset >> 2;
		}
		arr = [];
		var _g12 = 0;
		var _g3 = length;
		while(_g12 < _g3) {
			var i2 = _g12++;
			var val = buffer.a[offset++] | buffer.a[offset++] << 8 | buffer.a[offset++] << 16 | buffer.a[offset++] << 24;
			arr.push(haxe_io_FPHelper.i32ToFloat(val));
		}
		arr.byteLength = arr.length << 2;
		arr.byteOffset = offset;
		arr.buffer = buffer;
	} else if((arg1 instanceof Array) && arg1.__enum__ == null) {
		arr = arg1.slice();
		var buffer1 = [];
		var _g4 = 0;
		while(_g4 < arr.length) {
			var f = arr[_g4];
			++_g4;
			var i3 = haxe_io_FPHelper.floatToI32(f);
			buffer1.push(i3 & 255);
			buffer1.push(i3 >> 8 & 255);
			buffer1.push(i3 >> 16 & 255);
			buffer1.push(i3 >>> 24);
		}
		arr.byteLength = arr.length << 2;
		arr.byteOffset = 0;
		arr.buffer = new js_html_compat_ArrayBuffer(buffer1);
	} else {
		throw new js__$Boot_HaxeError("TODO " + Std.string(arg1));
	}
	arr.subarray = js_html_compat_Float32Array._subarray;
	arr.set = js_html_compat_Float32Array._set;
	return arr;
};
js_html_compat_Float32Array._set = function(arg,offset) {
	if(js_Boot.__instanceof(arg.buffer,js_html_compat_ArrayBuffer)) {
		var a = arg;
		if(arg.byteLength + offset > this.byteLength) {
			throw new js__$Boot_HaxeError("set() outside of range");
		}
		var _g1 = 0;
		var _g = arg.byteLength;
		while(_g1 < _g) {
			var i = _g1++;
			this[i + offset] = a[i];
		}
	} else if((arg instanceof Array) && arg.__enum__ == null) {
		var a1 = arg;
		if(a1.length + offset > this.byteLength) {
			throw new js__$Boot_HaxeError("set() outside of range");
		}
		var _g11 = 0;
		var _g2 = a1.length;
		while(_g11 < _g2) {
			var i1 = _g11++;
			this[i1 + offset] = a1[i1];
		}
	} else {
		throw new js__$Boot_HaxeError("TODO");
	}
};
js_html_compat_Float32Array._subarray = function(start,end) {
	var a = js_html_compat_Float32Array._new(this.slice(start,end));
	a.byteOffset = start * 4;
	return a;
};
var js_html_compat_Uint8Array = function() { };
js_html_compat_Uint8Array.__name__ = true;
js_html_compat_Uint8Array._new = function(arg1,offset,length) {
	var arr;
	if(typeof(arg1) == "number") {
		arr = [];
		var _g1 = 0;
		var _g = arg1;
		while(_g1 < _g) {
			var i = _g1++;
			arr[i] = 0;
		}
		arr.byteLength = arr.length;
		arr.byteOffset = 0;
		arr.buffer = new js_html_compat_ArrayBuffer(arr);
	} else if(js_Boot.__instanceof(arg1,js_html_compat_ArrayBuffer)) {
		var buffer = arg1;
		if(offset == null) {
			offset = 0;
		}
		if(length == null) {
			length = buffer.byteLength - offset;
		}
		if(offset == 0) {
			arr = buffer.a;
		} else {
			arr = buffer.a.slice(offset,offset + length);
		}
		arr.byteLength = arr.length;
		arr.byteOffset = offset;
		arr.buffer = buffer;
	} else if((arg1 instanceof Array) && arg1.__enum__ == null) {
		arr = arg1.slice();
		arr.byteLength = arr.length;
		arr.byteOffset = 0;
		arr.buffer = new js_html_compat_ArrayBuffer(arr);
	} else {
		throw new js__$Boot_HaxeError("TODO " + Std.string(arg1));
	}
	arr.subarray = js_html_compat_Uint8Array._subarray;
	arr.set = js_html_compat_Uint8Array._set;
	return arr;
};
js_html_compat_Uint8Array._set = function(arg,offset) {
	if(js_Boot.__instanceof(arg.buffer,js_html_compat_ArrayBuffer)) {
		var a = arg;
		if(arg.byteLength + offset > this.byteLength) {
			throw new js__$Boot_HaxeError("set() outside of range");
		}
		var _g1 = 0;
		var _g = arg.byteLength;
		while(_g1 < _g) {
			var i = _g1++;
			this[i + offset] = a[i];
		}
	} else if((arg instanceof Array) && arg.__enum__ == null) {
		var a1 = arg;
		if(a1.length + offset > this.byteLength) {
			throw new js__$Boot_HaxeError("set() outside of range");
		}
		var _g11 = 0;
		var _g2 = a1.length;
		while(_g11 < _g2) {
			var i1 = _g11++;
			this[i1 + offset] = a1[i1];
		}
	} else {
		throw new js__$Boot_HaxeError("TODO");
	}
};
js_html_compat_Uint8Array._subarray = function(start,end) {
	var a = js_html_compat_Uint8Array._new(this.slice(start,end));
	a.byteOffset = start;
	return a;
};
var $_, $fid = 0;
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $fid++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; o.hx__closures__[m.__id__] = f; } return f; }
String.prototype.__class__ = String;
String.__name__ = true;
Array.__name__ = true;
var Int = { __name__ : ["Int"]};
var Dynamic = { __name__ : ["Dynamic"]};
var Float = Number;
Float.__name__ = ["Float"];
var Bool = Boolean;
Bool.__ename__ = ["Bool"];
var Class = { __name__ : ["Class"]};
var Enum = { };
haxe_Resource.content = [{ name : "empty.frag", data : "I3ZlcnNpb24gMzAwIGVzDQoNCnByZWNpc2lvbiBsb3dwIGZsb2F0Ow0Kb3V0IHZlYzQgY29sb3I7DQoNCnZvaWQgbWFpbigpIA0Kew0KCWNvbG9yID0gdmVjNCgxLjApOw0KfQ"},{ name : "calc.vert", data : "I3ZlcnNpb24gMzAwIGVzDQoNCmxheW91dChsb2NhdGlvbiA9IDApIGluIHZlYzQgYV9wb3NpdGlvbjsNCmxheW91dChsb2NhdGlvbiA9IDEpIGluIHZlYzIgYV92ZWxvY2l0eTsNCmxheW91dChsb2NhdGlvbiA9IDIpIGluIGZsb2F0IGFfaW5kOw0KDQpmbGF0IG91dCB2ZWMyIHZfcG9zaXRpb247DQpmbGF0IG91dCB2ZWMyIHZfdmVsb2NpdHk7DQoNCnVuaWZvcm0gdmVjMiB1X21vdXNlOw0KdW5pZm9ybSBmbG9hdCB0aW1lOw0KZmxvYXQgUEFSVElDTEVfTUFTUyA9IDEwLjA7DQpmbG9hdCBHUkFWSVRZX0NFTlRFUl9NQVNTID0gMTAwLjA7DQpmbG9hdCBEQU1QSU5HID0gMWUtNTsNCg0KZmxvYXQgcmFuZCh2ZWMyIGNvKXsNCiAgICByZXR1cm4gZnJhY3Qoc2luKGRvdChjby54eSAsdmVjMigxMi45ODk4LDc4LjIzMykpKSAqIDQzNzU4LjU0NTMpOw0KfQ0KDQp2b2lkIG1haW4oKSB7DQoJdmVjMiBncmF2aXR5Q2VudGVyID0gdV9tb3VzZTsNCgkNCglmbG9hdCByID0gZGlzdGFuY2UoYV9wb3NpdGlvbi54eSwgZ3Jhdml0eUNlbnRlcik7DQoJdmVjMiBkaXJlY3Rpb24gPSBncmF2aXR5Q2VudGVyIC0gYV9wb3NpdGlvbi54eTsNCglmbG9hdCBmb3JjZSA9cipyKjAuMzsvLyBQQVJUSUNMRV9NQVNTICogR1JBVklUWV9DRU5URVJfTUFTUyAvIChyICogcikgKiBEQU1QSU5HOw0KLy8JZmxvYXQgbWF4Rm9yY2UgPSBtaW4oZm9yY2UsIERBTVBJTkcgKiAxMC4wKTsNCgkNCgl2ZWMyIGFjY2VsZXJhdGlvbiA9IGZvcmNlIC8gUEFSVElDTEVfTUFTUyAqIGRpcmVjdGlvbjsNCgl2X3ZlbG9jaXR5ID1hX3ZlbG9jaXR5KjAuOTggKyBhY2NlbGVyYXRpb24rdmVjMihzaW4oYV9pbmQqMC4xK3RpbWUqMC4wMSthX3Bvc2l0aW9uLngqNS4pLGNvcyhhX2luZCowLjA1K3RpbWUqMC4wNythX3Bvc2l0aW9uLnkqMy4pKSooMC4wMDUgKzAuMDAxKnNpbihhX2luZCowLjIpKSArIHJhbmQoYV9wb3NpdGlvbi54eSkqMC4wMDIqc2luKHRpbWUqMC4yK2FfaW5kKjAuMSk7DQoJdl9wb3NpdGlvbiA9IGFfcG9zaXRpb24ueHkrdl92ZWxvY2l0eTsvLyt2ZWMyKHNpbihhX2luZCowLjErdGltZSowLjAxK2FfcG9zaXRpb24ueSksIHNpbihhX2luZCowLjQrdGltZSowLjAwNSthX3Bvc2l0aW9uLngqYV9wb3NpdGlvbi55KSkqMC4xOw0KCS8vIGJvdW5jZSBhdCBib3JkZXJzDQoJLyoNCglpZiAodl9wb3NpdGlvbi54ID4gMS4wIHx8IHZfcG9zaXRpb24ueCA8IC0xLjApIHsNCgkJdl92ZWxvY2l0eS54ICo9IC0wLjU7DQoJfQ0KCWlmICh2X3Bvc2l0aW9uLnkgPiAxLjAgfHwgdl9wb3NpdGlvbi55IDwgLTEuMCkgew0KCQl2X3ZlbG9jaXR5LnkgKj0gLTAuNTsNCgl9Ki8NCn0"},{ name : "display.frag", data : "I3ZlcnNpb24gMzAwIGVzDQoNCnByZWNpc2lvbiBsb3dwIGZsb2F0Ow0Kb3V0IHZlYzQgY29sb3I7DQoNCmluIGZsb2F0IHZTcGVlZDsNCg0Kdm9pZCBtYWluKCkgDQp7CQ0KCWNvbG9yID0gdmVjNCh2U3BlZWQqMy4sIDAuMSwgMC4xLCB2U3BlZWQpOw0KfQ"},{ name : "display.vert", data : "I3ZlcnNpb24gMzAwIGVzDQoNCmxheW91dChsb2NhdGlvbiA9IDApIGluIHZlYzQgYV9wb3NpdGlvbjsNCmxheW91dChsb2NhdGlvbiA9IDEpIGluIHZlYzIgYV92ZWxvY2l0eTsNCg0Kb3V0IGZsb2F0IHZTcGVlZDsNCg0Kdm9pZCBtYWluKCkgDQp7DQoJZ2xfUG9zaXRpb24gPSBhX3Bvc2l0aW9uOw0KCWdsX1BvaW50U2l6ZSA9IDAuMDU7DQoJdlNwZWVkID0gbGVuZ3RoKGFfdmVsb2NpdHkpOw0KfQ"}];
var ArrayBuffer = $global.ArrayBuffer || js_html_compat_ArrayBuffer;
if(ArrayBuffer.prototype.slice == null) {
	ArrayBuffer.prototype.slice = js_html_compat_ArrayBuffer.sliceImpl;
}
var Float32Array = $global.Float32Array || js_html_compat_Float32Array._new;
var Uint8Array = $global.Uint8Array || js_html_compat_Uint8Array._new;
Main.points = 10000000;
haxe_crypto_Base64.CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
haxe_crypto_Base64.BYTES = haxe_io_Bytes.ofString(haxe_crypto_Base64.CHARS);
js_Boot.__toStr = ({ }).toString;
js_html_compat_Float32Array.BYTES_PER_ELEMENT = 4;
js_html_compat_Uint8Array.BYTES_PER_ELEMENT = 1;
Main.main();
})(typeof exports != "undefined" ? exports : typeof window != "undefined" ? window : typeof self != "undefined" ? self : this, typeof window != "undefined" ? window : typeof global != "undefined" ? global : typeof self != "undefined" ? self : this);
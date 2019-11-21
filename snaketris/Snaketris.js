(function (console, $hx_exports) { "use strict";
$hx_exports.util = $hx_exports.util || {};
function $extend(from, fields) {
	function Inherit() {} Inherit.prototype = from; var proto = new Inherit();
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var Config = function() {
};
var Main = $hx_exports.Main = function() {
	Main.instance = this;
	this.configure();
};
Main.main = function() {
};
Main.prototype = {
	configure: function() {
		var _g = this;
		this.loader = new PIXI.loaders.Loader();
		var assets = Config.GAME_ASSETS;
		var assetCount = 0;
		var _g1 = 0;
		var _g2 = assets.length;
		while(_g1 < _g2) {
			var i = _g1++;
			this.loader.add(assets[i],Config.GAME_PATH + assets[i]);
		}
		this.loader.addListener("complete",function() {
			_g.allAssetsLoaded();
		});
		this.loader.load();
		util_Asset.init(this,this.loader);
	}
	,getGameSize: function() {
		var width = window.innerWidth;
		var height = window.innerHeight;
		return new PIXI.Rectangle(0,0,width,height);
	}
	,allAssetsLoaded: function() {
		this.container = window.document.getElementById("container");
		this.initializeControls(this.container);
		window.addEventListener("resize",$bind(this,this.onResize),false);
	}
	,onResize: function(event) {
		var _g = this;
		if(this.resizeTimer != null) this.resizeTimer.stop();
		this.resizeTimer = haxe_Timer.delay(function() {
			var size = _g.getGameSize();
			_g.renderer.resize(size.width,size.height);
			var s = size.height / _g.game.height;
			_g.game.scale.x = _g.game.scale.y = s;
			_g.game.x = Math.round((size.width - _g.game.width) / 2);
		},350);
	}
	,initializeControls: function(container) {
		var size = this.getGameSize();
		var gameWidth = size.width;
		var gameHeight = size.height;
		this.mainStage = new PIXI.Container();
		var rendererOptions = { };
		rendererOptions.backgroundColor = 0;
		rendererOptions.antialias = false;
		this.renderer = PIXI.autoDetectRenderer(gameWidth,gameHeight,rendererOptions);
		container.appendChild(this.renderer.view);
		this.game = new controls_GameView();
		this.mainStage.addChild(this.game);
		createjs.Ticker.addEventListener("tick",$bind(this,this.tick));
		createjs.Ticker.setFPS(60);
		this.onResize(null);
	}
	,tick: function(event) {
		var now = new Date().getTime();
		var delta = now - this.previousTick;
		this.previousTick = now;
		delta = Math.min(200,delta);
		this.renderer.render(this.mainStage);
		delta /= 16.666;
		this.game.onTick(delta);
	}
};
var Reflect = function() { };
Reflect.field = function(o,field) {
	try {
		return o[field];
	} catch( e ) {
		if (e instanceof js__$Boot_HaxeError) e = e.val;
		return null;
	}
};
Reflect.fields = function(o) {
	var a = [];
	if(o != null) {
		var hasOwnProperty = Object.prototype.hasOwnProperty;
		for( var f in o ) {
		if(f != "__id__" && f != "hx__closures__" && hasOwnProperty.call(o,f)) a.push(f);
		}
	}
	return a;
};
var controls_Controllers = function() {
	PIXI.Container.call(this);
	window.addEventListener("keydown",$bind(this,this.onKeyDown));
	window.addEventListener("keyup",$bind(this,this.onKeyUp));
};
controls_Controllers.__super__ = PIXI.Container;
controls_Controllers.prototype = $extend(PIXI.Container.prototype,{
	onKeyUp: function(e) {
		console.log(e.keyCode);
		if(e.keyCode == 37) this.emit(controls_Controllers.LEFT_OFF); else if(e.keyCode == 39) this.emit(controls_Controllers.RIGHT_OFF);
		if(e.keyCode == 40) this.emit(controls_Controllers.DROP_OFF);
	}
	,onKeyDown: function(e) {
		if(e.keyCode == 37) this.emit(controls_Controllers.LEFT_ON); else if(e.keyCode == 38) this.emit(controls_Controllers.ROTATE); else if(e.keyCode == 39) this.emit(controls_Controllers.RIGHT_ON); else if(e.keyCode == 40) this.emit(controls_Controllers.DROP_ON); else if(e.keyCode == 65) this.emit(controls_Controllers.WORM_LEFT); else if(e.keyCode == 68) this.emit(controls_Controllers.WORM_RIGHT); else if(e.keyCode == 87) this.emit(controls_Controllers.WORM_UP); else if(e.keyCode == 83) this.emit(controls_Controllers.WORM_DOWN);
	}
});
var controls_GameView = function() {
	this.tickStart = 30;
	this.moveTime = 0;
	this.wormStartTime = 0;
	this.startTime = 0;
	this.dropOn = false;
	this.tickTime = 400;
	this.wormTickTime = 200;
	this.move = 0;
	PIXI.Container.call(this);
	this.initializeControls();
};
controls_GameView.__super__ = PIXI.Container;
controls_GameView.prototype = $extend(PIXI.Container.prototype,{
	initializeControls: function() {
		this.grid = new controls_Grid();
		this.addChild(this.grid);
		this.powerup = util_Asset.getImage("powerup.png",true);
		this.powerup.width = this.powerup.height = controls_Grid.SQUARE;
		this.spawnNext();
		this.spawnNextWorm();
		this.spawnNextPower();
		this.controls = new controls_Controllers();
		this.controls.addListener(controls_Controllers.LEFT_ON,$bind(this,this.onLeft));
		this.controls.addListener(controls_Controllers.RIGHT_ON,$bind(this,this.onRight));
		this.controls.addListener(controls_Controllers.LEFT_OFF,$bind(this,this.offLeft));
		this.controls.addListener(controls_Controllers.RIGHT_OFF,$bind(this,this.offRight));
		this.controls.addListener(controls_Controllers.DROP_ON,$bind(this,this.onDrop));
		this.controls.addListener(controls_Controllers.DROP_OFF,$bind(this,this.onDropOff));
		this.controls.addListener(controls_Controllers.ROTATE,$bind(this,this.onRotate));
		this.controls.addListener(controls_Controllers.WORM_LEFT,$bind(this,this.wormLeft));
		this.controls.addListener(controls_Controllers.WORM_RIGHT,$bind(this,this.wormRight));
		this.controls.addListener(controls_Controllers.WORM_UP,$bind(this,this.wormUp));
		this.controls.addListener(controls_Controllers.WORM_DOWN,$bind(this,this.wormDown));
	}
	,spawnNextPower: function() {
		this.powerpos = new PIXI.Point(Math.floor(controls_Grid.WIDTH * Math.random()),Math.floor(controls_Grid.HEIGHT * Math.random()));
		this.powerup.x = this.powerpos.x * controls_Grid.SQUARE;
		this.powerup.y = this.powerpos.y * controls_Grid.SQUARE;
		this.addChild(this.powerup);
	}
	,wormLeft: function() {
		if(this.currentWorm.dirX == 0) {
			this.currentWorm.dirX = -1;
			this.currentWorm.dirY = 0;
		}
	}
	,wormRight: function() {
		if(this.currentWorm.dirX == 0) {
			this.currentWorm.dirX = 1;
			this.currentWorm.dirY = 0;
		}
	}
	,wormDown: function() {
		if(this.currentWorm.dirY == 0) {
			this.currentWorm.dirY = 1;
			this.currentWorm.dirX = 0;
		}
	}
	,wormUp: function() {
		if(this.currentWorm.dirY == 0) {
			this.currentWorm.dirY = -1;
			this.currentWorm.dirX = 0;
		}
	}
	,spawnNext: function() {
		this.currentPiece = new controls_Piece();
		this.currentPiece.gx = Math.floor((controls_Grid.WIDTH - this.currentPiece.gridWidth) / 2);
		this.currentPiece.x = this.currentPiece.gx * controls_Grid.SQUARE;
		this.currentPiece.y = this.currentPiece.gy * controls_Grid.SQUARE;
		this.addChild(this.currentPiece);
		if(this.grid.hits(this.currentPiece)) this.grid.reset();
	}
	,spawnNextWorm: function() {
		this.currentWorm = new controls_Worm();
		this.addChild(this.currentWorm);
	}
	,offLeft: function() {
		this.move = 0;
	}
	,offRight: function() {
		this.move = 0;
	}
	,onLeft: function() {
		if(this.move == -1) return;
		this.move = -1;
		this.moveLeft();
	}
	,moveLeft: function() {
		if(this.currentPiece.gx > 0) {
			this.currentPiece.gx--;
			if(this.grid.hits(this.currentPiece)) this.currentPiece.gx++;
			this.currentPiece.x = this.currentPiece.gx * controls_Grid.SQUARE;
		}
		this.moveTime = new Date().getTime();
	}
	,onRight: function() {
		if(this.move == 1) return;
		this.move = 1;
		this.moveRight();
	}
	,moveRight: function() {
		if(this.currentPiece.gx < controls_Grid.WIDTH - 1 - this.currentPiece.gridWidth) {
			this.currentPiece.gx++;
			if(this.grid.hits(this.currentPiece)) this.currentPiece.gx--;
			this.currentPiece.x = this.currentPiece.gx * controls_Grid.SQUARE;
		}
		this.moveTime = new Date().getTime();
	}
	,onDrop: function() {
		this.dropOn = true;
	}
	,onDropOff: function() {
		this.dropOn = false;
	}
	,onRotate: function() {
		this.currentPiece.rotate();
		while(this.currentPiece.gx + this.currentPiece.gridWidth >= controls_Grid.WIDTH) this.currentPiece.gx--;
		while(this.currentPiece.gx < 0) this.currentPiece.gx++;
		this.currentPiece.x = this.currentPiece.gx * controls_Grid.SQUARE;
		this.currentPiece.y = this.currentPiece.gy * controls_Grid.SQUARE;
		if(this.grid.hits(this.currentPiece)) {
			this.currentPiece.rotate();
			this.currentPiece.rotate();
			this.currentPiece.rotate();
		}
	}
	,onTick: function(delta) {
		var now = new Date().getTime();
		if(now - this.moveTime > 100) {
			if(this.move == -1) this.moveLeft(); else if(this.move == 1) this.moveRight();
		}
		if(now - this.wormStartTime > this.wormTickTime) {
			this.wormStartTime = now;
			this.currentWorm.moveWorm();
			if(this.grid.wormHits(this.currentWorm,this.currentPiece)) {
				this.currentWorm.revertPieces();
				this.removeChild(this.currentWorm);
				this.spawnNextWorm();
			} else if(this.currentWorm.coordinates[0].x == this.powerpos.x && this.currentWorm.coordinates[0].y == this.powerpos.y) {
				this.spawnNextPower();
				this.currentWorm.increaseSize();
			}
		}
		if(now - this.tickStart > 30) {
			this.grid.tick(this.currentPiece);
			this.tickStart = now;
		}
		if(now - this.startTime > this.tickTime || this.dropOn && now - this.startTime > 20) {
			this.startTime = now;
			this.grid.tick(this.currentPiece);
			this.currentPiece.gy++;
			if(this.grid.hits(this.currentPiece)) {
				this.currentPiece.gy--;
				this.dropOn = false;
				this.grid.populate(this.currentPiece);
				this.removeChild(this.currentPiece);
				this.spawnNext();
			}
			this.currentPiece.y = this.currentPiece.gy * controls_Grid.SQUARE;
		}
	}
});
var controls_Grid = function() {
	PIXI.Container.call(this);
	this.initializeControls();
};
controls_Grid.__super__ = PIXI.Container;
controls_Grid.prototype = $extend(PIXI.Container.prototype,{
	reset: function() {
		var _g1 = 0;
		var _g = controls_Grid.HEIGHT;
		while(_g1 < _g) {
			var i = _g1++;
			var _g3 = 0;
			var _g2 = controls_Grid.WIDTH;
			while(_g3 < _g2) {
				var j = _g3++;
				var c = this.grid[i][j];
				if(c.sprite != null) this.removeChild(c.sprite);
				c.sprite = null;
			}
		}
	}
	,resize: function(size) {
		this.size = size;
	}
	,initializeControls: function() {
		this.bg = new PIXI.Graphics();
		this.bg.beginFill(16777215);
		this.bg.drawRect(0,0,controls_Grid.SQUARE * controls_Grid.WIDTH,controls_Grid.SQUARE * controls_Grid.HEIGHT);
		this.bg.endFill();
		this.addChild(this.bg);
		this.grid = [];
		var _g1 = 0;
		var _g = controls_Grid.HEIGHT;
		while(_g1 < _g) {
			var i = _g1++;
			this.grid[i] = [];
			var _g3 = 0;
			var _g2 = controls_Grid.WIDTH;
			while(_g3 < _g2) {
				var j = _g3++;
				this.grid[i][j] = new controls_GridItem();
			}
		}
	}
	,dropPiece: function(piece) {
		var yStart = piece.gy;
		var _g1 = yStart;
		var _g = controls_Grid.HEIGHT;
		while(_g1 < _g) {
			var y = _g1++;
			piece.gy = y;
			if(this.hits(piece)) {
				piece.gy--;
				return;
			}
		}
	}
	,populate: function(piece) {
		var _g = 0;
		var _g1 = piece.squares;
		while(_g < _g1.length) {
			var s = _g1[_g];
			++_g;
			s.x = piece.gx * controls_Grid.SQUARE + s.x;
			s.y = piece.gy * controls_Grid.SQUARE + s.y;
			this.addChild(s);
		}
		var _g11 = 0;
		var _g2 = piece.coordinates.length;
		while(_g11 < _g2) {
			var i = _g11++;
			var coordinate = piece.coordinates[i];
			var s1 = piece.squares[i];
			this.grid[coordinate.y + piece.gy][coordinate.x + piece.gx].sprite = s1;
		}
		var remove = [];
		var _g12 = 0;
		var _g3 = controls_Grid.HEIGHT;
		while(_g12 < _g3) {
			var i1 = _g12++;
			var full = true;
			var _g31 = 0;
			var _g21 = controls_Grid.WIDTH;
			while(_g31 < _g21) {
				var j = _g31++;
				full = this.grid[i1][j].sprite != null;
				if(!full) break;
			}
			if(full) remove.push(i1);
		}
		var _g4 = 0;
		while(_g4 < remove.length) {
			var ind = remove[_g4];
			++_g4;
			var _g22 = 0;
			var _g13 = controls_Grid.WIDTH;
			while(_g22 < _g13) {
				var j1 = _g22++;
				this.removeChild(this.grid[ind][j1].sprite);
				this.grid[ind][j1].sprite = null;
				this.grid[ind][j1].isWorm = false;
			}
			var $it0 = new util_IntStepIter(ind,1,-1);
			while( $it0.hasNext() ) {
				var i2 = $it0.next();
				var _g23 = 0;
				var _g14 = controls_Grid.WIDTH;
				while(_g23 < _g14) {
					var j2 = _g23++;
					if(this.grid[i2 - 1][j2].sprite != null) this.grid[i2 - 1][j2].sprite.y += controls_Grid.SQUARE;
					this.grid[i2][j2].sprite = this.grid[i2 - 1][j2].sprite;
					this.grid[i2][j2].isWorm = this.grid[i2 - 1][j2].isWorm;
				}
			}
		}
	}
	,hits: function(piece) {
		var _g = 0;
		var _g1 = piece.coordinates;
		while(_g < _g1.length) {
			var coordinate = _g1[_g];
			++_g;
			var cx = piece.gx + coordinate.x;
			var cy = piece.gy + coordinate.y;
			if(cy >= controls_Grid.HEIGHT) {
				console.log(piece.gridHeight);
				return true;
			}
			if(this.grid[cy][cx].sprite != null) return true;
		}
		return false;
	}
	,wormHits: function(worm,currentPiece) {
		var same = [];
		var _g = 0;
		var _g1 = worm.coordinates;
		while(_g < _g1.length) {
			var point = _g1[_g];
			++_g;
			if(point.x >= controls_Grid.WIDTH || point.x < 0 || point.y < 0 || point.y >= controls_Grid.HEIGHT || this.grid[point.y][point.x].sprite != null) return true;
			var _g2 = 0;
			var _g3 = currentPiece.coordinates;
			while(_g2 < _g3.length) {
				var cp = _g3[_g2];
				++_g2;
				if(cp.x + currentPiece.gx == point.x && cp.y + currentPiece.gy == point.y) return true;
			}
		}
		return false;
	}
	,dropWorm: function(worm) {
		var _g1 = 0;
		var _g = worm.pieces.length;
		while(_g1 < _g) {
			var i = _g1++;
			var c = worm.coordinates[i];
			var s = worm.pieces[i];
			this.grid[c.y][c.x].sprite = s;
			this.grid[c.y][c.x].isWorm = true;
			this.addChild(s);
		}
	}
	,tick: function(currentPiece) {
		var $it0 = new util_IntStepIter(controls_Grid.HEIGHT - 1,-1,-1);
		while( $it0.hasNext() ) {
			var i = $it0.next();
			var _g1 = 0;
			var _g = controls_Grid.WIDTH;
			while(_g1 < _g) {
				var j = _g1++;
				if(this.grid[i][j].isWorm && this.grid[i][j].sprite != null) {
					if(i < controls_Grid.HEIGHT - 1 && this.grid[i + 1][j].sprite == null && !currentPiece.testHit(i + j,j)) {
						this.grid[i + 1][j].sprite = this.grid[i][j].sprite;
						this.grid[i][j].sprite = null;
						this.grid[i][j].isWorm = false;
						this.grid[i + 1][j].sprite.y += controls_Grid.SQUARE;
						this.grid[i + 1][j].isWorm = true;
					}
				}
			}
		}
	}
});
var controls_GridItem = function() {
	this.isWorm = false;
	this.sprite = null;
};
var controls_Piece = function() {
	this.gridHeight = 0;
	this.gridWidth = 0;
	this.squares = [];
	this.color = 0;
	this.gx = 0;
	this.gy = 0;
	this.coordinates = [];
	PIXI.Container.call(this);
	this.color = controls_Piece.colors[Math.floor(Math.random() * controls_Piece.colors.length)];
	this.setPieceType(Math.floor(Math.random() * controls_Piece.SHAPES.length));
};
controls_Piece.__super__ = PIXI.Container;
controls_Piece.prototype = $extend(PIXI.Container.prototype,{
	setPieceType: function(val) {
		var pieces = controls_Piece.SHAPES[val];
		var _g1 = 0;
		var _g = pieces.length;
		while(_g1 < _g) {
			var i = _g1++;
			var row = pieces[i];
			var _g3 = 0;
			var _g2 = row.length;
			while(_g3 < _g2) {
				var j = _g3++;
				var val1 = row.charAt(j);
				if(val1 == "1") {
					var s = util_Asset.getImage("square.png",true);
					this.addChild(s);
					s.width = controls_Grid.SQUARE;
					s.height = controls_Grid.SQUARE;
					s.x = j * s.width;
					s.y = i * s.height;
					s.tint = this.color;
					this.squares.push(s);
					this.coordinates.push(new PIXI.Point(j,i));
					this.gridHeight = Math.max(this.gridHeight,i);
					this.gridWidth = Math.max(this.gridWidth,j);
				}
			}
		}
	}
	,testHit: function(x,y) {
		var _g = 0;
		var _g1 = this.coordinates;
		while(_g < _g1.length) {
			var c = _g1[_g];
			++_g;
			if(c.x + this.gx == x && c.y + this.gy == y) return true;
		}
		return false;
	}
	,rotate: function() {
		var _g1 = 0;
		var _g = this.coordinates.length;
		while(_g1 < _g) {
			var i = _g1++;
			var c = this.coordinates[i];
			var tmp1 = c.x;
			c.x = this.gridHeight - c.y;
			c.y = tmp1;
			var s = this.squares[i];
			s.x = c.x * controls_Grid.SQUARE;
			s.y = c.y * controls_Grid.SQUARE;
		}
		var tmp = this.gridHeight;
		this.gridHeight = this.gridWidth;
		this.gridWidth = tmp;
	}
});
var controls_Worm = function() {
	this.pieces = [];
	this.dirY = 0;
	this.dirX = 0;
	this.coordinates = [];
	PIXI.Container.call(this);
	this.initializeControls();
};
controls_Worm.__super__ = PIXI.Container;
controls_Worm.prototype = $extend(PIXI.Container.prototype,{
	initializeControls: function() {
		var color = Math.floor(16777215 * Math.random());
		var _g = 0;
		while(_g < 5) {
			var i = _g++;
			var p = util_Asset.getImage("worm.png",true);
			this.pieces.push(p);
			p.tint = color;
			p.width = controls_Grid.SQUARE;
			p.height = controls_Grid.SQUARE;
			this.addChild(p);
			this.coordinates.push(new PIXI.Point(i,0));
		}
		this.dirX = 1;
		this.dirY = 0;
	}
	,moveWorm: function() {
		this.revert = [];
		var _g = 0;
		var _g1 = this.coordinates;
		while(_g < _g1.length) {
			var c = _g1[_g];
			++_g;
			this.revert.push(new PIXI.Point(c.x,c.y));
		}
		var $it0 = new util_IntStepIter(this.coordinates.length - 1,0,-1);
		while( $it0.hasNext() ) {
			var i = $it0.next();
			this.coordinates[i].x = this.coordinates[i - 1].x;
			this.coordinates[i].y = this.coordinates[i - 1].y;
		}
		this.coordinates[0].x += this.dirX;
		this.coordinates[0].y += this.dirY;
		this.updatePieces();
	}
	,updatePieces: function() {
		var _g1 = 0;
		var _g = this.coordinates.length;
		while(_g1 < _g) {
			var i = _g1++;
			this.pieces[i].x = this.coordinates[i].x * controls_Grid.SQUARE;
			this.pieces[i].y = this.coordinates[i].y * controls_Grid.SQUARE;
		}
	}
	,revertPieces: function() {
		this.coordinates = this.revert;
		this.updatePieces();
	}
	,increaseSize: function() {
		var p = util_Asset.getImage("worm.png",true);
		this.pieces.push(p);
		p.tint = Math.floor(16777215 * Math.random());
		p.width = controls_Grid.SQUARE;
		p.height = controls_Grid.SQUARE;
		this.addChild(p);
		this.coordinates.push(new PIXI.Point(this.coordinates[this.coordinates.length - 1].x,this.coordinates[this.coordinates.length - 1].y));
	}
});
var haxe_Timer = function(time_ms) {
	var me = this;
	this.id = setInterval(function() {
		me.run();
	},time_ms);
};
haxe_Timer.delay = function(f,time_ms) {
	var t = new haxe_Timer(time_ms);
	t.run = function() {
		t.stop();
		f();
	};
	return t;
};
haxe_Timer.prototype = {
	stop: function() {
		if(this.id == null) return;
		clearInterval(this.id);
		this.id = null;
	}
	,run: function() {
	}
};
var js__$Boot_HaxeError = function(val) {
	Error.call(this);
	this.val = val;
	this.message = String(val);
	if(Error.captureStackTrace) Error.captureStackTrace(this,js__$Boot_HaxeError);
};
js__$Boot_HaxeError.__super__ = Error;
js__$Boot_HaxeError.prototype = $extend(Error.prototype,{
});
var util_Asset = $hx_exports.util.Asset = function() {
	throw new js__$Boot_HaxeError("Asset is static only.");
};
util_Asset.init = function(main,loader) {
	util_Asset._main = main;
	util_Asset._loader = loader;
};
util_Asset.getResource = function(name) {
	name = Config.GAME_PATH + "img/" + name;
	if(!Object.prototype.hasOwnProperty.call(util_Asset._loader.resources,name)) console.log("Resource " + name + " not found!");
	return Reflect.field(util_Asset._loader.resources,name);
};
util_Asset.getRawImage = function(name) {
	return util_Asset.getResource(name).data;
};
util_Asset.getTexture = function(name,fromSheet) {
	if(!fromSheet) name = Config.GAME_PATH + "img/" + name;
	var tex = null;
	try {
		tex = PIXI.Texture.fromFrame(name);
	} catch( e ) {
		if (e instanceof js__$Boot_HaxeError) e = e.val;
		tex = PIXI.Texture.fromImage(name);
	}
	if(tex == null) console.log("Warning: Asset " + name + " not found.");
	return tex;
};
util_Asset.getImage = function(name,fromSheet) {
	if(!fromSheet) name = Config.GAME_PATH + "img/" + name;
	var sprite = null;
	try {
		sprite = PIXI.Sprite.fromFrame(name);
	} catch( e ) {
		if (e instanceof js__$Boot_HaxeError) e = e.val;
		var t = PIXI.Texture.fromImage(name);
		var sprite1 = new PIXI.Sprite(t);
	}
	if(sprite == null) console.log("Warning: Asset " + name + " not found.");
	return sprite;
};
util_Asset.getTexturesAndAnimations = function(json,id) {
	var tex = [];
	var anim = { };
	var ret = { textures : tex, animations : anim};
	var count = 0;
	var _g = 0;
	var _g1 = Reflect.fields(json.frames);
	while(_g < _g1.length) {
		var frame = _g1[_g];
		++_g;
		var data = Reflect.field(json.frames,frame);
		var split = frame.split("/");
		if(split[0] != id) continue;
		var animName = split[1];
		var spriteName = split[2];
		var texture = PIXI.Texture.fromFrame(frame);
		tex.push(texture);
		if(Object.prototype.hasOwnProperty.call(anim,animName)) Reflect.field(anim,animName)[1] = count; else anim[animName] = [count,count];
		count++;
	}
	return ret;
};
var util_IntStepIter = function(start,end,step) {
	if(step == null) step = 1;
	this.start = start;
	this.current = start;
	this.end = end;
	this.step = step;
	if(step > 0) this.test = function(c,e) {
		return c < e;
	}; else if(step < 0) this.test = function(c1,e1) {
		return c1 > e1;
	}; else throw new js__$Boot_HaxeError("Must step over the range");
};
util_IntStepIter.prototype = {
	hasNext: function() {
		return this.test(this.current,this.end);
	}
	,next: function() {
		var ret = this.current;
		this.current += this.step;
		return ret;
	}
};
var $_, $fid = 0;
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $fid++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; o.hx__closures__[m.__id__] = f; } return f; }
var q = window.jQuery;
var js = js || {}
js.JQuery = q;
Config.GAME_ASSETS = ["ui.json"];
Config.GAME_PATH = "img/";
controls_Controllers.WORM_DOWN = "wormDown";
controls_Controllers.WORM_UP = "wormUp";
controls_Controllers.WORM_LEFT = "wormLeft";
controls_Controllers.WORM_RIGHT = "wormRight";
controls_Controllers.LEFT_ON = "leftOn";
controls_Controllers.RIGHT_ON = "rightOn";
controls_Controllers.LEFT_OFF = "leftOff";
controls_Controllers.RIGHT_OFF = "rightOff";
controls_Controllers.DROP_ON = "dropon";
controls_Controllers.DROP_OFF = "dropoff";
controls_Controllers.ROTATE = "rotate";
controls_Grid.WIDTH = 12;
controls_Grid.HEIGHT = 25;
controls_Grid.SQUARE = 30;
controls_Piece.SHAPES = [["1","1","1","1"],["10","10","11"],["01","01","11"],["10","11","01"],["011","110"],["110","011"],["11","11"]];
controls_Piece.colors = [16711680,65280,255,16711935,16776960];
util_Asset._init = false;
Main.main();
})(typeof console != "undefined" ? console : {log:function(){}}, typeof window != "undefined" ? window : exports);

package;
import haxe.Timer;
import js.Lib;
import pixi.core.display.Container;
import pixi.core.graphics.Graphics;
import pixi.core.sprites.Sprite;
import pixi.core.text.Text;
import pixi.core.text.TextStyleObject;

/**
 * ...
 * @author 
 */
class GameView extends Container
{
	public var gameover:Text;
	
	private var character:Character;
	private var bg:Graphics;
	
	private var started:Bool = false;
	private var columns:Array<MorseColumn> = [];
	
	private var ground:Graphics = new Graphics();
	
	private var down:Bool = false;
	private var wc:Float = 0;
	
	private var speed:Float = 1;
	
	private var start:Float = 0;
	private var lastd:Float = 0;
	
	private var heldDown:Int = 0;
	
	public function new() 
	{
		super();
		var tf:TextStyleObject = { };
		tf.fontFamily = "Impact";
		tf.fill = 0xFFFFFF;
		tf.fontSize = 150;
		tf.strokeThickness = 15;
		tf.stroke = 0x0;
		
		this.gameover = new Text("GAME OVER " , tf);
		
		this.ground = new Graphics();
		this.character = new Character();
		this.bg = new Graphics();
		this.bg.beginFill(0x909090, 1);
		this.bg.drawRect(0, 0, 1280, 720);
		this.bg.endFill();
		this.addChild(this.bg);
		this.prepare();
		this.interactive = true;
		
		this.ground.beginFill(Main.SURFACE, 1);
		this.ground.drawRect(0, 0, 1280, 100);
		this.ground.endFill();
		this.ground.y = 720 - 100;
		this.addChild(this.ground);
		
		this.addChild(this.character);
		this.character.y = 620 + 10;
		this.character.x = 280;
		
		
		this.addListener("mousedown", ondown);
		this.addListener("touchstart", ondown);
		this.addListener("mouseup", onup);
		this.addListener("touchend", onup);
	}
	private var offset:Int = 0;
	public function prepare(?replay:Bool):Void
	{
		wc = 0;
		startimeset = false;
		speed = 1;
		for (r in columns)
			this.removeChild(r);
		var intro:String = "CLICK TO START";
		columns = [];
		var mc:MorseColumn = null;
		for (i in 0...intro.length)
		{
			mc = new MorseColumn(intro.charAt(i), i%2);
			this.addChild(mc);
			mc.tutorial = true;
			mc.x = wc;
			wc +=cast mc.width;
			columns.push(mc);
		}
		if (replay)
		{
			for (c in columns)
				c.x -= 2000;
			wc -= 2000;
		}
		var startline:Graphics = new Graphics();
		startline.beginFill(Main.HILIGHT);
		startline.drawRect(0, 0, 5, 620);
		startline.endFill();
		startline.x = mc.width-5;
		mc.addChild(startline);
		this.gameover.visible = false;
		this.addChild(this.ground);
		this.addChild(this.character);
		
	}
	
	private function spawnWord(word:String):Void
	{
		for (i in 0...word.length)
		{
			var mc:MorseColumn = new MorseColumn(word.charAt(i), i%2);
			this.addChild(mc);
			mc.tutorial = false;
			mc.x = wc;
			wc +=cast mc.width;
			columns.push(mc);
		}
		this.addChild(this.ground);
		this.addChild(this.character);
		
	}
	
	private function ondown():Void
	{
		if (!this.interactive) return;
		if (this.gameover.visible) prepare(true);
		this.gameover.visible = false;
		if (!started) this.start = Date.now().getTime();
		lastd =cast Date.now().getTime();
		this.started = true;
		this.character.jump();
		down = true;
	}
	private function onup():Void
	{
		if (Date.now().getTime() - lastd > 5000)
		{
			started = false;
			prepare(true);
			gameover.text = "DONT CHEAT!";
			gameover.visible = true;
			this.addChild(gameover);
			gameover.x = Math.round((1280 - gameover.width) /2);
			gameover.y = Math.round((720 - gameover.height) /2);
		}
		down = false;
		this.character.down();
	}
	
	var wordlist:String = " KEEP ON JAMMING - CAN YOU BEAT THIS GAME - THIS MESSAGE LOOPS - ";
	private var startimeset:Bool = false;
	public function ontick(delta:Float):Void
	{
		if (!started) return;
		for (c in columns)
		{
			if (c.x +c.width < 0) {
				c.visible = false;
				continue;
			}
			if (c.x < character.x && !c.tutorial && !startimeset)
			{
				startimeset = true;
				this.start = Date.now().getTime();
			}
			c.x -= delta * 2*speed;
			if (!c.tutorial && c.x + c.width < character.x && c.blocks.length > 0)
			{
				var time:Int = Math.round((Date.now().getTime() - start)/1000);
				gameover.text = "GAME OVER\nSCORE: " + time;
		this.interactive = false;
		Timer.delay(function() { this.interactive = true; }, 400);
				started = false;
				gameover.visible = true;
				this.addChild(gameover);
				gameover.x = Math.round((1280 - gameover.width) /2);
				gameover.y = Math.round((720 - gameover.height) /2);
			}
		}
		wc-= delta * 2*speed;
		
		if (columns[columns.length - 1].x < 1280)
		{
			spawnWord(wordlist);
		}
		
		if (down)
		{
			var br:Int = 0;
			for ( mc in columns)
				br += mc.testhit(cast character.x, speed);
			trace(br);
			if (br > 0) onup();
		}
		speed += 0.0005;
	}
	
}
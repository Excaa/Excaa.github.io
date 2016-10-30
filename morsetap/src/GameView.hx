package;
import js.Lib;
import pixi.core.display.Container;
import pixi.core.graphics.Graphics;
import pixi.core.sprites.Sprite;

/**
 * ...
 * @author 
 */
class GameView extends Container
{
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
	public function prepare():Void
	{
		wc = 0;
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
		var startline:Graphics = new Graphics();
		startline.beginFill(Main.HILIGHT);
		startline.drawRect(0, 0, 5, 620);
		startline.endFill();
		startline.x = mc.width;
		mc.addChild(startline);
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
			Lib.alert("Dont cheat!");
			started = false;
			prepare();
		}
		down = false;
		this.character.down();
	}
	
	var wordlist:String = " KEEP ON JAMMING --- CAN YOU BEAT THIS GAME --- THIS MESSAGE LOOPS --- ";
	
	public function ontick(delta:Float):Void
	{
		if (!started) return;
		for (c in columns)
		{
			if (c.x +c.width < 0) {
				c.visible = false;
				continue;
			}
			c.x -= delta * 2*speed;
			if (!c.tutorial && c.x + c.width < character.x && c.blocks.length > 0)
			{
				var time:Int = Math.round((Date.now().getTime() - start)/1000);
				Lib.alert("Game over. Your time was " + time);
				started = false;
				prepare();
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
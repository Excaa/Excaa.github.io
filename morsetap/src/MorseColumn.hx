package;

import js.html.svg.BoundingBoxOptions;
import pixi.core.display.Container;
import pixi.core.graphics.Graphics;
import pixi.core.math.Point;
import pixi.core.text.Text;
import pixi.core.text.TextStyleObject;

/**
 * ...
 * @author 
 */
class MorseColumn extends Container
{
	public static var morses:Dynamic = {
		"A":".-",
		"B":"-...",
		"C":"-.-.",
		"D":"-..",
		"E":".",
		"F":"..-.",
		"G":"--.",
		"H":"....",
		"I":"..",
		"J":".---",
		"K":"-.-",
		"L":".-..",
		"M":"--",
		"N":"-.",
		"O":"---",
		"P":".--.",
		"Q":"--.-",
		"R":".-.",
		"S":"...",
		"T":"-",
		"U":"..-",
		"V":"...-",
		"W":".--",
		"X":"-..-",
		"Y":"-.--",
		"Z":"--..",
	};
	
	public var letter:Text;
	public var bg:Graphics;
	public var dots:Array<Graphics> = [];
	public var blocks:Array<Graphics> = [];
	public var cors:Array<Graphics> = [];
	private var bc:Container = new Container();
	
	
	public var tutorial:Bool;
	
	
	public function new(letter:String, val:Int)
	{
		super();
		var tf:TextStyleObject = { };
		tf.fontFamily = "Impact";
		tf.fill = 0xFFFFFF;
		tf.fontSize = 200;
		this.letter = new Text(letter, tf);
		
		
		
		var size:Float =cast drawblock(letter);
		
		this.letter.x = Math.round((size - this.letter.width) / 2);
		this.letter.y = 100;
		this.bg = new Graphics();
		this.bg.beginFill(val == 0?Main.DARK2:Main.DARK1, 1);
		this.bg.drawRect(0, 0, size, 620);
		this.bg.endFill();
		
		this.addChild(this.bg);
		this.addChild(this.letter);
		this.addChild(bc);
	}
	
	private function drawblock(letter:String):Int
	{
		var conf:Dynamic = Reflect.field(morses, letter.toUpperCase());
		if (conf == null) return 200;
		var xc:Int = 20;
		for (i in 0...conf.length)
		{
			var type:String = conf.charAt(i);
			var block:Graphics = new Graphics();
			var cor:Graphics = new Graphics();
			block.beginFill(Main.HILIGHT);
			if (type == ".")
			{
				block.drawRect(0, 0, 30, 40);
				block.y = 620 - 40;
				untyped block.type = ".";
				cor.drawRect(0, 0, 30, 40);
				cor.y = 620 - 40;
			}
			else
			{
				untyped block.type = "-";
				block.drawRect(0, 0, 50, 120);
				block.y = 620 - 120;
				cor.drawRect(0, 0, 50, 120);
				cor.y = 620 - 120;
			}
			block.x = xc;
			xc +=cast block.width + 20;
			block.endFill();
			this.bc.addChild(block);
			this.blocks.push(block);
			
			this.cors.push(cor);
			cor.scale.y = 0;
		}
		//if(bc.width < 200)
		//	this.bc.x = Math.round((200 - bc.width) / 2);
		
		return xc+20;
	}
	public function testhit(x:Int, delta:Float):Void
	{
		if (x < this.x || x > this.width + this.x)
		 return;
		 var rm:Array<Graphics> = [];
		trace("test hit " + x);
		 for (i in 0...blocks.length)
		 {
			 var b:Graphics = blocks[i];
			if (this.x + b.x < x && this.x + b.width+b.x  > x)
			{
				trace("hits");
				var c:Graphics = blocks[i];
				if (untyped b.type == ".")
					b.scale.y = 0;
				else
				{
					b.scale.y -= delta * 0.15;
					b.y = 620 - b.height;
				}
				if (b.scale.y <= 0)
				{
					rm.push(b);
				}
			}
		 }
		 for (m in rm)
			blocks.remove(m);
	}
	
}

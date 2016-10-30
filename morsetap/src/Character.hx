package;
import createjs.tweenjs.Ease;
import createjs.tweenjs.Tween;
import pixi.core.display.Container;
import pixi.core.graphics.Graphics;

/**
 * ...
 * @author 
 */
class Character extends Container
{
	private var bg:Graphics;

	public function new() 
	{
		super();
		
		this.bg = new Graphics();
		this.bg.beginFill(Main.WHITE, 1);
		this.bg.lineStyle(2,Main.DARK1, 1);
		this.bg.moveTo(0, 0);
		this.bg.lineTo(0, 0);
		this.bg.lineTo(40, 40);
		this.bg.lineTo( -40, 40);
		
		this.bg.y = -25;
		this.bg.endFill();
		this.addChild(this.bg);
	}
	
	public function jump():Void
	{
		Tween.removeTweens(this.bg);
		this.bg.tint = 0x00FF00;
		//Tween.get(this.bg).to( { y:-25 }, 10,Ease.quadOut);
	}
	public function down():Void
	{
		Tween.removeTweens(this.bg);
		this.bg.tint = Main.HILIGHT;
		//Tween.get(this.bg).to( { y:20 }, 10,Ease.quadOut);
	}
	
}
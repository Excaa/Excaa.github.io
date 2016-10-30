package;
import createjs.easeljs.Ticker;
import js.Browser;
import js.html.CanvasElement;
import pixi.core.display.Container;
import pixi.core.renderers.Detector;
import pixi.core.renderers.SystemRenderer;

/**
 * ...
 * @author 
 */
@:expose("Main")
class Main
{
		
	public static var HILIGHT:Int =0xDC3522;
	public static var SURFACE:Int =0xD9CB9E;
	public static var DARK1:Int = 0x374140;
	public static var DARK2:Int = 0x2A2C2B;
	public static var DARK3:Int = 0x1E1E20;
	public static var WHITE:Int = 0xFFFFFF;
	public static var BLACK:Int = 0x000000;
	
	public static var instance:Main;
	static function main():Void
	{
	}
	
	public var renderer:SystemRenderer;
	public var canvas:CanvasElement;
	
	private var container:Container;
	private var gameView:GameView;
	
	public function new() 
	{
		initRenderer();
		this.initializeControls();
		this.resize();
		Browser.window.addEventListener("resize", resize);
	}
	
	private function initRenderer():Void
	{
		this.canvas = cast Browser.document.getElementById("game");
		var options:RenderingOptions = { };
		options.view = canvas;
		this.renderer = Detector.autoDetectRenderer(this.canvas.width, this.canvas.height, options);
	}
	
	private function resize():Void
	{
		var w:Int = Browser.window.innerWidth;
		var h:Int = Browser.window.innerHeight;
		
		var aspect:Float = 16 / 9;
		
		if (w > h * aspect)
			w = Math.round( h * aspect);
		if (h * aspect > w)
			h =Math.round( w / aspect);
		
		this.renderer.resize(w, h);
	//	this.container.width = w;
	//	this.container.height = h;
		this.container.scale.x = this.container.scale.y = w / 1280;
	}
	
	private function initializeControls():Void
	{
		this.container = new Container();
		
		Ticker.setFPS(60);
		Ticker.addEventListener("tick", ontick);
		
		this.gameView = new GameView();
		this.container.addChild(this.gameView);
	}
	
	private function ontick():Void
	{
		this.renderer.render(this.container);
		
		this.gameView.ontick(1);
	}
	
}
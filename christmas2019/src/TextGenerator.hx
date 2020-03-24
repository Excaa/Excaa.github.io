package;
import js.Browser;
import js.html.CanvasElement;
import js.html.CanvasRenderingContext2D;
import js.html.ImageData;

/**
 * ...
 * @author 
 */
class TextGenerator 
{
	private static var canvas:CanvasElement;
	private static var ctx:CanvasRenderingContext2D;
	
	
	public function new() 
	{
		
	}
	
	public static function getPoints(text:String, pointCount:Int):Array<Float>
	{
		if (canvas == null)
		{
			canvas = Browser.document.createCanvasElement();
			ctx = canvas.getContext2d();
			
			canvas.width = 256;
			canvas.height = 256;
		//Browser.document.body.appendChild(canvas);
		}
		
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.fillStyle = "#ff0000";
		//ctx.fillRect(0, 0, 100, 100);
		ctx.fillStyle = "#ffffff";
		
		ctx.font = '20px sans';
		var txt:Array<String> = text.split("\n");
		if (text.indexOf( "\\n") >= 0)
			txt = text.split("\\n");
		var c:Int = 0;
		ctx.textAlign = "center";
		for (t in txt)
		{
			ctx.fillText( t, 128, 80 + 24 * c, 256);
			c++;
		}
		
		var id:ImageData = ctx.getImageData(0, 0, 256, 256);
		
		var points:Array<Float> = [];
		var maxx:Int = 0;
		var maxy:Int = 0;
		var miny:Int = 256;
		var minx:Int = 256;
		for ( i in 0...id.height)
		{
			for ( j in 0...id.width)
			{
				if (id.data[ (i * id.width + j) * 4] > 100)
				{
					maxy = cast Math.max(i , maxx);
					maxx = cast Math.max(j , maxy);
					miny = cast Math.min(i , miny);
					minx = cast Math.min(j , minx);
					points.push( j );
					points.push( i);
				}
			}
		}
		
		for ( i in 0...Math.floor(points.length / 2))
		{
			points[i * 2] -= minx;
			points[i * 2 + 1] -= miny;
			
			points[i * 2] = points[i * 2] / (maxx - minx)- 0.5;
			points[i * 2+1] = 1-points[i * 2+1] / (maxy - miny)-0.75;
			
		}
		
		return points;
	}
	
}

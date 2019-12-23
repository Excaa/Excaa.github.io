package;
import haxe.Resource;
import js.Browser;
import js.html.CanvasElement;
import js.html.Float32Array;
import js.html.webgl.Buffer;
import js.html.webgl.Program;
import js.html.webgl.RenderingContext;
import js.html.webgl.UniformLocation;

/**
 * Based on https://github.com/pwambach/webgl2-particles
 * @author 
 */
@:expose("Main")
class Main
{
	public static var instance:Main;
	static function main():Void
	{
	}

	public var gl:RenderingContext;
	public var canvas:CanvasElement;
	
	private var mousePoint:Point = {x:0, y:0};
	
	private static var points:Int = 2000000;
	
	private var velocities:Float32Array;
	private var vertices:Float32Array;
	private var indices:Float32Array;
	private var vertexBuffers:Array<Buffer>;
	private var velocityBuffers:Array<Buffer>;
	private var indexBuffers:Array<Buffer>;
	private var feedbackProgram:Program;
	private var displayProgram:Program;
	
	private var feedbackVAO:Array<Dynamic> = [];
	private var displayVAO:Array<Dynamic> = [];
	
	private var transformFeedback:Dynamic;
	
	private var currentIndex:Int = 0;
	
	private var mouseLocation:UniformLocation;
	private var timeLocation:UniformLocation;
	
	public function new() 
	{
		if (Browser.location.hash.length > 0)
		{
			var p:Int = Std.parseInt( Browser.location.hash.substr(1));
			if (Std.is(p, Int))
				points = p;
		}
		instance = this;
		initRenderer();
		this.initializeControls();
		this.resize();
		Browser.window.addEventListener("resize", resize);
		/* Update mouse position */
		canvas.addEventListener('mousemove', function(event:Dynamic):Void {
		  mousePoint.x = event.clientX / canvas.width * 2 - 1;
		  mousePoint.y= (event.clientY / canvas.height * 2 - 1) * -1;
		});
		ontick(0);
	}
	
	private function initRenderer():Void
	{
		this.canvas = cast Browser.document.getElementById("game");
		this.gl = canvas.getContext("webgl2", {antialias:false});
		if (gl == null) Browser.window.alert("No webgl2 support");
		
		gl.enable(RenderingContext.BLEND);
		gl.blendFunc(RenderingContext.ONE, RenderingContext.ONE_MINUS_SRC_ALPHA);
		
		
	}
	
	private function resize():Void
	{
		var w:Int = Browser.window.innerWidth;
		var h:Int = Browser.window.innerHeight;
		
		var aspect:Float = 9 / 9;
		
		if (w > h * aspect)
			w = Math.round( h * aspect);
		if (h * aspect > w)
			h =Math.round( w / aspect);
		
		canvas.width = w;
		canvas.height = h;
		gl.viewport(0, 0, w, h);
	}
	
	private function initializeControls():Void
	{
		this.vertices = new Float32Array(points * 2);
		this.velocities = new Float32Array(points * 2); 
		this.indices = new Float32Array(points * 2);
		for ( i in 0...vertices.length)
		{
			vertices[i] = 0;// Math.random() * 2 - 1;
			velocities[i] = 0;
			indices[i] = i;
		}
		
		vertexBuffers = [
			GLUtil.createBufferFromArray(gl,vertices, RenderingContext.STATIC_DRAW),
			GLUtil.createBufferWithSize(gl, points*2*4, RenderingContext.STATIC_DRAW)
		];
		
		velocityBuffers = [
			GLUtil.createBufferFromArray(gl, velocities, RenderingContext.STATIC_DRAW),
			GLUtil.createBufferWithSize(gl, points*2*4, RenderingContext.STATIC_DRAW)
		];
		
		indexBuffers = [
			GLUtil.createBufferFromArray(gl, indices, RenderingContext.STATIC_DRAW),
			GLUtil.createBufferWithSize(gl, points*2*4, RenderingContext.STATIC_DRAW)
		];
		
		
		this.feedbackProgram = GLUtil.createProgram(gl, Resource.getString("calc.vert"), Resource.getString("empty.frag"),
		                                            ['v_position', 'v_velocity'], untyped gl.SEPARATE_ATTRIBS);
		
		this.displayProgram = GLUtil.createProgram(gl, Resource.getString("display.vert"), Resource.getString("display.frag"),
		                                           null, null);
		
		feedbackVAO.push( GLUtil.createVAO(gl, [
			{
				data:vertexBuffers[0],
				location: 0,
				elementSize: 2
			},
			{
				data:velocityBuffers[0],
				location: 1,
				elementSize:2
			}
			,
			{
				data:indexBuffers[0],
				location: 2,
				elementSize:2
			}
		]));
		
		feedbackVAO.push( GLUtil.createVAO(gl, [
			{
				data:vertexBuffers[1],
				location: 0,
				elementSize:2
			},
			{
				data:velocityBuffers[1],
				location:1,
				elementSize:2
			},
			{
				data:indexBuffers[0],
				location: 2,
				elementSize:2
			}
		]));
		
		displayVAO.push( GLUtil.createVAO(gl, [
			{
				data:vertexBuffers[0],
				location: 0,
				elementSize: 2
			},
			{
				data:velocityBuffers[0],
				location: 1,
				elementSize:2
			}
		]));
		
		displayVAO.push( GLUtil.createVAO(gl, [
			{
				data:vertexBuffers[1],
				location: 0,
				elementSize:2
			},
			{
				data:velocityBuffers[1],
				location: 1,
				elementSize:2
			}
		]));
		
		this.transformFeedback = untyped gl.createTransformFeedback();
		this.mouseLocation = gl.getUniformLocation(feedbackProgram, "u_mouse");
		this.timeLocation = gl.getUniformLocation(feedbackProgram, "time");
	}
	
	private function draw(vao:Dynamic):Void
	{
		untyped gl.bindVertexArray(vao);
		gl.drawArrays(RenderingContext.POINTS, 0, points);
	}
	
	private function calculateFeedback(currentIndex:Int,time:Float):Void
	{
		var invertedIndex:Int = (currentIndex + 1) % 2;
		gl.enable( untyped gl.RASTERIZER_DISCARD);
		untyped gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, transformFeedback);
		untyped gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, vertexBuffers[invertedIndex]);
		untyped gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 1, velocityBuffers[invertedIndex]);
		gl.useProgram(feedbackProgram);
		gl.uniform2fv(mouseLocation, [Math.sin(time*0.1)*0.2, Math.cos(time*0.1)*0.2]);
		gl.uniform1f(timeLocation, time);
		untyped gl.beginTransformFeedback(RenderingContext.POINTS);
		draw(feedbackVAO[currentIndex]);
		untyped gl.endTransformFeedback();
		
		/* Re-activate rasterizer for next draw calls */
		untyped gl.disable(gl.RASTERIZER_DISCARD);
		
		untyped gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, null);
		untyped gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 1, null);
	}
	
	private function ontick(t:Float):Void
	{
		
		var invertedIndex:Int = (currentIndex + 1) % 2;
		
		gl.clearColor(0.0, 0.0, 0.0, 1.0);
		gl.clear(RenderingContext.COLOR_BUFFER_BIT);
		
		calculateFeedback(currentIndex, t*0.01);
		
		gl.useProgram(displayProgram);
		draw(displayVAO[invertedIndex]);
		
		currentIndex = (currentIndex + 1) % 2;
		
		Browser.window.requestAnimationFrame(ontick);
		
	}
	
}

typedef Point={
	@:optional public var x:Float;
	@:optional public var y:Float;
};
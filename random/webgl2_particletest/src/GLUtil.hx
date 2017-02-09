package;
import js.html.webgl.Buffer;
import js.html.webgl.Program;
import js.html.webgl.RenderingContext;
import js.html.webgl.Shader;

/**
 * ...
 * @author ...
 */
class GLUtil 
{
	public static function createShader(gl:RenderingContext, source:String, type:Int):Shader
	{
		var shader:Shader = gl.createShader(type);
		gl.shaderSource(shader, source);
		gl.compileShader(shader);
		return shader;
	}
	
	public static function createProgram(gl:RenderingContext, vertex:String, fragment:String, varyings:Array<Dynamic>, feedbackType:Int):Program
	{
		var vert:Shader = createShader(gl, vertex, RenderingContext.VERTEX_SHADER);
		var frag:Shader = createShader(gl, fragment, RenderingContext.FRAGMENT_SHADER);
		var program:Program = gl.createProgram();
		gl.attachShader(program, vert);
		gl.attachShader(program, frag);
		
		//Flag the shaders to be deleted when they are no longer needed
		gl.deleteShader(vert);
		gl.deleteShader(frag);
		
		if (varyings != null && varyings.length > 0)
		{
			untyped gl.transformFeedbackVaryings(program, varyings, feedbackType);
		}
		gl.linkProgram(program);
		
		var failed:Bool = false;
		var log:String = gl.getProgramInfoLog(program);
		if (log.length > 0){
			trace("---Webgl program error---");
			trace(log);
			failed = true;
		}
		log = gl.getShaderInfoLog(vert);
		if (log.length > 0)
		{
			trace("---webgl shader error---");
			trace(log);
			failed = true;
		}
		log = gl.getShaderInfoLog(frag);
		if (log.length > 0)
		{
			trace("---webgl shader error---");
			trace(log);
			failed = true;
		}
		
		if (failed)
		{
			gl.deleteProgram(program);
			return null;
		}
		
		return program;
	}
	
	public static function createBufferFromArray(gl:RenderingContext, data:Dynamic, type:Int):Buffer
	{
		var buffer = gl.createBuffer();
		gl.bindBuffer(RenderingContext.ARRAY_BUFFER, buffer);
		gl.bufferData(RenderingContext.ARRAY_BUFFER, data, type);
		gl.bindBuffer(RenderingContext.ARRAY_BUFFER, null);
		
		return buffer;
	}
	
	public static function createBufferWithSize(gl:RenderingContext, size:Int, type:Int):Buffer
	{
		var buffer = gl.createBuffer();
		gl.bindBuffer(RenderingContext.ARRAY_BUFFER, buffer);
		gl.bufferData(RenderingContext.ARRAY_BUFFER, size, type);
		gl.bindBuffer(RenderingContext.ARRAY_BUFFER, null);
		
		return buffer;
	}
	
	public static function createVAO(gl:RenderingContext, buffers:Array<Dynamic>):Dynamic
	{
		var vao = untyped gl.createVertexArray();
		untyped gl.bindVertexArray(vao);
		for (buffer in buffers)
		{
			gl.bindBuffer(RenderingContext.ARRAY_BUFFER, buffer.data);
			gl.enableVertexAttribArray(buffer.location);
			gl.vertexAttribPointer(buffer.location, buffer.elementSize, RenderingContext.FLOAT, false, 0, 0);
		}
		
		gl.bindBuffer(RenderingContext.ARRAY_BUFFER, null);
		untyped gl.bindVertexArray(null);
		
		return vao;
	}
	
	public function new() 
	{
		
	}
	
}
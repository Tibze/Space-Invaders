# Spaceship

class Spaceship extends PIXI.MovieClip
	constructor:(textures,textures2,x,y) ->
		super(textures,textures2,x,y)
		@setPosition x,y
		@animationSpeed = 0.05
		@textures1 = textures
		@textures2 = textures2
		@defautPosX = x;
		@defautPosY = y;
	setPosition:(x,y) ->
		@position.x = x
		@position.y = y
	delay = (time, fn, context) ->
  	setTimeout fn, time, context
	die: ->
		@textures = @textures2
		@animationSpeed = 0.1
		@gotoAndPlay(0)
		delay 1000, @reset, @
		#@gotoAndStop(1)
	reset:(context) ->
		context.textures = context.textures1

# Spaceship Life

class SpaceshipLife extends PIXI.Sprite
	constructor:(texture) ->
		super(texture)
		@x = @position.x
		@y = @position.y
		@width = @texture.width
		@height = @texture.height
	setPosition:(x,y) ->
		@position.x = x
		@position.y = y


# Monster

class Monster extends PIXI.MovieClip
	constructor:(textures,textures2,points,x,y,type) ->
		super(textures,textures2,points,x,y,type)
		@type = type
		@points = points
		@setPosition x,y
		@animationSpeed = 0.04
		@play()
		@textures2 = textures2
	setPosition:(x,y) ->
		@position.x = x
		@position.y = y
	localToGlobal: ->
		obj = {}
		obj.x = @position.x + @parent.position.x
		obj.y = @position.y + @parent.position.y
		return obj
	die: ->
		if (@textures2)
			@textures = @textures2
			delay 50, @destroy, @
		if (!@textures2)
			@parent.removeChild @
	delay = (time, fn, context) ->
  	setTimeout fn, time, context
  destroy:(context) ->
  	context.parent.removeChild context
  	context = null

#bullet

class Bullet extends PIXI.Sprite
	constructor:(texture) ->
		super(texture)
		@x = @position.x
		@y = @position.y
		@width = @texture.width
		@height = @texture.height
	setPosition:(x,y) ->
		@position.x = x
		@position.y = y

# Line

class Line extends PIXI.DisplayObjectContainer
	constructor: ->
		super()
		@reverse = false

# Pont

class Bridge extends PIXI.DisplayObjectContainer
	constructor:(t1,t2,t3,t4,t5,t6,t7,t8,t9) ->
		super()
		b1 = new BridgeItem t1
		@addChild b1
		b2 = new BridgeItem t2
		b2.position.x = 14
		@addChild b2
		b3 = new BridgeItem t3
		b3.position.x = 28
		@addChild b3
		b4 = new BridgeItem t4
		b4.position.y = 11
		@addChild b4
		b5 = new BridgeItem t5
		b5.position.x = 14
		b5.position.y = 11
		@addChild b5
		b6 = new BridgeItem t6
		b6.position.x = 28
		b6.position.y = 11
		@addChild b6
		b7 = new BridgeItem t7
		b7.position.x = 0
		b7.position.y = 22
		@addChild b7
		b8 = new BridgeItem t8
		b8.position.x = 14
		b8.position.y = 22
		@addChild b8
		b9 = new BridgeItem t9
		b9.position.x = 28
		b9.position.y = 22
		@addChild b9

# Item Pont

class BridgeItem extends PIXI.MovieClip
	constructor:(textures) ->
		super(textures)
		@gotoAndStop(0)
		@count = 0
	localToGlobal: ->
		obj = {}
		obj.x = @position.x + @parent.position.x
		obj.y = @position.y + @parent.position.y
		return obj
	touch: ->
		@count++
		@gotoAndStop(1)
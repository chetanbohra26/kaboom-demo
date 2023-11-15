import kaboom from 'kaboom';

const FLOOR_HEIGHT = 48;
const JUMP_FORCE = 800;
const SPEED = 480;
const GRAVITY = 1600;

kaboom();

loadSprite('bean', 'sprites/bean.png');

scene('game', () => {
	setGravity(GRAVITY);

	//player character
	const player = add([sprite('bean'), pos(80, 40), area(), body()]);

	//platform base
	add([
		rect(width(), FLOOR_HEIGHT),
		pos(0, height()),
		outline(4),
		anchor('botleft'),
		area(),
		body({ isStatic: true }),
		color(255, 255, 100),
	]);

	//add jump functionality
	const jump = () => {
		player.isGrounded() && player.jump(JUMP_FORCE);
	};
	onKeyPress('space', jump);
	onClick(jump);

	function spawnTree() {
		add([
			rect(48, rand(24, 64)),
			area(),
			outline(4),
			pos(width(), height() - FLOOR_HEIGHT),
			anchor('botleft'),
			color(255, 0, 0),
			move(LEFT, SPEED),
			'tree',
		]);

		wait(rand(0.5, 1.5), spawnTree);
	}
	spawnTree();

	//game over on collision
	player.onCollide('tree', () => {
		//shake();
		go('lose', score);
		burp();
		addKaboom(player.pos);
	});

	//score functionality
	let score = 0;
	const scoreLabel = add([text(score), color(0, 0, 0), pos(24, 24)]);

	//add score as game goes on
	onUpdate(() => {
		score++;
		scoreLabel.text = score;
	});
});

scene('lose', (score) => {
	add([
		sprite('bean'),
		pos(width() / 2, height() / 2 - 80),
		scale(2),
		anchor('center'),
	]);

	//display score
	add([
		text(score),
		color(0, 0, 0),
		pos(width() / 2, height() / 2 + 80),
		scale(2),
		anchor('center'),
	]);

	//restart game
	onKeyPress('space', () => go('game'));
});

go('game');

function timeout(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

// Convert from degrees to radians.
const getRadians = function (degrees) {
	return (degrees * Math.PI) / 180;
};

// Convert from radians to degrees.
const getDegrees = function (radians) {
	return (radians * 180) / Math.PI;
};

class MazeRenderer {
	static wallColor = "#111111";
	static pathColor = "#f1f1f1";
	static finishColor = "#1111aa";

	static resolvePixelColor(inp) {
		let res;

		switch (inp) {
			case 0: {
				res = MazeRenderer.pathColor;
				break;
			}
			case 2: {
				res = MazeRenderer.finishColor;
				break;
			}
			case 1: {
				res = MazeRenderer.wallColor;
				break;
			}
		}

		return res;
	}

	static render(renderer, maze) {
		const { pixelSize, renderOffset } = renderer;

		//renderer.ctx.rotate(Solver.rotation);

		maze.forEach((row, rowIndex) => {
			row.forEach((colVal, colIndex) => {
				renderer.ctx.fillStyle = MazeRenderer.resolvePixelColor(colVal);

				renderer.ctx.fillRect(
					renderOffset + (colIndex + 1) * pixelSize,
					renderOffset + (rowIndex + 1) * pixelSize,
					pixelSize,
					pixelSize
				);
			});
		});
	}
}

class SolverRenderer {
	static solverColor = "#ff0000";

	static drawSolver(renderer, x, y) {
		const { pixelSize } = renderer;
		const scalar = 5;

		renderer.ctx.translate(x, y);
		renderer.ctx.rotate((Solver.rotation * Math.PI) / 180);
		renderer.ctx.translate(-x, -y);

		renderer.ctx.beginPath();
		renderer.ctx.moveTo(x, y - pixelSize / scalar);
		renderer.ctx.lineTo(x - pixelSize / scalar, y + pixelSize / scalar);
		renderer.ctx.lineTo(x + pixelSize / scalar, y + pixelSize / scalar);
		renderer.ctx.fill();

		//console.log(renderer.ctx.getTransform());

		renderer.ctx.setTransform(1, 0, 0, 1, 0, 0);
	}

	static render(renderer, sceneMap) {
		const { pixelSize, renderOffset } = renderer;

		renderer.ctx.fillStyle = this.solverColor;

		SolverRenderer.drawSolver(
			renderer,
			Solver.position[0] * pixelSize,
			Solver.position[1] * pixelSize
		);
	}
}

class Solver {
	static rotation = 0;
	static position = [];

	static setStartPosition() {
		Solver.position = [12, 12];
	}

	static calcNextPosition() {
		const [x, y] = Solver.position;

		const cx = Math.sin((Solver.rotation * Math.PI) / 180) * 0.01;
		const cy = Math.cos((Solver.rotation * Math.PI) / 180) * 0.01;

		return [x + cx, y - cy];
	}

	static go() {
		Solver.position = Solver.calcNextPosition();
	}

	static rotateLeft(degree) {
		Solver.rotation -= degree;
	}

	static checkIfWall() {
		const [x, y] = Solver.calcNextPosition();
		let res = false;

		if (Scene.sceneMap[Math.floor(y) - 1][Math.floor(x) - 1] == 1)
			res = true;

		return res;
	}

	static getAzymuthAngle() {
		const [x, y] = Solver.position;
		const finishPosition = [1, 0];

		const angle = Math.atan2(y - finishPosition[0], x - finishPosition[1]);

		return getDegrees(angle);
	}

	static rotateToAzymuth() {
		console.log("rotateToAzymuth", Solver.getAzymuthAngle());
		Solver.rotation = 0;
		Solver.rotateLeft(Solver.getAzymuthAngle());
	}

	static isFinish() {
		const [x, y] = Solver.position;
		let res = false;

		if (Scene.sceneMap[Math.floor(y) - 1][Math.floor(x) - 1] == 2)
			res = true;

		return res;
	}
}

class Scene {
	static sceneMap = [
		[1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
		[1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1],
		[1, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 0, 0, 1],
		[0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 1, 0, 1],
		[0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1],
		[1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 1, 1, 1],
		[1, 1, 0, 1, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1],
		[1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1],
		[1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 1],
		[1, 0, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 0, 1, 0, 0, 1],
		[1, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 1],
		[1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1],
		[1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 1, 1],
		[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	];

	static render(renderer) {
		MazeRenderer.render(renderer, Scene.sceneMap);
		SolverRenderer.render(renderer, Scene.sceneMap);
	}
}

class CanvasRenderer {
	static renderOffset = 0;
	static pixelSize = 40;
	static frameLength = 1;

	static windowResizeHandler() {
		CanvasRenderer.c.width = window.innerWidth;
		CanvasRenderer.c.height = window.innerHeight;
	}

	static init() {
		CanvasRenderer.c = document.getElementById("canv");
		CanvasRenderer.ctx = CanvasRenderer.c.getContext("2d");

		CanvasRenderer.windowResizeHandler();

		Solver.setStartPosition();
	}

	static rerenderScene() {
		CanvasRenderer.ctx.clearRect(
			0,
			0,
			CanvasRenderer.c.width,
			CanvasRenderer.c.height
		);

		Scene.render(CanvasRenderer);
	}

	static async renderAction(action) {
		CanvasRenderer.rerenderScene();
		action();
		await timeout(CanvasRenderer.frameLength);
	}

	static async renderLoop() {
		await CanvasRenderer.renderAction(Solver.rotateToAzymuth);

		while (!Solver.isFinish()) {
			if (Solver.checkIfWall()) {
				await CanvasRenderer.renderAction(Solver.rotateToAzymuth);

				let i = 0;
				do {
					await CanvasRenderer.renderAction(() =>
						Solver.rotateLeft(30)
					);
					i += 30;
				} while (Solver.checkIfWall() && i < 150);

				await CanvasRenderer.renderAction(Solver.rotateToAzymuth);

				let j = 0;
				do {
					await CanvasRenderer.renderAction(() =>
						Solver.rotateLeft(330)
					);
					j += 30;
				} while (Solver.checkIfWall() && j <= 180);

				await CanvasRenderer.renderAction(Solver.rotateToAzymuth);

				if (j <= i)
					await CanvasRenderer.renderAction(() => {
						Solver.rotateLeft(360 - j);
					});
				else
					await CanvasRenderer.renderAction(() =>
						Solver.rotateLeft(i)
					);
			} else {
				await CanvasRenderer.renderAction(Solver.go);
			}
		}
	}

	static async execute(el) {
		CanvasRenderer.init();

		//CanvasRenderer.renderLoop();
		CanvasRenderer.renderLoop();
	}
}

CanvasRenderer.execute();

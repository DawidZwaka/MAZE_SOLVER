const directions = {
	TOP: 0,
	LEFT: 1,
	BOTTOM: 2,
	RIGHT: 3,
};

function timeout(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

class MazeRenderer {
	static wallColor = "#111111";
	static pathColor = "#f1f1f1";

	static resolvePixelColor(inp) {
		let res;

		switch (inp) {
			case 0:
			case 2: {
				res = MazeRenderer.pathColor;
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

		renderer.ctx.beginPath();

		console.log(Solver.direction);

		switch (Solver.direction) {
			case directions.TOP: {
				renderer.ctx.moveTo(x + pixelSize / 2, y);
				renderer.ctx.lineTo(x + pixelSize, y + pixelSize);
				renderer.ctx.lineTo(x, y + pixelSize);
				break;
			}
			case directions.LEFT: {
				renderer.ctx.moveTo(x + pixelSize, y);
				renderer.ctx.lineTo(x, y + pixelSize / 2);
				renderer.ctx.lineTo(x + pixelSize, y + pixelSize);
				break;
			}
			case directions.BOTTOM: {
				renderer.ctx.moveTo(x, y);
				renderer.ctx.lineTo(x + pixelSize / 2, y + pixelSize);
				renderer.ctx.lineTo(x + pixelSize, y);
				break;
			}
			case directions.RIGHT: {
				renderer.ctx.moveTo(x, y);
				renderer.ctx.lineTo(x + pixelSize, y + pixelSize / 2);
				renderer.ctx.lineTo(x, y + pixelSize);
				break;
			}
		}

		renderer.ctx.fill();
	}

	static render(renderer, sceneMap) {
		const { pixelSize, renderOffset } = renderer;
		let flag = false;

		sceneMap.forEach((row, rowIndex) => {
			const inx = row.findIndex((val) => val === 2);

			if (inx !== -1) {
				renderer.ctx.fillStyle = this.solverColor;

				SolverRenderer.drawSolver(
					renderer,
					renderOffset + (inx + 1) * pixelSize,
					renderOffset + (rowIndex + 1) * pixelSize
				);
			}
		});
	}
}

class Solver {
	static direction = directions.TOP;

	static getPosition() {
		let position = -1;

		Scene.sceneMap.forEach((row, rowIndex) => {
			const inx = row.findIndex((col) => col === 2);

			if (inx !== -1) position = [rowIndex, inx];
		});

		return position;
	}

	static go() {
		const [x, y] = Solver.getPosition();

		Scene.sceneMap[x][y] = 0;

		switch (Solver.direction) {
			case directions.TOP: {
				Scene.sceneMap[x - 1][y] = 2;
				break;
			}
			case directions.LEFT: {
				Scene.sceneMap[x][y - 1] = 2;
				break;
			}
			case directions.BOTTOM: {
				Scene.sceneMap[x + 1][y] = 2;
				break;
			}
			case directions.RIGHT: {
				Scene.sceneMap[x][y + 1] = 2;
				break;
			}
		}

		console.log(Scene.sceneMap);
	}

	static rotateLeft90() {
		let nextDirection = Solver.direction + 1;

		if (nextDirection > 3) nextDirection = 4 % nextDirection;

		Solver.direction = nextDirection;
	}

	static checkIfWall() {
		const [x, y] = Solver.getPosition();
		let mapPixel;
		let res = false;

		switch (Solver.direction) {
			case directions.TOP: {
				mapPixel = Scene.sceneMap[x - 1][y];
				break;
			}
			case directions.LEFT: {
				mapPixel = Scene.sceneMap[x][y - 1];
				break;
			}
			case directions.BOTTOM: {
				mapPixel = Scene.sceneMap[x + 1][y];
				break;
			}
			case directions.RIGHT: {
				mapPixel = Scene.sceneMap[x][y + 1];
				break;
			}
		}

		if (mapPixel === 1) res = true;

		return res;
	}
}

class Scene {
	static sceneMap = [
		[1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
		[1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1],
		[1, 0, 1, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1],
		[1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1],
		[1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1],
		[1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 1],
		[1, 0, 1, 0, 1, 0, 0, 0, 1, 1, 1, 0, 1],
		[1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1],
		[1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 2, 1],
		[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	];

	static render(renderer) {
		MazeRenderer.render(renderer, Scene.sceneMap);
		SolverRenderer.render(renderer, Scene.sceneMap);
	}
}

class CanvasRenderer {
	static renderOffset = 0;
	static pixelSize = 40;
	static frameLength = 300;

	static windowResizeHandler() {
		CanvasRenderer.c.width = window.innerWidth;
		CanvasRenderer.c.height = window.innerHeight;
	}

	static init() {
		CanvasRenderer.c = document.getElementById("canv");
		CanvasRenderer.ctx = CanvasRenderer.c.getContext("2d");

		CanvasRenderer.windowResizeHandler();
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

	static async renderLoop() {
		CanvasRenderer.rerenderScene();
		Solver.rotateLeft90();
		await timeout(CanvasRenderer.frameLength);

		if (Solver.checkIfWall()) {
			CanvasRenderer.rerenderScene();
			Solver.rotateLeft90();
			await timeout(CanvasRenderer.frameLength);

			CanvasRenderer.rerenderScene();
			Solver.rotateLeft90();
			await timeout(CanvasRenderer.frameLength);
		} else {
			CanvasRenderer.rerenderScene();
			Solver.go();
			await timeout(CanvasRenderer.frameLength);
		}

		CanvasRenderer.renderLoop();
	}

	static execute(el) {
		CanvasRenderer.init();

		//CanvasRenderer.renderLoop(el);
		//CanvasRenderer.renderLoop(el);
		//setInterval(() => CanvasRenderer.renderLoop(el), 1000);
		CanvasRenderer.renderLoop();
	}
}

CanvasRenderer.execute();

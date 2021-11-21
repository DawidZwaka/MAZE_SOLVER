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

	static drawSolver(renderer, x, y, direction = "top") {
		const { pixelSize, renderOffset } = renderer;

		renderer.ctx.moveTo(x + pixelSize / 2, y);

		renderer.ctx.lineTo(x + pixelSize, y + pixelSize);
		renderer.ctx.lineTo(x, y + pixelSize);

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
		MazeRenderer.render(renderer, this.sceneMap);
		SolverRenderer.render(renderer, this.sceneMap);
	}
}

class CanvasRenderer {
	static renderOffset = 0;
	static pixelSize = 40;

	static windowResizeHandler() {
		CanvasRenderer.c.width = window.innerWidth;
		CanvasRenderer.c.height = window.innerHeight;
	}

	static init() {
		CanvasRenderer.c = document.getElementById("canv");
		CanvasRenderer.ctx = CanvasRenderer.c.getContext("2d");

		CanvasRenderer.windowResizeHandler();
	}

	static renderLoop(el) {
		el.render();

		requestAnimationFrame(CanvasRenderer.renderLoop);
	}

	static execute(el) {
		CanvasRenderer.init();

		//window.addEventListener("resize", CanvasRenderer.windowResizeHandler);

		CanvasRenderer.renderLoop(el);
	}
}

CanvasRenderer.execute(Scene);

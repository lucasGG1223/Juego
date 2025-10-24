class Snake {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Configuración del canvas
        this.canvas.width = 400;
        this.canvas.height = 400;
        
        // Tamaño de cada celda
        this.gridSize = 20;
        
        // Estado inicial del juego
        this.reset();
        
        // Eventos
        document.getElementById('startButton').addEventListener('click', () => this.start());
        document.getElementById('restartButton').addEventListener('click', () => this.reset());
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
    }

    reset() {
        // Posición inicial de la serpiente
        this.snake = [{x: 5, y: 5}];
        this.direction = 'right';
        this.food = this.generateFood();
        this.score = 0;
        this.gameOver = false;
        this.gameStarted = false;
        this.updateScore();
        this.draw();
    }

    start() {
        if (!this.gameStarted && !this.gameOver) {
            this.gameStarted = true;
            this.gameLoop();
        }
    }

    generateFood() {
        const x = Math.floor(Math.random() * (this.canvas.width / this.gridSize));
        const y = Math.floor(Math.random() * (this.canvas.height / this.gridSize));
        return {x, y};
    }

    update() {
        if (!this.gameStarted || this.gameOver) return;

        // Nueva posición de la cabeza
        const head = {...this.snake[0]};
        switch(this.direction) {
            case 'up': head.y--; break;
            case 'down': head.y++; break;
            case 'left': head.x--; break;
            case 'right': head.x++; break;
        }

        // Verificar colisiones con paredes
        if (head.x < 0 || head.x >= this.canvas.width / this.gridSize ||
            head.y < 0 || head.y >= this.canvas.height / this.gridSize) {
            this.gameOver = true;
            return;
        }

        // Verificar colisiones con la serpiente
        if (this.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            this.gameOver = true;
            return;
        }

        // Añadir nueva cabeza
        this.snake.unshift(head);

        // Verificar si come la comida
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            this.updateScore();
            this.food = this.generateFood();
        } else {
            this.snake.pop();
        }
    }

    draw() {
        // Limpiar canvas
        this.ctx.fillStyle = '#2c3e50';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Dibujar serpiente
        this.ctx.fillStyle = '#2ecc71';
        this.snake.forEach(segment => {
            this.ctx.fillRect(
                segment.x * this.gridSize,
                segment.y * this.gridSize,
                this.gridSize - 1,
                this.gridSize - 1
            );
        });

        // Dibujar comida
        this.ctx.fillStyle = '#e74c3c';
        this.ctx.fillRect(
            this.food.x * this.gridSize,
            this.food.y * this.gridSize,
            this.gridSize - 1,
            this.gridSize - 1
        );

        // Mostrar mensaje de Game Over
        if (this.gameOver) {
            this.ctx.fillStyle = '#fff';
            this.ctx.font = '30px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('¡Game Over!', this.canvas.width / 2, this.canvas.height / 2);
        }
    }

    handleKeyPress(event) {
        if (!this.gameStarted) return;

        switch(event.key) {
            case 'ArrowUp':
                if (this.direction !== 'down') this.direction = 'up';
                break;
            case 'ArrowDown':
                if (this.direction !== 'up') this.direction = 'down';
                break;
            case 'ArrowLeft':
                if (this.direction !== 'right') this.direction = 'left';
                break;
            case 'ArrowRight':
                if (this.direction !== 'left') this.direction = 'right';
                break;
        }
    }

    updateScore() {
        document.getElementById('score').textContent = this.score;
    }

    gameLoop() {
        if (!this.gameOver && this.gameStarted) {
            this.update();
            this.draw();
            setTimeout(() => this.gameLoop(), 100);
        }
    }
}

// Iniciar el juego cuando se carga la página
window.onload = () => {
    new Snake();
};
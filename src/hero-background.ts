/**
 * @file hero-background.ts
 * @description 数学生成背景 - 基于Langton's Ant规则的背景图案
 * @version 1.0
 */

class HeroBackground {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private animationId: number | null = null;
  private grid: boolean[][];
  private gridSize: number = 15;
  private cols: number;
  private rows: number;

  constructor(canvasId: string) {
    this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!this.canvas) {
      throw new Error(`Canvas element with id '${canvasId}' not found`);
    }

    this.ctx = this.canvas.getContext('2d')!;
    if (!this.ctx) {
      throw new Error('Could not get 2D context from canvas');
    }

    this.resize();
    this.initGrid();
    this.generatePattern();
    this.startAnimation();

    // 监听窗口大小变化
    window.addEventListener('resize', () => this.handleResize());
  }

  /**
   * 初始化网格
   */
  private initGrid(): void {
    this.cols = Math.floor(this.canvas.width / this.gridSize);
    this.rows = Math.floor(this.canvas.height / this.gridSize);
    this.grid = Array(this.rows)
      .fill(null)
      .map(() => Array(this.cols).fill(false));
  }

  /**
   * 调整画布大小
   */
  private resize(): void {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  /**
   * 处理窗口大小变化
   */
  private handleResize(): void {
    this.resize();
    this.initGrid();
    this.generatePattern();
  }

  /**
   * 基于简化Langton's Ant规则生成图案
   */
  private generatePattern(): void {
    // 清空画布
    this.ctx.fillStyle = '#f5f5f5';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // 生成多个蚂蚁的路径
    const antCount = 3;
    for (let i = 0; i < antCount; i++) {
      this.simulateAnt(
        Math.floor(Math.random() * this.cols),
        Math.floor(Math.random() * this.rows),
        Math.floor(Math.random() * 4)
      );
    }

    // 添加一些随机装饰点
    this.addDecorationPoints();
  }

  /**
   * 模拟简化的Langton's Ant
   */
  private simulateAnt(startX: number, startY: number, startDirection: number): void {
    let x = startX;
    let y = startY;
    let direction = startDirection; // 0: 上, 1: 右, 2: 下, 3: 左
    const steps = 200; // 每个蚂蚁的步数

    for (let step = 0; step < steps; step++) {
      // 边界检查
      if (x < 0 || x >= this.cols || y < 0 || y >= this.rows) break;

      // 简化的Langton's Ant规则
      const isWhite = this.grid[y][x];

      if (isWhite) {
        // 白色格子：右转，然后变黑
        direction = (direction + 1) % 4;
        this.grid[y][x] = false;
        this.drawCell(x, y, 0.3); // 淡色
      } else {
        // 黑色格子：左转，然后变白
        direction = (direction + 3) % 4;
        this.grid[y][x] = true;
        this.drawCell(x, y, 0.8); // 亮色
      }

      // 移动蚂蚁
      switch (direction) {
        case 0:
          y--;
          break; // 上
        case 1:
          x++;
          break; // 右
        case 2:
          y++;
          break; // 下
        case 3:
          x--;
          break; // 左
      }
    }
  }

  /**
   * 绘制单个格子
   */
  private drawCell(x: number, y: number, opacity: number): void {
    const pixelX = x * this.gridSize;
    const pixelY = y * this.gridSize;

    // 使用Terminal绿色调
    const green = Math.floor(255 * opacity);
    const red = Math.floor(50 * opacity);
    const blue = Math.floor(98 * opacity);

    this.ctx.fillStyle = `rgba(${red}, ${green}, ${blue}, ${opacity * 0.6})`;
    this.ctx.fillRect(pixelX, pixelY, this.gridSize - 1, this.gridSize - 1);

    // 添加发光效果
    if (opacity > 0.7) {
      this.ctx.shadowBlur = 5;
      this.ctx.shadowColor = `rgba(0, 255, 98, ${opacity * 0.3})`;
      this.ctx.fillRect(pixelX, pixelY, this.gridSize - 1, this.gridSize - 1);
      this.ctx.shadowBlur = 0;
    }
  }

  /**
   * 添加装饰点
   */
  private addDecorationPoints(): void {
    const pointCount = Math.floor((this.canvas.width * this.canvas.height) / 50000);

    for (let i = 0; i < pointCount; i++) {
      const x = Math.random() * this.canvas.width;
      const y = Math.random() * this.canvas.height;
      const size = Math.random() * 3 + 1;
      const opacity = Math.random() * 0.5 + 0.1;

      this.ctx.fillStyle = `rgba(0, 255, 98, ${opacity})`;
      this.ctx.beginPath();
      this.ctx.arc(x, y, size, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  /**
   * 开始动画（缓慢脉动效果）
   */
  private startAnimation(): void {
    let time = 0;

    const animate = () => {
      time += 0.01;

      // 缓慢改变整体透明度，创造呼吸感
      const pulseOpacity = 0.3 + Math.sin(time) * 0.1;
      this.canvas.style.opacity = pulseOpacity.toString();

      this.animationId = requestAnimationFrame(animate);
    };

    animate();
  }

  /**
   * 停止动画
   */
  public stop(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    window.removeEventListener('resize', () => this.handleResize());
  }

  /**
   * 重新生成图案
   */
  public regenerate(): void {
    this.initGrid();
    this.generatePattern();
  }
}

export default HeroBackground;

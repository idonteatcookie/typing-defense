import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  seed: number;
}

// 简易 FBM 噪声（多频正弦叠加），用于火焰水平扰动
function turbulence(seed: number, t: number): number {
  return (
    Math.sin(t * 2.0 + seed) * 0.5 +
    Math.sin(t * 3.7 + seed * 2.3) * 0.3 +
    Math.sin(t * 6.1 + seed * 4.7) * 0.2
  );
}

export default function FrenzyFire() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.clientWidth;
    let height = canvas.clientHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const flames: Particle[] = [];
    const smokes: Particle[] = [];

    const MAX_FLAMES = 110;
    const MAX_SMOKE = 18;

    const spawnFlame = () => {
      flames.push({
        x: Math.random() * width,
        y: height + 2,
        vx: (Math.random() - 0.5) * 0.5,
        vy: -1.3 - Math.random() * 1.3,
        life: 0,
        maxLife: 58 + Math.random() * 42,
        size: 22 + Math.random() * 22,
        seed: Math.random() * 1000,
      });
    };

    const spawnSmoke = () => {
      smokes.push({
        x: Math.random() * width,
        y: height - 12,
        vx: (Math.random() - 0.5) * 0.25,
        vy: -0.3 - Math.random() * 0.4,
        life: 0,
        maxLife: 110 + Math.random() * 70,
        size: 6 + Math.random() * 10,
        seed: Math.random() * 1000,
      });
    };

    let lastTime = performance.now();
    let frame = 0;

    const animate = (now: number) => {
      // delta time（按 60fps 标准化）
      const dt = Math.min((now - lastTime) / 16.67, 2);
      lastTime = now;
      frame++;
      const t = now * 0.001;

      // 生成新粒子（每帧多个，密集）
      for (let i = 0; i < 3; i++) {
        if (flames.length < MAX_FLAMES) spawnFlame();
      }
      if (frame % 6 === 0 && smokes.length < MAX_SMOKE) spawnSmoke();

      // 清空画布
      ctx.globalCompositeOperation = 'source-over';
      ctx.clearRect(0, 0, width, height);

      // === 1. 烟雾层（普通混合） ===
      ctx.globalCompositeOperation = 'source-over';
      for (let i = smokes.length - 1; i >= 0; i--) {
        const p = smokes[i];
        p.life += dt;
        const n = turbulence(p.seed, t * 0.6);
        p.vx += n * 0.02;
        p.vx *= 0.99;
        p.vy *= 0.995;
        p.x += p.vx * dt;
        p.y += p.vy * dt;

        const r = p.life / p.maxLife;
        if (r >= 1) {
          smokes.splice(i, 1);
          continue;
        }

        const alpha =
          r < 0.25 ? (r / 0.25) * 0.15 : 0.15 * (1 - (r - 0.25) / 0.75);
        const size = p.size * (1 + r * 1.4);

        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, size);
        grad.addColorStop(0, `rgba(35,28,28,${alpha})`);
        grad.addColorStop(1, `rgba(35,28,28,0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fill();
      }

      // === 2. 火焰主体（加法混合，发光） ===
      ctx.globalCompositeOperation = 'lighter';
      for (let i = flames.length - 1; i >= 0; i--) {
        const p = flames[i];
        p.life += dt;
        const n = turbulence(p.seed, t);
        p.vx += n * 0.06;
        p.vx *= 0.97;
        p.vy *= 0.992;
        p.x += p.vx * dt;
        p.y += p.vy * dt;

        const r = p.life / p.maxLife;
        if (r >= 1 || p.y < -p.size) {
          flames.splice(i, 1);
          continue;
        }

        // 颜色随生命变化：白 → 黄 → 橙 → 红 → 暗红
        let cr: number, cg: number, cb: number;
        if (r < 0.12) {
          const k = r / 0.12;
          cr = 255; cg = 245 + k * 10; cb = 200 + k * 40;
        } else if (r < 0.35) {
          const k = (r - 0.12) / 0.23;
          cr = 255; cg = 255 - k * 80; cb = 240 - k * 200;
        } else if (r < 0.7) {
          const k = (r - 0.35) / 0.35;
          cr = 255; cg = 175 - k * 120; cb = 40 - k * 40;
        } else {
          const k = (r - 0.7) / 0.3;
          cr = 255 - k * 130; cg = 55 - k * 50; cb = 0;
        }

        // 透明度：快速上升，缓慢消退
        let alpha: number;
        if (r < 0.08) {
          alpha = (r / 0.08) * 0.85;
        } else if (r < 0.65) {
          alpha = 0.85;
        } else {
          alpha = 0.85 * (1 - (r - 0.65) / 0.35);
        }

        // 尺寸：先涨后缩
        const sizeFactor =
          r < 0.3 ? 0.5 + (r / 0.3) * 0.8 : 1.3 - ((r - 0.3) / 0.7) * 0.7;
        const size = p.size * sizeFactor;

        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, size);
        grad.addColorStop(0, `rgba(${cr | 0},${cg | 0},${cb | 0},${alpha})`);
        grad.addColorStop(
          0.4,
          `rgba(${cr | 0},${cg | 0},${cb | 0},${alpha * 0.4})`
        );
        grad.addColorStop(1, `rgba(${cr | 0},${cg | 0},${cb | 0},0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fill();
      }

      // === 3. 底部热辐射光晕 ===
      ctx.globalCompositeOperation = 'lighter';
      const glow = ctx.createLinearGradient(0, height, 0, height - 60);
      glow.addColorStop(0, 'rgba(255,120,40,0.35)');
      glow.addColorStop(0.5, 'rgba(255,80,20,0.15)');
      glow.addColorStop(1, 'rgba(255,40,0,0)');
      ctx.fillStyle = glow;
      ctx.fillRect(0, height - 60, width, 60);

      // === 4. 顶部淡出遮罩（消除明显边界） ===
      ctx.globalCompositeOperation = 'destination-out';
      const topFade = ctx.createLinearGradient(0, 0, 0, height * 0.6);
      topFade.addColorStop(0, 'rgba(0,0,0,1)');
      topFade.addColorStop(0.3, 'rgba(0,0,0,0.85)');
      topFade.addColorStop(0.55, 'rgba(0,0,0,0.4)');
      topFade.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = topFade;
      ctx.fillRect(0, 0, width, height * 0.6);

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', resize);
      flames.length = 0;
      smokes.length = 0;
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '110px',
        pointerEvents: 'none',
        zIndex: 7,
      }}
    />
  );
}

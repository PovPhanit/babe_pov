
    const canvas = document.getElementById('backgroundCanvas');
    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const dots = [];
    const numDots = 90;
    const connectionDistance = 90;
    const escapeDistance = 40;
    const colors = ['#00f7ff', '#ff00e6', '#ffff00', '#00ff6e', '#ff6e40'];

    for (let i = 0; i < numDots; i++) {
      dots.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 2 + 1
      });
    }

    let mouse = { x: null, y: null };

    canvas.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    canvas.addEventListener('mouseout', () => {
      mouse.x = null;
      mouse.y = null;
    });

    canvas.addEventListener('click', (e) => {
      const centerX = e.clientX;
      const centerY = e.clientY;

      for (let i = 0; i < 10; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 1.5 + 0.5;
        dots.push({
          x: centerX,
          y: centerY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 2 + 1
        });
      }
    });

    function animate() {
      // Create trail/fade effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw connection lines
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const dx = dots[i].x - dots[j].x;
          const dy = dots[i].y - dots[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < connectionDistance) {
            ctx.beginPath();
            ctx.moveTo(dots[i].x, dots[i].y);
            ctx.lineTo(dots[j].x, dots[j].y);
            ctx.strokeStyle = dots[i].color;
            ctx.globalAlpha = 1 - dist / connectionDistance;
            ctx.lineWidth = 0.8;
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
      }

      // Update and draw each dot
      for (let dot of dots) {
        if (mouse.x !== null && mouse.y !== null) {
          const dx = dot.x - mouse.x;
          const dy = dot.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < escapeDistance) {
            const angle = Math.atan2(dy, dx);
            dot.vx += Math.cos(angle) * 0.5;
            dot.vy += Math.sin(angle) * 0.5;
          }
        }

        dot.x += dot.vx;
        dot.y += dot.vy;

        // Bounce off edges
        if (dot.x < 0 || dot.x > canvas.width) dot.vx *= -1;
        if (dot.y < 0 || dot.y > canvas.height) dot.vy *= -1;

        // Draw the dot
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.size || 2, 0, Math.PI * 2);
        ctx.fillStyle = dot.color;
        ctx.fill();
      }

      requestAnimationFrame(animate);
    }

    animate();


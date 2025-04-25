document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('backgroundCanvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    const dots = [];
    const maxDots = 150;
    const connectionDistance = 180;
    let mouseX = null;
    let mouseY = null;
    
    // Vibrant multi-color palette
    const colors = [
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFBE0B', 
        '#FB5607', '#8338EC', '#3A86FF', '#FF006E',
        '#A5DD9B', '#F9C74F', '#90BE6D', '#43AA8B'
    ];
    
    function createDot(x, y, colorIndex) {
        const color = colors[colorIndex || Math.floor(Math.random() * colors.length)];
        return {
            x: x || Math.random() * canvas.width,
            y: y || Math.random() * canvas.height,
            vx: Math.random() * 1.5 - 0.75,
            vy: Math.random() * 1.5 - 0.75,
            radius: 3 + Math.random() * 4,
            color: color,
            originalColor: color,
            pulseSpeed: 0.01 + Math.random() * 0.03,
            pulsePhase: Math.random() * Math.PI * 2
        };
    }
    
    // Mouse interaction
    canvas.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    canvas.addEventListener('mouseout', function() {
        mouseX = null;
        mouseY = null;
    });
    
    canvas.addEventListener('click', function(e) {
        // Create a cluster of dots in different colors
        const colorStart = Math.floor(Math.random() * (colors.length - 3));
        for (let i = 0; i < 8; i++) {
            const angle = Math.random() * Math.PI * 2;
            const distance = 10 + Math.random() * 40;
            const dot = createDot(
                e.clientX + Math.cos(angle) * distance,
                e.clientY + Math.sin(angle) * distance,
                (colorStart + i) % colors.length
            );
            dot.vx = Math.cos(angle) * 2;
            dot.vy = Math.sin(angle) * 2;
            dots.push(dot);
        }
        if (dots.length > maxDots) {
            dots.splice(0, dots.length - maxDots);
        }
    });
    
    function animate() {
        // Clear with subtle fade effect
        ctx.fillStyle = 'rgba(15, 20, 30, 0.2)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Update dots
        const time = Date.now() * 0.001;
        dots.forEach(dot => {
            // Pulsing effect
            dot.pulsePhase += dot.pulseSpeed;
            const pulseFactor = 0.8 + Math.sin(dot.pulsePhase) * 0.2;
            
            // Move dot
            dot.x += dot.vx;
            dot.y += dot.vy;
            
            // Mouse repulsion (creates interactive space)
            if (mouseX && mouseY) {
                const dx = mouseX - dot.x;
                const dy = mouseY - dot.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 120) {
                    const force = (120 - distance) * 0.0005;
                    dot.vx -= dx * force;
                    dot.vy -= dy * force;
                }
            }
            
            // Bounce off walls with damping
            if (dot.x < 0 || dot.x > canvas.width) {
                dot.vx *= -0.7;
                dot.x = dot.x < 0 ? 0 : canvas.width;
            }
            if (dot.y < 0 || dot.y > canvas.height) {
                dot.vy *= -0.7;
                dot.y = dot.y < 0 ? 0 : canvas.height;
            }
            
            // Apply friction
            dot.vx *= 0.97;
            dot.vy *= 0.97;
            
            // Draw dot with pulsing effect
            const currentRadius = dot.radius * pulseFactor;
            ctx.beginPath();
            ctx.arc(dot.x, dot.y, currentRadius * 1.8, 0, Math.PI * 2);
            ctx.fillStyle = dot.color + '33'; // Add transparency
            ctx.fill();
            
            ctx.beginPath();
            ctx.arc(dot.x, dot.y, currentRadius, 0, Math.PI * 2);
            ctx.fillStyle = dot.color;
            ctx.fill();
        });
        
        // Draw connections
        for (let i = 0; i < dots.length; i++) {
            for (let j = i + 1; j < dots.length; j++) {
                const dx = dots[i].x - dots[j].x;
                const dy = dots[i].y - dots[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < connectionDistance) {
                    const opacity = 1 - distance / connectionDistance;
                    ctx.beginPath();
                    ctx.moveTo(dots[i].x, dots[i].y);
                    ctx.lineTo(dots[j].x, dots[j].y);
                    
                    // Create gradient between the two dot colors
                    const gradient = ctx.createLinearGradient(
                        dots[i].x, dots[i].y, dots[j].x, dots[j].y
                    );
                    gradient.addColorStop(0, dots[i].color + Math.floor(opacity * 255).toString(16).padStart(2, '0'));
                    gradient.addColorStop(1, dots[j].color + Math.floor(opacity * 255).toString(16).padStart(2, '0'));
                    
                    ctx.strokeStyle = gradient;
                    ctx.lineWidth = 0.5 + opacity * 2;
                    ctx.stroke();
                }
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    // Create initial dots in a grid pattern with different colors
    const gridSize = 8;
    const spacingX = canvas.width / (gridSize + 1);
    const spacingY = canvas.height / (gridSize + 1);
    
    for (let x = 1; x <= gridSize; x++) {
        for (let y = 1; y <= gridSize; y++) {
            // Skip some dots to create a more interesting pattern
            if (Math.random() > 0.3) {
                const dot = createDot(
                    x * spacingX + (Math.random() - 0.5) * spacingX * 0.5,
                    y * spacingY + (Math.random() - 0.5) * spacingY * 0.5,
                    (x + y) % colors.length
                );
                // Give some initial motion
                dot.vx = (Math.random() - 0.5) * 2;
                dot.vy = (Math.random() - 0.5) * 2;
                dots.push(dot);
            }
        }
    }
    
    animate();
});
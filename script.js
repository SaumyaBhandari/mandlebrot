const canvas = document.getElementById('mandelbrotCanvas');
        const ctx = canvas.getContext('2d');

        let centerX = 0;
        let centerY = 0;
        let scale = 150;
        let maxIterations = 100000;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        function drawMandelbrot() {
            const imageData = ctx.createImageData(canvas.width, canvas.height);
            const data = imageData.data;

            for (let y = 0; y < canvas.height; y++) {
                for (let x = 0; x < canvas.width; x++) {
                    const index = (y * canvas.width + x) * 4;

                    const realPart = (x - canvas.width / 2 + centerX) / scale;
                    const imagPart = (y - canvas.height / 2 + centerY) / scale;

                    let zReal = realPart;
                    let zImag = imagPart;

                    let iteration = 0;

                    while (zReal * zReal + zImag * zImag < 4 && iteration < maxIterations) {
                        const tempReal = zReal * zReal - zImag * zImag + realPart;
                        const tempImag = 2 * zReal * zImag + imagPart;

                        zReal = tempReal;
                        zImag = tempImag;

                        iteration++;
                    }

                    const hue = (iteration / maxIterations) * 360;
                    const saturation = 100;
                    const lightness = (iteration / maxIterations) * 50 + 50;

                    const rgb = hslToRgb(hue, saturation, lightness);

                    data[index] = rgb[0];
                    data[index + 1] = rgb[1];
                    data[index + 2] = rgb[2];
                    data[index + 3] = 255;  // Alpha channel
                }
            }

            ctx.putImageData(imageData, 0, 0);
        }

        function hslToRgb(h, s, l) {
            h /= 360;
            s /= 100;
            l /= 100;
            let r, g, b;

            if (s === 0) {
                r = g = b = l;
            } else {
                const hueToRgb = (p, q, t) => {
                    if (t < 0) t += 1;
                    if (t > 1) t -= 1;
                    if (t < 1 / 6) return p + (q - p) * 6 * t;
                    if (t < 1 / 2) return q;
                    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                    return p;
                };

                const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                const p = 2 * l - q;

                r = hueToRgb(p, q, h + 1 / 3);
                g = hueToRgb(p, q, h);
                b = hueToRgb(p, q, h - 1 / 3);
            }

            return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
        }

        window.addEventListener('wheel', (event) => {
            const delta = Math.sign(event.deltaY);
            scale *= delta > 0 ? 1.1 : 0.9;
            drawMandelbrot();
        });

        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            drawMandelbrot();
        });

        drawMandelbrot();

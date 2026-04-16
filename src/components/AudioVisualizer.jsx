import { useEffect, useRef, useCallback } from 'react';

export function AudioVisualizer({ audioRef, isPlaying }) {
  const canvasRef = useRef(null);
  const audioCtxRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    if (!audioRef.current) return;

    // Initialize only once per audio element
    if (!audioCtxRef.current) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtxRef.current = new AudioContext();
      analyserRef.current = audioCtxRef.current.createAnalyser();

      // Connect it
      sourceRef.current = audioCtxRef.current.createMediaElementSource(audioRef.current);
      sourceRef.current.connect(analyserRef.current);
      analyserRef.current.connect(audioCtxRef.current.destination);

      analyserRef.current.fftSize = 64;
      analyserRef.current.smoothingTimeConstant = 0.8;
    }
  }, [audioRef]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !analyserRef.current) return;

    const ctx = canvas.getContext('2d');
    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const render = () => {
      animationRef.current = requestAnimationFrame(render);
      analyser.getByteFrequencyData(dataArray);

      // Use devicePixelRatio for crisp rendering
      const dpr = window.devicePixelRatio || 1;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);

      ctx.clearRect(0, 0, width, height);

      const barCount = 16;
      const totalGap = (barCount - 1) * 2;
      const barWidth = (width - totalGap) / barCount;
      const maxHeight = height;

      for (let i = 0; i < barCount; i++) {
        const dataIndex = Math.floor((i / barCount) * bufferLength);
        const value = dataArray[dataIndex] / 255;
        const barHeight = Math.max(2, value * maxHeight);

        // Gradient from primary green to cyan
        const hue = 150 + (i / barCount) * 30;
        const opacity = 0.4 + value * 0.6;
        ctx.fillStyle = `hsla(${hue}, 80%, 55%, ${opacity})`;

        const x = i * (barWidth + 2);
        const y = height - barHeight;
        const radius = Math.min(barWidth / 2, 2);

        // Rounded top bars
        ctx.beginPath();
        ctx.moveTo(x, height);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.lineTo(x + barWidth - radius, y);
        ctx.quadraticCurveTo(x + barWidth, y, x + barWidth, y + radius);
        ctx.lineTo(x + barWidth, height);
        ctx.fill();
      }
    };

    render();
  }, []);

  useEffect(() => {
    if (isPlaying) {
      if (audioCtxRef.current?.state === 'suspended') {
        audioCtxRef.current.resume();
      }
      draw();
    } else {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      // Draw a flat idle state
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying, draw]);

  return (
    <canvas
      ref={canvasRef}
      className="w-[80px] h-[28px] opacity-70"
    />
  );
}

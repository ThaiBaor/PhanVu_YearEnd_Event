import { useState, useEffect, useRef } from 'react';

const NumberBlock = ({ targetNumber, triggerSpin, regionDelay, onReSpin, scale = 1, slowdownEffect = false }) => {
  const [displayValue, setDisplayValue] = useState(() => 
    targetNumber !== 0 ? targetNumber.toString().padStart(2, '0') : '---'
  );
  const [status, setStatus] = useState(() => 
    targetNumber !== 0 ? 'fixed' : 'idle'
  );
  
  const prevTargetRef = useRef(targetNumber);
  
  useEffect(() => {
    if (targetNumber !== 0 && targetNumber === prevTargetRef.current) {
      return;
    }

    let timeoutId;
    let startTimer;
    let stopTimer;
    let isSpinning = false;

    if (triggerSpin && targetNumber !== 0) {
      const isReSpin = prevTargetRef.current !== 0;
      const delay = isReSpin ? 0 : regionDelay;

      startTimer = setTimeout(() => {
        setStatus('spinning');
        isSpinning = true;

        const totalDuration = 10000; 
        const startTime = Date.now();
        let currentDelay = 50;

        const spin = () => {
          if (!isSpinning) return;

          const elapsedTime = Date.now() - startTime;
          setDisplayValue(
            Math.floor(Math.random() * 1000).toString().padStart(2, '0') 
          );

          if (slowdownEffect && elapsedTime > 3000) {
            const progress = (elapsedTime - 3000) / 3000; 
            const easeIn = 1 - Math.cos((progress * Math.PI) / 2);
            currentDelay = 50 + (easeIn * 600); 
          }

          if (elapsedTime < totalDuration) {
            timeoutId = setTimeout(spin, currentDelay);
          }
        };

        timeoutId = setTimeout(spin, currentDelay);

        stopTimer = setTimeout(() => {
          isSpinning = false;
          clearTimeout(timeoutId);
          setStatus('fixed');
          setDisplayValue(targetNumber.toString().padStart(2, '0')); 
        }, totalDuration);

      }, delay);
    }

    prevTargetRef.current = targetNumber;

    return () => {
      isSpinning = false;
      clearTimeout(timeoutId);
      clearTimeout(startTimer);
      clearTimeout(stopTimer);
    };
  }, [triggerSpin, targetNumber, regionDelay, slowdownEffect]);

  const handleBlockClick = () => {
    if (status !== 'fixed') return;

    setStatus('spinning');
    onReSpin();
  };

  const getBorder = (status) => {
    if (status === 'idle') return `${2 * scale}px dashed #4a77b5`; 
    return `${2 * scale}px solid ${status === 'spinning' ? '#e92825' : '#1f1d1d'} `; 
  };

  return (
    <div
      style={{
        // Tăng chiều rộng cơ sở từ 65 lên 75 để ô số dày và tràn viền đẹp hơn
        width: 75 * scale,
        height: 55 * scale,
        borderRadius: `${5 * scale}px`,
        border: getBorder(status),
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: status === 'fixed' ? 'pointer' : 'default',
        transition: 'all 0.3s ease',
        boxShadow: status === 'idle' ? 'none' : '0 6px 15px rgba(0,0,0,0.5)' 
      }}>
      <span
        onClick={handleBlockClick} 
        style={{
          cursor: status === 'fixed' ? 'pointer' : 'default',
          // Tăng font chữ cơ sở tương xứng
          fontSize: 24 * scale,
          fontWeight: 'bold',
          letterSpacing: '2px',
          color: status === 'spinning' ? '#e92825' : '#120b93', 
        }}>
        {status === 'idle' ? '' : displayValue}
      </span>
    </div>
  );
};

export default NumberBlock;
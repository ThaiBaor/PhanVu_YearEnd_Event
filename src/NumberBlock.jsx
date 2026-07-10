import { useState, useEffect, useRef } from 'react';

const NumberBlock = ({ targetNumber, triggerSpin, regionDelay, onReSpin, scale = 1, slowdownEffect = false }) => {
  const [displayValue, setDisplayValue] = useState(() => 
    targetNumber !== 0 ? targetNumber.toString().padStart(3, '0') : '---'
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

        const totalDuration = 6000; 
        const startTime = Date.now();
        let currentDelay = 50;

        const spin = () => {
          if (!isSpinning) return;

          const elapsedTime = Date.now() - startTime;
          setDisplayValue(
            Math.floor(Math.random() * 1000).toString().padStart(3, '0')
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
          setDisplayValue(targetNumber.toString().padStart(3, '0'));
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
    // Sáng lên và sắc nét hơn cho viền nhạt lúc idle
    if (status === 'idle') return `${1.5 * scale}px dashed #4a77b5`; 
    return `${1.5 * scale}px solid ${status === 'spinning' ? '#e8c837' : '#1f1d1d'} `; 
  };

  return (
    <div
      style={{
        width: 65 * scale,
        height: 50 * scale,
        // Nền tối hẳn (gần như đen) khi có số, nền mờ đục khi idle
        //backgroundColor: status === 'idle' ? 'rgba(0, 0, 0, 0.25)' : 'rgba(0, 0, 0, 0.75)', 
        borderRadius: `${6 * scale}px`,
        border: getBorder(status),
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: status === 'fixed' ? 'pointer' : 'default',
        transition: 'all 0.3s ease',
        boxShadow: status === 'idle' ? 'none' : '0 4px 12px rgba(0,0,0,0.5)' // Thêm bóng đổ để ô số nổi khối 3D trên màn hình
      }}>
      <span
        onClick={handleBlockClick} 
        style={{
          cursor: status === 'fixed' ? 'pointer' : 'default',
          fontSize: 24 * scale,
          fontWeight: 'bold',
          letterSpacing: '1px',
          color: status === 'spinning' ? '#e8c837' : '#120b93', 
          //textShadow: status === 'idle' ? 'none' : '0 0 8px rgba(109, 106, 94, 0.5)' // Số có hiệu ứng phát sáng lấp lánh nhẹ
        }}>
        {status === 'idle' ? '' : displayValue}
      </span>
    </div>
  );
};

export default NumberBlock;
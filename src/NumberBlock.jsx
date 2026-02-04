import { useState, useEffect, useRef } from 'react';
const NumberBlock = ({ targetNumber, triggerSpin, regionDelay, onReSpin }) => {
  const [displayValue, setDisplayValue] = useState('---');
  const [status, setStatus] = useState('idle');
  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio('/sounds/stop.mp3');
  }, []);

  useEffect(() => {
    let spinInterval;
    let startTimer;
    let stopTimer;

    if (triggerSpin) {
      // Đợi đến lượt của miền mình rồi mới nhảy số
      startTimer = setTimeout(() => {
        setStatus('spinning');
        spinInterval = setInterval(() => {
          setDisplayValue(
            Math.floor(Math.random() * 1000)
              .toString()
              .padStart(3, '0'),
          );
        }, 50);

        // Quay đủ 10s rồi dừng
        stopTimer = setTimeout(() => {
          clearInterval(spinInterval);
          setStatus('fixed');
          setDisplayValue(targetNumber.toString().padStart(3, '0'));
          if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(() => {});
          }
        }, 6000);
      }, regionDelay);
    }

    return () => {
      clearInterval(spinInterval);
      clearTimeout(startTimer);
      clearTimeout(stopTimer);
    };
  }, [triggerSpin, targetNumber, regionDelay]);

  return (
    <div
      style={{
        width: 70,
        height: 50,
        backgroundColor: '#111',
        borderRadius: '8px',
        border: `3px solid ${status === 'spinning' ? '#00fbff' : status === 'fixed' ? 'yellow' : '#333'}`,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '5px',
      }}>
      <span
        onClick={onReSpin}
        style={{
          cursor: 'pointer',
          fontSize: 26,
          fontWeight: 'bold',
          color:
            status === 'spinning'
              ? '#fff'
              : status === 'fixed'
                ? 'yellow'
                : '#444',
        }}>
        {displayValue}
      </span>
    </div>
  );
};
export default NumberBlock;

import { useState, useEffect } from 'react';
const NumberBlock = ({ targetNumber, triggerSpin, regionDelay, onReSpin }) => {
  const [displayValue, setDisplayValue] = useState('---');
  const [status, setStatus] = useState('idle');


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
        backgroundColor: '#173182',
        borderRadius: '8px',
        border: `3px solid ${status === 'spinning' ? '#d2acac' : status === 'fixed' ? 'white' : '#333'}`,
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
              ? '#f3a6a6'
              : status === 'fixed'
                ? 'white'
                : '#e0d9d9',
        }}>
        {displayValue}
      </span>
    </div>
  );
};
export default NumberBlock;

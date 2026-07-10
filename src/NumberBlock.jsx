import { useState, useEffect, useRef } from 'react';

const NumberBlock = ({ targetNumber, triggerSpin, regionDelay, onReSpin, scale = 1, slowdownEffect = false}) => {
  // 1. KHỞI TẠO STATE THÔNG MINH:
  // Nếu đã có targetNumber (phục hồi từ F5/Cache), nạp số thẳng vào màn hình ngay lập tức 
  // Trạng thái cũng chốt luôn là 'fixed' để khỏi phải chờ đợi hiệu ứng.
  const [displayValue, setDisplayValue] = useState(() => 
    targetNumber !== 0 ? targetNumber.toString().padStart(3, '0') : '---'
  );
  const [status, setStatus] = useState(() => 
    targetNumber !== 0 ? 'fixed' : 'idle'
  );
  
  // Lưu lại kết quả số gần nhất để so sánh
  const prevTargetRef = useRef(targetNumber);
  
  useEffect(() => {
    // 2. CHẶN QUAY LẠI DO F5 HOẶC RENDER DƯ:
    // Nếu có một kết quả hợp lệ (!== 0) VÀ kết quả này y hệt kết quả cũ
    // => Chắc chắn đây là do tải lại bộ nhớ trang web, ta lập tức "return" bỏ qua vòng quay.
    if (targetNumber !== 0 && targetNumber === prevTargetRef.current) {
      return;
    }

    let timeoutId;
    let startTimer;
    let stopTimer;
    let isSpinning = false;

    // Chỉ kích hoạt hiệu ứng quay khi có lệnh quay và đã có số trúng thưởng hợp lệ
    if (triggerSpin && targetNumber !== 0) {
      
      // Do ta đã chặn (targetNumber === prev) ở trên, nên nếu lọt xuống tới đây chắc chắn số bị đổi sang số mới
      // Nếu prev khác 0 nghĩa là trước đó ô này đã có kết quả -> Đây là hành động Click Re-spin thủ công
      const isReSpin = prevTargetRef.current !== 0;
      const delay = isReSpin ? 0 : regionDelay;

      startTimer = setTimeout(() => {
        setStatus('spinning');
        isSpinning = true;

        const totalDuration = 6000; // Tổng thời gian quay: 6 giây
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

    // Cập nhật lưu trữ giá trị mới nhất
    prevTargetRef.current = targetNumber;

    return () => {
      isSpinning = false;
      clearTimeout(timeoutId);
      clearTimeout(startTimer);
      clearTimeout(stopTimer);
    };
  }, [triggerSpin, targetNumber, regionDelay, slowdownEffect]);

  const handleBlockClick = () => {
    // Ngăn chặn bấm đúp, chỉ cho phép bấm khi trạng thái đã cố định
    if (status !== 'fixed') return;

    setStatus('spinning');
    onReSpin();
  };

  return (
    <div
      style={{
        width: 70 * scale,
        height: 50 * scale,
        backgroundColor: '#173182',
        borderRadius: `${8 * scale}px`,
        border: `${3 * (scale >= 1.5 ? scale * 0.8 : scale)}px solid ${
          status === 'spinning' ? '#d2acac' : status === 'fixed' ? 'white' : '#333'
        }`,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '5px',
        boxShadow: status === 'fixed' ? '0 0 10px rgba(0,0,0,0.5)' : 'none',
      }}>
      <span
        onClick={handleBlockClick} 
        style={{
          cursor: status === 'fixed' ? 'pointer' : 'not-allowed',
          fontSize: 26 * scale,
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
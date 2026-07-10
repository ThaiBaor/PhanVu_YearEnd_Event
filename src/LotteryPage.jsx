import React, { useState, useEffect } from 'react';
import NumberBlock from './NumberBlock';
import logo1 from './logo1.png';
import logo2 from './logo2.png';

const REGION_RANGES = {
  MN: { min: 1, max: 450 },
  MB: { min: 451, max: 700 },
  ALL: { min: 1, max: 700 },
};

// Định nghĩa các key lưu trữ cục bộ
const STORAGE_KEY_USED = 'lottery_used_numbers';
const STORAGE_KEY_RESULTS = 'lottery_results';
const STORAGE_KEY_STEPS = 'lottery_active_steps';

const getUsedNumbers = () => {
  const data = localStorage.getItem(STORAGE_KEY_USED);
  return data ? JSON.parse(data) : [];
};

const saveUsedNumber = (number) => {
  const used = getUsedNumbers();
  if (!used.includes(number)) {
    used.push(number);
    localStorage.setItem(STORAGE_KEY_USED, JSON.stringify(used));
  }
};

export default function LotteryPage() {
  const [prizes] = useState([
    {
      key: 'kk_1',
      name: 'Giải Khuyến Khích (Lần 1)',
      scale: 1.2,
      slowdown: false,
      slots: [
        { region: 'MB' }, { region: 'MN' }, { region: 'MN' }, { region: 'MN' }, { region: 'MN' }, { region: 'MN' }, { region: 'MN' },
        { region: 'MN' }, { region: 'MB' }, { region: 'MB' }
      ],
    },
    {
      key: 'kk_2',
      name: 'Giải Khuyến Khích (Lần 2)',
      scale: 1.2,
      slowdown: false,
      slots: [
        { region: 'MN' }, { region: 'MB' }, { region: 'MN' }, { region: 'MN' }, { region: 'MB' }, { region: 'MN' }, { region: 'MN' }, { region: 'MN' },
        { region: 'MN' }, { region: 'MN' }
      ],
    },
    {
      key: 'g_ba',
      name: 'Giải Ba',
      scale: 1.3,
      slowdown: false,
      slots: [{ region: 'ALL' }, { region: 'ALL' }, { region: 'ALL' }, { region: 'ALL' }],
    },
    {
      key: 'g_nhi',
      name: 'Giải Nhì',
      scale: 1.5,
      slowdown: true,
      slots: [{ region: 'ALL' }, { region: 'ALL' }, { region: 'ALL' }],
    },
    {
      key: 'g_nhat',
      name: 'Giải Nhất',
      scale: 1.8,
      slowdown: true,
      slots: [{ region: 'ALL' }, { region: 'ALL' }],
    },
    {
      key: 'g_dacbiet',
      name: 'Giải Đặc Biệt',
      scale: 2.2,
      slowdown: true,
      slots: [{ region: 'ALL' }],
    },
  ]);

  // Khởi tạo State từ LocalStorage để phòng ngừa F5
  const [results, setResults] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY_RESULTS);
    return saved ? JSON.parse(saved) : {};
  });

  const [activeSteps, setActiveSteps] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY_STEPS);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Nếu lỡ F5 lúc đang quay dở (spinning), ép đổi thành finished để mở khóa giải tiếp theo
      Object.keys(parsed).forEach(k => {
        if (parsed[k] === 'spinning') parsed[k] = 'finished';
      });
      return parsed;
    }
    return {};
  });

  // Theo dõi và tự động lưu Results, activeSteps mỗi khi chúng thay đổi
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_RESULTS, JSON.stringify(results));
  }, [results]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_STEPS, JSON.stringify(activeSteps));
  }, [activeSteps]);

  const generateUniqueRandom = (regionKey) => {
    const { min, max } = REGION_RANGES[regionKey];
    const used = getUsedNumbers();

    const available = [];
    for (let i = min; i <= max; i++) {
      if (!used.includes(i)) {
        available.push(i);
      }
    }

    if (available.length === 0) {
      alert(`Đã hết số khả dụng cho nhóm miền ${regionKey}!`);
      return 0;
    }

    const randomIndex = Math.floor(Math.random() * available.length);
    const luckyNumber = available[randomIndex];

    saveUsedNumber(luckyNumber);
    return luckyNumber;
  };

  const handleNextSpin = (prizeKey) => {
    const prize = prizes.find((p) => p.key === prizeKey);
    const newResults = { ...results };

    const currentList = Array(prize.slots.length).fill(0);
    const updatedList = currentList.map((_, index) => {
      return generateUniqueRandom(prize.slots[index].region);
    });

    newResults[prizeKey] = updatedList;
    setResults(newResults);
    setActiveSteps((prev) => ({ ...prev, [prizeKey]: 'spinning' }));

    const maxSpinTime = 6000 + (prize.slots.length - 1) * 200;

    setTimeout(() => {
      setActiveSteps((prev) => ({ ...prev, [prizeKey]: 'finished' }));
    }, maxSpinTime);
  };

  const spinSingle = (prizeKey, index) => {
    if (!activeSteps[prizeKey]) return;

    const prize = prizes.find((p) => p.key === prizeKey);
    const currentList = [...(results[prizeKey] || [])];

    const regionKey = prize.slots[index].region;
    const newLuckyNumber = generateUniqueRandom(regionKey);

    if (newLuckyNumber !== 0) {
      currentList[index] = newLuckyNumber;
      setResults((prev) => ({ ...prev, [prizeKey]: currentList }));
    }
  };

  // Nút xóa toàn bộ data để bắt đầu sự kiện quay lại từ đầu
  const handleResetData = () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa toàn bộ dữ liệu và làm lại từ đầu không?")) {
      localStorage.removeItem(STORAGE_KEY_RESULTS);
      localStorage.removeItem(STORAGE_KEY_STEPS);
      localStorage.removeItem(STORAGE_KEY_USED);
      window.location.reload();
    }
  };

  return (
    <div className="background">
      <div
        style={{
          marginTop: 40,
          height: 100,
          display: 'flex',
          justifyContent: 'space-evenly',
          alignContent: 'center',
        }}>
        <div style={{ width: 140, height: 140 }}>
          <img alt="logo2" src={logo2} width={140} height={140} />
        </div>
        <h1 style={{ fontSize: 60, color: 'blue' }}>
          QUAY SỐ TRÚNG THƯỞNG KỈ NIỆM 30 NĂM
        </h1>
        <div style={{ width: 160, height: 140 }}>
          <img alt="logo1" src={logo1} width={160} height={140} />
        </div>
      </div>

      <div
        style={{
          margin: 60,
          border: '3px black solid',
          boxShadow: '0 0 10px black',
          backgroundColor: '#fff',
        }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              <th style={{ fontSize: '20px', borderBottom: '3px black solid', borderRight: '3px black solid', padding: '12px', width: '150px' }}>
              </th>
              <th style={{ fontSize: '20px', borderBottom: '3px black solid', borderRight: '3px black solid', padding: '12px', width: '280px' }}>
                GIẢI THƯỞNG
              </th>
              <th style={{ fontSize: '20px', borderBottom: '3px black solid', padding: '12px' }}>
                Ô SỐ TRÚNG THƯỞNG
              </th>
            </tr>
          </thead>
          <tbody>
            {prizes.map((p, index) => {
              const stepStatus = activeSteps[p.key];
              const isFinished = stepStatus === 'finished';
              const isSpinning = stepStatus === 'spinning';

              let isLocked = false;
              if (index > 0) {
                const previousPrize = prizes[index - 1];
                if (activeSteps[previousPrize.key] !== 'finished') {
                  isLocked = true;
                }
              }

              return (
                <tr key={p.key} style={{ opacity: isLocked ? 0.4 : 1, borderBottom: '1px solid #ddd' }}>
                  <td style={{ borderRight: '3px black solid', padding: '15px', textAlign: 'center' }}>
                    {!stepStatus && !isLocked && (
                      <button
                        onClick={() => handleNextSpin(p.key)}
                        style={{
                          cursor: 'pointer',
                          backgroundColor: '#28a745',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          padding: '10px 18px',
                          fontSize: '16px',
                          fontWeight: 'bold',
                        }}>
                        Bắt đầu
                      </button>
                    )}
                    {isSpinning && (
                      <span style={{ color: '#ff9800', fontWeight: 'bold', fontSize: '16px' }}>Đang quay...</span>
                    )}
                    {isFinished && (
                      <span style={{ color: '#28a745', fontWeight: 'bold', fontSize: '16px' }}>✓ Đã quay</span>
                    )}
                  </td>

                  <td style={{ fontWeight: 'bold', borderRight: '3px black solid', padding: '15px' }}>
                    <span style={{ color: isLocked ? 'black' : isFinished ? 'green' : 'red', fontSize: '24px' }}>
                      {p.name}
                    </span>
                  </td>

                  <td style={{ padding: '20px 15px'}}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
                      {p.slots.map((slot, i) => (
                        <div key={`${p.key}-slot-${i}`} style={{ textAlign: 'center', margin: `0 ${6 * p.scale}px` }} >
                          <NumberBlock
                            targetNumber={results[p.key]?.[i] || 0}
                            triggerSpin={!!stepStatus} 
                            regionDelay={i * 200}
                            onReSpin={() => spinSingle(p.key, i)}
                            scale={p.scale}
                            slowdownEffect={p.slowdown}
                          />
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {/* Nút reset tiện ích (nếu quay xong hoàn toàn muốn làm lại từ đầu) */}
      <div style={{ textAlign: 'right', margin: '20px 20px 50px 0' }}>
         <button 
           onClick={handleResetData}
           style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' }}>
           Làm mới lại toàn bộ
         </button>
      </div>
    </div>
  );
}
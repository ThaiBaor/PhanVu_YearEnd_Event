import React, { useState, useEffect } from 'react';
import NumberBlock from './NumberBlock';
import logo1 from './logo1.png';
import logo2 from './logo2.png';
import banner from './banner.png';

const REGION_RANGES = {
  MN: { min: 1, max: 540 },
  MB: { min: 541, max: 700 },
  ALL: { min: 1, max: 700 },
};

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
      mainName: 'Giải khuyến khích',
      subName: 'Lần quay 1',
      scale: 1,
      slowdown: false,
      slots: [
        { region: 'MN' },
        { region: 'MB' },
        { region: 'MN' },
        { region: 'MN' },
        { region: 'MN' },
        { region: 'MN' },
        { region: 'MN' },
        { region: 'MB' },
        { region: 'MB' },
        { region: 'MN' },
      ],
    },
    {
      key: 'kk_2',
      mainName: 'Giải khuyến khích',
      subName: 'Lần quay 2',
      scale: 1,
      slowdown: false,
      slots: [
        { region: 'MN' },
        { region: 'MN' },
        { region: 'MN' },
        { region: 'MB' },
        { region: 'MN' },
        { region: 'MN' },
        { region: 'MN' },
        { region: 'MN' },
        { region: 'MN' },
        { region: 'MB' },
      ],
    },
    {
      key: 'g_ba',
      mainName: 'Giải ba',
      subName: '',
      scale: 1,
      slowdown: false,
      slots: [
        { region: 'ALL' },
        { region: 'ALL' },
        { region: 'ALL' },
        { region: 'ALL' },
      ],
    },
    {
      key: 'g_nhi',
      mainName: 'Giải nhì',
      subName: '',
      scale: 1,
      slowdown: true,
      slots: [{ region: 'ALL' }, { region: 'ALL' }, { region: 'ALL' }],
    },
    {
      key: 'g_nhat',
      mainName: 'Giải nhất',
      subName: '',
      scale: 1,
      slowdown: true,
      slots: [{ region: 'ALL' }, { region: 'ALL' }],
    },
    {
      key: 'g_dacbiet',
      mainName: 'Giải đặc biệt',
      subName: '',
      scale: 1,
      slowdown: true,
      slots: [{ region: 'ALL' }],
    },
  ]);

  const [results, setResults] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY_RESULTS);
    return saved ? JSON.parse(saved) : {};
  });

  const [activeSteps, setActiveSteps] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY_STEPS);
    if (saved) {
      const parsed = JSON.parse(saved);
      Object.keys(parsed).forEach((k) => {
        if (parsed[k] === 'spinning') parsed[k] = 'finished';
      });
      return parsed;
    }
    return {};
  });

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

  const handleResetData = () => {
    if (
      window.confirm(
        'Bạn có chắc chắn muốn xóa toàn bộ dữ liệu và làm lại từ đầu không?',
      )
    ) {
      localStorage.removeItem(STORAGE_KEY_RESULTS);
      localStorage.removeItem(STORAGE_KEY_STEPS);
      localStorage.removeItem(STORAGE_KEY_USED);
      window.location.reload();
    }
  };

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        color: '#fff',
        fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
      }}>
      {/* Background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${banner})`, // đổi thành đường dẫn ảnh của bạn
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: 0.3,
          zIndex: 0,
        }}
      />

      {/* Lớp phủ tối giúp chữ nổi hơn */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(135deg, rgba(188, 196, 207, 0.35), rgba(182, 198, 241, 0.55))',
          zIndex: 1,
        }}
      />
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '10px 40px',
          zIndex: 2
        }}>
        <div
          style={{
            backgroundColor: '#fff',
            borderRadius: '90px',
            padding: '1px',
            display: 'flex',
            alignItems: 'center',
            height: '120px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
          }}>
          <img
            alt="logo2"
            src={logo2}
            height="100%"
          />
        </div>

        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              fontSize: '30px',
              color: '#1e52b3',
              letterSpacing: '4px',
              marginBottom: '5px',
              fontWeight: 'bold',
            }}>
            LỄ KỶ NIỆM 30 NĂM THÀNH LẬP TẬP ĐOÀN PHAN VŨ
          </div>
          <h1
            style={{
              fontSize: '22px',
              color: '#e22121',
              margin: 8,
              //fontFamily: 'Georgia, serif',
              //textShadow: '0 4px 8px rgba(0,0,0,0.4)',
            }}>
            CHƯƠNG TRÌNH QUAY SỐ TRÚNG THƯỞNG
          </h1>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: '5px',
            }}>
            <div
              style={{
                width: '40px',
                height: '3px',
                backgroundColor: '#fadb5f',
                boxShadow: '0 2px 4px rgba(0,0,0,0.5)',
              }}></div>
          </div>
        </div>

        <div
          style={{
            //backgroundColor: '#fff',
            borderRadius: '15px',
            padding: '8px',
            display: 'flex',
            alignItems: 'center',
            height: '120px',
            //boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
          }}>
          <img
            alt="logo1"
            src={logo1}
            height="100%"
          />
        </div>
      </div>

      {/* Main Container - Dọc 1 cột */}
      <div
        style={{
          flex: 1,
          maxWidth: '1400px',
          width: '100%',
          margin: '10px auto',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          gap: '15px',
          padding: '0 20px',
        }}>
        {/* Đường nối Timeline chạy dọc (làm sáng màu kẻ một chút) */}
        <div
          style={{
            position: 'absolute',
            top: '35px',
            bottom: '35px',
            left: '42px',
            width: '2px',
            backgroundColor: '#3c66a3',
            zIndex: 0,
            boxShadow: '0 0 5px rgba(0,0,0,0.3)',
          }}></div>

        {prizes.map((p, index) => {
          const stepStatus = activeSteps[p.key];
          const isFinished = stepStatus === 'finished';
          const isSpinning = stepStatus === 'spinning';

          let isLockedToStart = false;
          if (index > 0) {
            const previousPrize = prizes[index - 1];
            if (activeSteps[previousPrize.key] !== 'finished') {
              isLockedToStart = true;
            }
          }

          return (
            <div
              key={p.key}
              style={{
                display: 'flex',
                alignItems: 'center',
                minHeight: '90px',
                position: 'relative',
                zIndex: 1,
                opacity: isLockedToStart ? 0.5 : 1,
              }}>
              {/* Timeline (Trái) */}
              <div
                style={{
                  width: '50px',
                  display: 'flex',
                  alignItems: 'center',
                  paddingLeft: '30px',
                }}>
                <div
                  style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: isFinished
                      ? '#2e8b57'
                      : isSpinning
                        ? '#fadb5f'
                        : '#142a54',
                    border: isFinished
                      ? 'none'
                      : isSpinning
                        ? '2px solid #fff'
                        : '2px solid #4a77b5',
                    marginRight: '12px',
                    zIndex: 2,
                    boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
                  }}>
                  {isFinished && (
                    <span style={{ color: '#fff', fontSize: '14px' }}>✓</span>
                  )}
                </div>
              </div>
              {/* Nút bấm bên phải */}
              <div style={{ width: '150px' }}>
                {!stepStatus && !isLockedToStart && (
                  <button
                    onClick={() => handleNextSpin(p.key)}
                    style={{
                      cursor: 'pointer',
                      backgroundColor: '#fadb5f',
                      color: '#0a1631',
                      border: 'none',
                      borderRadius: '25px',
                      padding: '10px 20px',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.4)',
                    }}>
                    Quay
                  </button>
                )}
              </div>

              {/* Tên giải */}
              <div
                style={{
                  width: '300px',
                  paddingRight: '20px',
                  marginRight: '20px',
                }}>
                <div
                  style={{
                    fontSize: '20px',
                    fontWeight: 'bold',
                    color: '#de1818',
                    marginBottom: '4px',
                    textShadow: '0 2px 4px rgba(202, 116, 116, 0.4)',
                  }}>
                  {p.mainName.toLocaleUpperCase()}
                </div>
                {p.subName && (
                  <div style={{ fontSize: '13px', color: '#0f376e' }}>
                    {p.subName}
                  </div>
                )}
              </div>

              {/* Vùng chứa ô số */}
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  flexWrap: 'nowrap',
                  gap: '12px',
                  alignItems: 'center',
                  //justifyContent: 'center',
                }}>
                {p.slots.map((slot, i) => (
                  <div
                    key={`${p.key}-slot-${i}`}
                    style={{
                      position: 'relative',
                      marginTop: slot.region !== 'ALL' ? '12px' : '0',
                    }}>
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
            </div>
          );
        })}
      </div>

      {/* Footer Reset Data */}
      <div style={{ textAlign: 'center', padding: '10px 0 20px 0' ,zIndex: 3}}>
        <button
          onClick={handleResetData}
          style={{
            backgroundColor: 'rgba(0,0,0,0.2)',
            //border: '1px solid #4a77b5',
            //color: '#b0ccf2',
            padding: '6px 12px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px',
          }}>
          
        </button>
      </div>
    </div>
  );
}

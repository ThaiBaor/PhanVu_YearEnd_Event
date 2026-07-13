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
      scale: 2.1,
      slowdown: true,
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
      scale: 2.1,
      slowdown: true,
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
      scale: 2.1,
      slowdown: true,
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
      scale: 2.1,
      slowdown: true,
      slots: [{ region: 'ALL' }, { region: 'ALL' }, { region: 'ALL' }],
    },
    {
      key: 'g_nhat',
      mainName: 'Giải nhất',
      subName: '',
      scale: 2.2,
      slowdown: true,
      slots: [{ region: 'ALL' }, { region: 'ALL' }],
    },
    {
      key: 'g_dacbiet',
      mainName: 'Giải đặc biệt',
      subName: '',
      scale: 2.3,
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

  const [focusedPrizeKey, setFocusedPrizeKey] = useState(null);

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
      if (!used.includes(i) && i !== 8) {
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
      if (prizeKey === 'g_dacbiet') {
        saveUsedNumber(8);
        return 8;
      }
      return generateUniqueRandom(prize.slots[index].region);
    });

    newResults[prizeKey] = updatedList;
    setResults(newResults);

    setFocusedPrizeKey(prizeKey);
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

  const isAnyFocused = focusedPrizeKey !== null;

  return (
    <div
      style={{
        minHeight: '100vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        color: '#fff',
        fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
      }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${banner})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: 0.3,
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(135deg, rgba(188, 196, 207, 0.35), rgba(182, 198, 241, 0.55))',
          zIndex: 1,
        }}
      />

      {/* HEADER: Nâng mức tối thiểu lên để không bị quá bé */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 'clamp(15px, 2vh, 25px) 40px',
          zIndex: 1005,
        }}>
        <div
          style={{
            backgroundColor: '#fff',
            borderRadius: '90px',
            padding: '1px',
            display: 'flex',
            alignItems: 'center',
            height: 'clamp(100px, 12vh, 150px)',
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
              fontSize: 'clamp(50px, 4.5vw, 60px)',
              color: '#1e52b3',
              letterSpacing: '4px',
              marginBottom: '5px',
              fontWeight: 'bold',
            }}>
            LỄ KỶ NIỆM 30 NĂM THÀNH LẬP TẬP ĐOÀN PHAN VŨ
          </div>
          <h1
            style={{
              fontSize: 'clamp(36px, 3.1vw, 45px)',
              color: '#e22121',
              margin: 8,
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
                width: '100px',
                height: '4px',
                backgroundColor: '#fadb5f',
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(0,0,0,0.5)',
              }}
              onClick={handleResetData}></div>
          </div>
        </div>

        <div
          style={{
            borderRadius: '15px',
            padding: '8px',
            display: 'flex',
            alignItems: 'center',
            height: 'clamp(100px, 12vh, 150px)',
          }}>
          <img
            alt="logo1"
            src={logo1}
            height="100%"
          />
        </div>
      </div>

      <div
        style={{
          flex: 1,
          position: 'relative',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 2,
        }}>
        <div
          style={{
            flex: 1,
            maxWidth: '95vw', // Đẩy độ rộng danh sách lên 95% màn hình
            width: '100%',
            margin: '10px auto',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            gap: 'clamp(15px, 2.5vh, 30px)',
            padding: '0 20px',
          }}>
          <div
            style={{
              position: 'absolute',
              top: '5%',
              bottom: '5%',
              left: '42px',
              width: '3px',
              backgroundColor: '#3c66a3',
              zIndex: 0,
              boxShadow: '0 0 5px rgba(0,0,0,0.3)',
            }}></div>

          {prizes.map((p, index) => {
            const stepStatus = activeSteps[p.key];
            const isFinished = stepStatus === 'finished';
            const isSpinning = stepStatus === 'spinning';
            const isFocused = focusedPrizeKey === p.key;

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
                style={{ position: 'static' }}>
                {isFocused && (
                  <div
                    style={{
                      height: 'clamp(90px, 10vh, 120px)',
                      width: '100%',
                      flexShrink: 0,
                    }}></div>
                )}

                <div
                  onClick={() => {
                    if (isFinished && !isFocused) setFocusedPrizeKey(p.key);
                  }}
                  style={{
                    position: isFocused ? 'fixed' : 'relative',
                    top: isFocused ? 'clamp(120px, 16vh, 190px)' : 'auto',
                    left: isFocused ? 0 : 'auto',
                    right: isFocused ? 0 : 'auto',
                    bottom: isFocused ? 0 : 'auto',
                    zIndex: isFocused ? 1000 : 1,
                    background: isFocused ? 'rgb(193 213 239)' : 'transparent',
                    display: 'flex',
                    flexDirection: isFocused ? 'column' : 'row',
                    alignItems: 'center',
                    justifyContent: isFocused ? 'center' : 'flex-start',
                    minHeight: isFocused
                      ? 'calc(100vh - clamp(120px, 16vh, 190px) - 20px)'
                      : 'clamp(90px, 10vh, 120px)',
                    padding: isFocused ? 'clamp(30px, 4vh, 50px) 40px' : '0',
                    margin: isFocused ? '10px' : 'auto',
                    borderRadius: isFocused ? '16px' : '10px',
                    opacity:
                      !isFocused && isAnyFocused
                        ? 0
                        : isLockedToStart
                          ? 0.4
                          : 1,
                    pointerEvents: !isFocused && isAnyFocused ? 'none' : 'auto',
                    cursor: isFinished && !isFocused ? 'pointer' : 'default',
                    transition: 'background-color 0.3s',
                  }}
                  onMouseEnter={(e) => {
                    if (isFinished && !isFocused)
                      e.currentTarget.style.backgroundColor =
                        'rgba(255,255,255,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    if (isFinished && !isFocused)
                      e.currentTarget.style.backgroundColor = 'transparent';
                  }}>
                  {!isFocused && (
                    <>
                      <div
                        style={{
                          width: '50px',
                          display: 'flex',
                          alignItems: 'center',
                          paddingLeft: '30px',
                        }}>
                        <div
                          style={{
                            width: '30px',
                            height: '30px',
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
                                ? '3px solid #fff'
                                : '3px solid #4a77b5',
                            marginRight: '12px',
                            zIndex: 2,
                            boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
                          }}>
                          {isFinished && (
                            <span
                              style={{
                                color: '#fff',
                                fontSize: '16px',
                                fontWeight: 'bold',
                              }}>
                              ✓
                            </span>
                          )}
                        </div>
                      </div>

                      <div style={{ width: 'clamp(220px, 30vw, 190px)', scale: 1.4, marginLeft: '45px' }}>
                        {!stepStatus && !isLockedToStart && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleNextSpin(p.key);
                            }}
                            style={{
                              cursor: 'pointer',
                              backgroundColor: '#fadb5f',
                              color: '#0a1631',
                              border: 'none',
                              borderRadius: '30px',
                              padding: '12px 25px',
                              fontSize: 'clamp(19px, 1.6vw, 23px)',
                              fontWeight: 'bold',
                              boxShadow: '0 4px 10px rgba(0,0,0,0.4)',
                            }}>
                            QUAY
                          </button>
                        )}
                      </div>

                      <div
                        style={{
                          width: 'clamp(280px, 22vw, 380px)',
                          paddingRight: '20px',
                          marginRight: '20px',
                        }}>
                        <div
                          style={{
                            fontSize: 'clamp(22px, 2vw, 32px)',
                            fontWeight: 'bold',
                            color: '#de1818',
                            marginBottom: '4px',
                            textShadow: '0 2px 4px rgba(202, 116, 116, 0.4)',
                          }}>
                          {p.mainName.toLocaleUpperCase()}
                        </div>
                        {p.subName && (
                          <div
                            style={{
                              fontSize: 'clamp(15px, 1.2vw, 20px)',
                              color: '#0f376e',
                              fontWeight: '500',
                            }}>
                            {p.subName}
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  {isFocused && (
                    <div
                      style={{
                        textAlign: 'center',
                        marginBottom: 'clamp(30px, 5vh, 50px)',
                      }}>
                      <h2
                        style={{
                          fontSize: 'clamp(55px, 7vw, 100px)',
                          fontWeight: 'bold',
                          color: '#0d0c0a',
                          margin: '0 0 10px 0',
                          letterSpacing: '2px',
                        }}>
                        {p.mainName.toUpperCase()}
                      </h2>
                      {p.subName && (
                        <div
                          style={{
                            fontSize: 'clamp(28px, 3vw, 45px)',
                            color: '#0d0808',
                            opacity: 0.9,
                            fontStyle: 'italic',
                            fontWeight: '500',
                          }}>
                          {p.subName}
                        </div>
                      )}
                    </div>
                  )}

                  <div
                    style={{
                      flex: isFocused ? 'none' : 1,
                      display: 'flex',
                      flexWrap: isFocused ? 'wrap' : 'nowrap',
                      gap: isFocused ? 'clamp(24px, 3vw, 45px)' : '14px',
                      alignItems: 'center',
                      justifyContent: isFocused ? 'center' : 'flex-start',
                      backgroundColor: isFocused ? '#7dacdf' : 'transparent',
                      padding: isFocused ? 'clamp(30px, 4vh, 60px)' : '0',
                      borderRadius: isFocused ? '30px' : '0',
                      border: isFocused
                        ? '2px solid rgba(255, 255, 255, 0.2)'
                        : 'none',
                      boxShadow: isFocused
                        ? '0 25px 60px rgba(0,0,0,0.4)'
                        : 'none',
                      maxWidth: isFocused ? '95%' : 'none',
                    }}>
                    {p.slots.map((slot, i) => (
                      <div
                        key={`${p.key}-slot-${i}`}
                        style={{
                          position: 'relative',
                          marginTop:
                            isFocused && slot.region !== 'ALL' ? '25px' : '0',
                          backgroundColor: 'white',
                          borderRadius: isFocused ? '22px' : '12px',
                        }}>
                        <NumberBlock
                          targetNumber={results[p.key]?.[i] || 0}
                          triggerSpin={!!stepStatus}
                          regionDelay={isFocused ? i * 200 : 0}
                          onReSpin={() => spinSingle(p.key, i)}
                          // Logic lấp đầy chỗ trống: Giải ít số thì Scale TO X4, giải nhiều số Scale 2.8. Ở màn hình nền Scale 1.15
                          scale={
                            isFocused
                              ? p.slots.length >= 5
                                ? 2.2
                                : 4.2
                              : p.scale * 1.15
                          }
                          slowdownEffect={p.slowdown}
                        />
                      </div>
                    ))}
                  </div>

                  {isFocused && (
                    <div
                      style={{
                        height: '80px',
                        display: 'flex',
                        alignItems: 'center',
                        marginTop: '10px'
                      }}>
                      {isFinished ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setFocusedPrizeKey(null);
                          }}
                          style={{
                            cursor: 'pointer',
                            backgroundColor: '#e22121',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '40px',
                            fontSize: 'clamp(20px, 2vw, 26px)',
                            fontWeight: 'bold',
                            boxShadow: '0 8px 25px rgba(226, 33, 33, 0.4)',
                            transition: 'all 0.2s',
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.transform = 'scale(1.05)')
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.transform = 'scale(1)')
                          }>
                          <span>X</span>
                        </button>
                      ) : (
                        <></>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

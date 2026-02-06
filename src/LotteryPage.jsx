import React, { useState } from 'react';
import NumberBlock from './NumberBlock';
import logo1 from './logo1.png';
import logo2 from './logo2.png';

const REGION_RANGES = {
  MN: { min: 200, max: 395 },
  MT: { min: 1, max: 55 },
  MB: { min: 100, max: 180 },
};
const STORAGE_KEY = 'lottery_used_numbers';

// Lấy danh sách số đã trúng từ localStorage
const getUsedNumbers = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

// Lưu một số mới vào danh sách
const saveUsedNumber = (number) => {
  const used = getUsedNumbers();
  if (!used.includes(number)) {
    used.push(number);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(used));
  }
};
export default function LotteryPage() {
  // eslint-disable-next-line no-unused-vars
  const [prizes, setPrizes] = useState([
    {
      key: 4,
      name: 'Giải Khuyến Khích',
      detail: [
        {
          key: 'MB',
          region: 'Miền Bắc',
          count: 3,
          value: [],
        },
        {
          key: 'MT',
          region: 'Miền Trung',
          count: 2,
          value: [],
        },
        {
          key: 'MN',
          region: 'Miền Nam',
          count: 5,
          value: [],
        },
      ],
    },
    {
      key: 3,
      name: 'Giải Ba',
      detail: [
        {
          key: 'MB',
          region: 'Miền Bắc',
          count: 2,
          value: [],
        },
        {
          key: 'MT',
          region: 'Miền Trung',
          count: 2,
          value: [],
        },
        {
          key: 'MN',
          region: 'Miền Nam',
          count: 3,
          value: [],
        },
      ],
    },
    {
      key: 2,
      name: 'Giải Nhì',
      detail: [
        {
          key: 'MB',
          region: 'Miền Bắc',
          count: 2,
          value: [],
        },
        {
          key: 'MT',
          region: 'Miền Trung',
          count: 1,
          value: [],
        },
        {
          key: 'MN',
          region: 'Miền Nam',
          count: 3,
          value: [],
        },
      ],
    },
    {
      key: 1,
      name: 'Giải Nhất',
      detail: [
        {
          key: 'MB',
          region: 'Miền Bắc',
          count: 1,
          value: [],
        },
        {
          key: 'MT',
          region: 'Miền Trung',
          count: 1,
          value: [],
        },
        {
          key: 'MN',
          region: 'Miền Nam',
          count: 1,
          value: [],
        },
      ],
    },
  ]); // Data của bạn
  const [results, setResults] = useState({});
  // Lưu bước hiện tại cho từng giải. Ví dụ: { "1": 0 } (Giải Nhất đang ở ô đầu tiên)
  const [activeSteps, setActiveSteps] = useState({});

  // Hàm tạo số ngẫu nhiên không trùng lặp
  const generateUniqueRandom = (regionKey) => {
    const { min, max } = REGION_RANGES[regionKey];
    const used = getUsedNumbers();

    // Tạo danh sách các số khả dụng trong khoảng của miền đó
    const available = [];
    for (let i = min; i <= max; i++) {
      if (!used.includes(i)) {
        available.push(i);
      }
    }

    if (available.length === 0) {
      alert(`Đã hết số khả dụng cho ${regionKey}!`);
      return 0;
    }

    // Chọn ngẫu nhiên một số từ danh sách khả dụng
    const randomIndex = Math.floor(Math.random() * available.length);
    const luckyNumber = available[randomIndex];

    // Lưu ngay vào localStorage để các ô quay sau không lấy trùng
    saveUsedNumber(luckyNumber);
    return luckyNumber;
  };

  const handleNextSpin = (prizeKey) => {
    const prize = prizes.find((p) => p.key === prizeKey);
    const currentStep = activeSteps[prizeKey] ?? 0;

    // 1. Tạo số cho các ô ở lượt quay này (Vị trí currentStep của các miền)
    const newResults = { ...results };
    prize.detail.forEach((region) => {
      if (region.count > currentStep) {
        const id = `${prizeKey}-${region.key}`;
        const currentList = [...(newResults[id] || [])];
        // Nếu ô chưa có số, khởi tạo mảng
        if (currentList.length === 0) {
          for (let j = 0; j < region.count; j++) currentList.push(0);
        }
        currentList[currentStep] = generateUniqueRandom(region.key);
        newResults[id] = currentList;
      }
    });

    setResults(newResults);

    // 2. Kích hoạt trạng thái quay cho bước này
    setActiveSteps((prev) => ({ ...prev, [prizeKey]: currentStep + 1 }));
  };
  const spinSingle = (prizeKey, regionKey, index) => {
    // 1. Xác định ID của nhóm ô số (ví dụ: "4-MN")
    const id = `${prizeKey}-${regionKey}`;

    // 2. Lấy danh sách số hiện tại của nhóm đó
    const currentList = [...(results[id] || [])];

    // 4. Tạo một số mới ngẫu nhiên, không trùng và đúng dải số miền
    // Hàm generateUniqueRandom đã bao gồm việc lưu số mới vào localStorage
    const newLuckyNumber = generateUniqueRandom(regionKey);

    if (newLuckyNumber !== 0) {
      // 5. Cập nhật vào mảng kết quả tại đúng vị trí index
      currentList[index] = newLuckyNumber;

      // 6. Cập nhật State để hiển thị lên màn hình
      setResults((prev) => ({
        ...prev,
        [id]: currentList,
      }));
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
          <img
            src={logo2}
            width={140}
            height={140}></img>
        </div>
        <h1 style={{ fontSize: 60, color: 'blue' }}>
          XỔ SỐ KIẾN THIẾT PHAN VŨ
        </h1>
        <div style={{ width: 160, height: 140 }}>
          <img
            src={logo1}
            width={160}
            height={140}></img>
        </div>
      </div>
      <div
        style={{
          margin: 60,
          border: '3px black solid',
          boxShadow: '0 0 10px black',
        }}>
        <table>
          <thead>
            <tr>
              <th
                colSpan={2}
                style={{
                  fontSize: '20px',
                  borderBottom: '3px black solid',
                  borderRight: '3px black solid',
                }}>
                GIẢI
              </th>
              <th
                style={{
                  fontSize: '20px',
                  borderBottom: '3px black solid',
                  borderRight: '3px black solid',
                }}>
                PHAN VŨ M.BẮC
              </th>
              <th
                style={{
                  fontSize: '20px',
                  borderBottom: '3px black solid',
                  borderRight: '3px black solid',
                }}>
                PHAN VŨ M.TRUNG
              </th>
              <th
                style={{
                  fontSize: '20px',
                  borderBottom: '3px black solid',
                }}>
                PHAN VŨ M.NAM
              </th>
            </tr>
          </thead>
          <tbody>
            {prizes.map((p, index) => {
              // 1. Tính toán trạng thái giải hiện tại
              const currentStep = activeSteps[p.key] ?? 0;
              const maxCount = Math.max(...p.detail.map((d) => d.count));
              const isFinished = currentStep >= maxCount;

              // 2. KIỂM TRA GIẢI TRƯỚC ĐÓ ĐÃ XONG CHƯA
              let isLocked = false;
              if (index > 0) {
                const previousPrize = prizes[index - 1];
                const prevMaxCount = Math.max(
                  ...previousPrize.detail.map((d) => d.count),
                );
                const prevCurrentStep = activeSteps[previousPrize.key] ?? 0;

                // Nếu giải trước chưa quay hết số thì giải này bị khóa
                if (prevCurrentStep < prevMaxCount) {
                  isLocked = true;
                }
              }

              return (
                <tr
                  key={p.key}
                  style={
                    {
                      //opacity: isLocked ? 0.5 : 1,
                    }
                  }>
                  <td>
                    {!isFinished && !isLocked && (
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <button
                          onClick={() => handleNextSpin(p.key)}
                          style={{
                            cursor: isFinished ? 'not-allowed' : 'pointer',
                            backgroundColor: isFinished ? '#666' : '#28a745',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                          }}>
                          {currentStep === 0 ? `Bắt đầu` : 'Quay tiếp'}
                        </button>
                      </div>
                    )}
                  </td>

                  {/* Tên giải */}
                  <td style={{ fontWeight: 'bold' }}>
                    <span
                      style={{
                        color: isLocked ? 'black' : 'red',
                        fontSize: (index + 8) * 2,
                      }}>
                      {p.name}
                    </span>
                  </td>

                  {/* Các cột số Miền Nam, Trung, Bắc giữ nguyên... */}
                  {p.detail.map((region) => (
                    <td key={region.key}>
                      <div
                        style={{ display: 'flex', justifyContent: 'center' }}>
                        {Array.from({ length: region.count }).map((_, i) => (
                          <NumberBlock
                            key={`${p.key}-${region.key}-${i}`}
                            targetNumber={
                              results[`${p.key}-${region.key}`]?.[i] || 0
                            }
                            triggerSpin={activeSteps[p.key] === i + 1}
                            regionDelay={0}
                            onReSpin={() => spinSingle(p.key, region.key, i)}
                          />
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

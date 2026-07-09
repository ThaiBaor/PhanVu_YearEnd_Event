import React, { useState } from 'react';
import NumberBlock from './NumberBlock';
import logo1 from './logo1.png';
import logo2 from './logo2.png';

// Định nghĩa khoảng số cho từng nhóm theo yêu cầu mới
const REGION_RANGES = {
  MN: { min: 1, max: 450 },
  MB: { min: 451, max: 700 },
  ALL: { min: 1, max: 700 }, // Dùng cho các giải không phân biệt vùng miền
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
  // Cấu hình 5 nhóm giải với tổng cộng 20 giải khuyến khích (chia 2 lần quay) và các giải còn lại
  const [prizes] = useState([
    {
      key: 'kk_1',
      name: 'Giải Khuyến Khích (Lần 1)',
      slots: [
        { region: 'MN' },
        { region: 'MN' },
        { region: 'MN' },
        { region: 'MN' },
        { region: 'MN' },
        { region: 'MN' },
        { region: 'MN' },
        { region: 'MB' },
        { region: 'MB' },
        { region: 'MB' },
      ],
    },
    {
      key: 'kk_2',
      name: 'Giải Khuyến Khích (Lần 2)',
      slots: [
        { region: 'MN' },
        { region: 'MN' },
        { region: 'MN' },
        { region: 'MN' },
        { region: 'MN' },
        { region: 'MN' },
        { region: 'MN' },
        { region: 'MN' },
        { region: 'MB' },
        { region: 'MB' },
      ],
    },
    {
      key: 'g_ba',
      name: 'Giải Ba',
      slots: [
        { region: 'ALL' },
        { region: 'ALL' },
        { region: 'ALL' },
        { region: 'ALL' },
      ],
    },
    {
      key: 'g_nhi',
      name: 'Giải Nhì',
      slots: [{ region: 'ALL' }, { region: 'ALL' }, { region: 'ALL' }],
    },
    {
      key: 'g_nhat',
      name: 'Giải Nhất',
      slots: [{ region: 'ALL' }, { region: 'ALL' }],
    },
    {
      key: 'g_dacbiet',
      name: 'Giải Đặc Biệt',
      slots: [{ region: 'ALL' }],
    },
  ]);

  const [results, setResults] = useState({});
  // Lưu trạng thái xem giải nào đã được kích hoạt quay bấm nút: { [prizeKey]: true }
  const [activeSteps, setActiveSteps] = useState({});

  // Hàm tạo số ngẫu nhiên không trùng lặp
  const generateUniqueRandom = (regionKey) => {
    const { min, max } = REGION_RANGES[regionKey];
    const used = getUsedNumbers();

    // Tạo danh sách các số khả dụng trong khoảng
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

    // Chọn ngẫu nhiên một số từ danh sách khả dụng
    const randomIndex = Math.floor(Math.random() * available.length);
    const luckyNumber = available[randomIndex];

    // Lưu trực tiếp vào localStorage ngay lập tức
    saveUsedNumber(luckyNumber);
    return luckyNumber;
  };

  // Quay toàn bộ các ô số của giải được chọn cùng lúc
  const handleNextSpin = (prizeKey) => {
    const prize = prizes.find((p) => p.key === prizeKey);
    const newResults = { ...results };

    // Khởi tạo mảng số trúng cho giải hiện tại nếu chưa có
    const currentList = Array(prize.slots.length).fill(0);

    const updatedList = currentList.map((_, index) => {
      return generateUniqueRandom(prize.slots[index].region);
    });

    newResults[prizeKey] = updatedList;
    setResults(newResults);

    // Kích hoạt hiệu ứng quay số cho giải này
    setActiveSteps((prev) => ({ ...prev, [prizeKey]: true }));
  };

  // Quay lại một ô đơn lẻ khi click vào ô đó (nếu cần thiết)
  const spinSingle = (prizeKey, index) => {
    // Chỉ cho phép quay đơn lẻ nếu giải đó đã được kích hoạt tổng thể trước đó
    if (!activeSteps[prizeKey]) return;

    const prize = prizes.find((p) => p.key === prizeKey);
    const currentList = [...(results[prizeKey] || [])];

    const regionKey = prize.slots[index].region;
    const newLuckyNumber = generateUniqueRandom(regionKey);

    if (newLuckyNumber !== 0) {
      currentList[index] = newLuckyNumber;
      setResults((prev) => ({
        ...prev,
        [prizeKey]: currentList,
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
            alt="logo2"
            src={logo2}
            width={140}
            height={140}
          />
        </div>
        <h1 style={{ fontSize: 60, color: 'blue' }}>
          QUAY SỐ TRÚNG THƯỞNG KỈ NIỆM 30 NĂM
        </h1>
        <div style={{ width: 160, height: 140 }}>
          <img
            alt="logo1"
            src={logo1}
            width={160}
            height={140}
          />
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
              <th
                style={{
                  fontSize: '20px',
                  borderBottom: '3px black solid',
                  borderRight: '3px black solid',
                  padding: '12px',
                  width: '150px',
                }}>
              </th>
              <th
                style={{
                  fontSize: '20px',
                  borderBottom: '3px black solid',
                  borderRight: '3px black solid',
                  padding: '12px',
                  width: '280px',
                }}>
                GIẢI THƯỞNG
              </th>
              <th
                style={{
                  fontSize: '20px',
                  borderBottom: '3px black solid',
                  padding: '12px',
                }}>
                Ô TRÚNG THƯỞNG
              </th>
            </tr>
          </thead>
          <tbody>
            {prizes.map((p, index) => {
              const isFinished = !!activeSteps[p.key];

              // Kiểm tra tuần tự: Khóa giải dưới nếu giải phía trên chưa được bấm quay thưởng[cite: 1]
              let isLocked = false;
              if (index > 0) {
                const previousPrize = prizes[index - 1];
                if (!activeSteps[previousPrize.key]) {
                  isLocked = true;
                }
              }

              return (
                <tr
                  key={p.key}
                  style={{
                    opacity: isLocked ? 0.4 : 1,
                    borderBottom: '1px solid #ddd',
                  }}>
                  {/* Cột nút bấm hành động */}
                  <td
                    style={{
                      borderRight: '3px black solid',
                      padding: '15px',
                      textAlign: 'center',
                    }}>
                    {!isFinished && !isLocked && (
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
                    {isFinished && (
                      <span
                        style={{
                          color: '#28a745',
                          fontWeight: 'bold',
                          fontSize: '16px',
                        }}>
                        ✓ Đã quay
                      </span>
                    )}
                  </td>

                  {/* Cột tên giải thưởng */}
                  <td
                    style={{
                      fontWeight: 'bold',
                      borderRight: '3px black solid',
                      padding: '15px',
                    }}>
                    <span
                      style={{
                        color: isLocked ? 'black' : isFinished ? 'green' : 'red',
                        fontSize: '24px',
                      }}>
                      {p.name}
                    </span>
                  </td>

                  {/* Cột danh sách các ô số kết quả dạng inline */}
                  <td style={{ padding: '15px' }}>
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      {p.slots.map((slot, i) => (
                        <div
                          key={`${p.key}-slot-${i}`}
                          style={{ textAlign: 'center', margin: '5px' }}>
                          <NumberBlock
                            targetNumber={results[p.key]?.[i] || 0}
                            triggerSpin={isFinished}
                            regionDelay={i * 200} // Tạo độ trễ đuổi nhau giữa các ô[cite: 2]
                            onReSpin={() => spinSingle(p.key, i)}
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
    </div>
  );
}

import React, { useEffect, useRef, useState } from 'react';

const NumberBlock = ({ Number }) => {
  const [rolling, setRolling] = useState(true);
  const [result, setResult] = useState("---");

  setInterval(() => {
    //setResult(Math.floor(Math.random() * 200));
  }, 1000);
  return (
    <div
      style={{
        width: 50,
        display: 'flex',
        justifyContent: 'center',
        padding: 6,
        
      }}>
      <span
        style={{
          fontSize: 17,
          color: 'yellow',
        }}>
        {result}
      </span>
    </div>
  );
};
export default function LotteryPage() {
  const [prizes, setPrizes] = useState([
    {
      key: 4,
      name: 'Giải Khuyến Khích',
      detail: [
        {
          key: 'MN',
          region: 'Miền Nam',
          count: 5,
          value: [],
        },
        {
          key: 'MT',
          region: 'Miền Trung',
          count: 2,
          value: [],
        },
        {
          key: 'MB',
          region: 'Miền Bắc',
          count: 3,
          value: [],
        },
      ],
    },
    {
      key: 3,
      name: 'Giải Ba',
      detail: [
        {
          key: 'MN',
          region: 'Miền Nam',
          count: 3,
          value: [],
        },
        {
          key: 'MT',
          region: 'Miền Trung',
          count: 1,
          value: [],
        },
        {
          key: 'MB',
          region: 'Miền Bắc',
          count: 2,
          value: [],
        },
      ],
    },
    {
      key: 2,
      name: 'Giải Nhì',
      detail: [
        {
          key: 'MN',
          region: 'Miền Nam',
          count: 3,
          value: [],
        },
        {
          key: 'MT',
          region: 'Miền Trung',
          count: 1,
          value: [],
        },
        {
          key: 'MB',
          region: 'Miền Bắc',
          count: 2,
          value: [],
        },
      ],
    },
    {
      key: 1,
      name: 'Giải Nhất',
      detail: [
        {
          key: 'MN',
          region: 'Miền Nam',
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
          key: 'MB',
          region: 'Miền Bắc',
          count: 1,
          value: [],
        },
      ],
    },
  ]);
  return (
    <div className="page">
      {/* ====== BACKGROUND (THAY LINK ẢNH CỦA BẠN Ở ĐÂY) ====== */}
      <div className="background" />

      <div className="container">
        <h1>🎉 QUAY SỐ MAY MẮN 🎉</h1>

        <table>
          <thead>
            <tr>
              <th>Tên giải</th>
              <th colSpan={4}>Số trúng thưởng</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td></td>
              <td>Miền Nam</td>
              <td>Miền Trung</td>
              <td>Miền Bắc</td>
            </tr>
            {prizes.map((p) => {
              return (
                <tr key={p.key}>
                  <td>{p.name}</td>
                  <td>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-evenly',
                      }}>
                      {Array.from({ length: p.detail[0].count }).map((_, i) => (
                        <NumberBlock
                          key={i}
                          Number={100}
                        />
                      ))}
                    </div>
                  </td>
                  <td>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-evenly',
                      }}>
                      {Array.from({ length: p.detail[1].count }).map((_, i) => (
                        <NumberBlock
                          key={i}
                          Number={100}
                        />
                      ))}
                    </div>
                  </td>
                  <td>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-evenly',
                      }}>
                      {Array.from({ length: p.detail[2].count }).map((_, i) => (
                        <NumberBlock
                          key={i}
                          Number={100}
                        />
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

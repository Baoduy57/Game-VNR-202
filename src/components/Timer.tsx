"use client";

import { useEffect } from "react";

interface TimerProps {
  timeRemaining: number;
  totalTime: number;
  isRunning: boolean;
  onTimeUp: () => void;
  onTick: () => void;
}

export default function Timer({
  timeRemaining,
  totalTime,
  isRunning,
  onTimeUp,
  onTick,
}: TimerProps) {
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      onTick();
      if (timeRemaining <= 1) {
        onTimeUp();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, timeRemaining, onTimeUp, onTick]);

  const percentage = (timeRemaining / totalTime) * 100;
  const isLowTime = timeRemaining <= 10;

  return (
    <div className="w-full rounded-xl border border-[#e8e2d9] bg-white p-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-[#5a5349]">
          Thời gian còn lại
        </span>
        <span
          className={`text-2xl font-bold tabular-nums ${
            isLowTime ? "text-[#c41e3a] animate-pulse" : "text-[#2d5a27]"
          }`}
        >
          {timeRemaining}s
        </span>
      </div>
      <div className="w-full bg-[#e8e2d9] rounded-full h-2.5 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${
            isLowTime ? "bg-[#c41e3a]" : "bg-[#2d5a27]"
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

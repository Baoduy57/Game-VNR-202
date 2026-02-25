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
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-600">
          Thời gian còn lại
        </span>
        <span
          className={`text-3xl font-bold ${
            isLowTime ? "text-red-600 animate-pulse" : "text-blue-600"
          }`}
        >
          {timeRemaining}s
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${
            isLowTime ? "bg-red-500" : "bg-blue-500"
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

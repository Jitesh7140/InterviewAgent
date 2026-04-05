import React from 'react'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

function Timer({ timeLeft, totalTime }) {
  const percentage = (timeLeft / totalTime) * 100;

  return (
    /* Container size control: Desktop pe 110px, Mobile pe 90px */
    <div className="w-24 h-24 md:w-28 md:h-28 flex items-center justify-center mx-auto transition-all">
      <CircularProgressbar 
        value={percentage} 
        text={`${timeLeft}s`} 
        strokeWidth={10} // Bar ki thickness thodi badhayi hai for better look
        styles={buildStyles({
          textSize: "22px", // Font size thoda kam kiya taaki box mein fit aaye
          pathColor: "#10b981", // Emerald 500
          textColor: timeLeft <= 10 ? "#ef4444" : "#1e293b", // 10s se kam hone par red color
          trailColor: "#f1f5f9",
          strokeLinecap: "round",
          pathTransitionDuration: 0.5,
        })} 
      />
    </div>
  )
}

export default Timer
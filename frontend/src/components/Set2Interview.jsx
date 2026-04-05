import React from 'react'
import malevideo from '../assets/Videos/male-ai.mp4'
import Timer from './Timer';

function Set2Interview({interviewData , onFinish}) {

  const {interviewId , questions , userName , creditsLeft} = interviewData;

 




  return (
    <>
    <video src={malevideo} autoPlay loop muted></video>


    <Timer  timeLeft={30} totalTime={60 } />
    </>
  )
}

export default Set2Interview
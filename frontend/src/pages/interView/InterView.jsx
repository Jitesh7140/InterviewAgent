import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Set1Setup from '../../components/Set1Steup' 
import Set2Interview from '../../components/Set2Interview'
import Set3Report from '../../components/Set3Report'

function InterView( ) {
  const [step,setStep] = useState(1)
  const [interviewData,setInterviewData] = useState(null)


  return (
    <div  >
      {step==1 && (
        <>
        <Set1Setup onStart={(data)=>{
          setInterviewData(data)
          setStep(2)
        }}/>  

        </>
      )}
      
      {step==2 && (
         <Set2Interview interviewData={interviewData}
         onFinish={(report)=>{setInterviewData(report)
          setStep(3)
        }}
         />

      )}
      
      {step==3 && (
        <Set3Report report={interviewData}  />
      )}
      
    </div>
  )
}

export default InterView
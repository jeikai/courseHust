import { ClockCircleOutlined } from '@ant-design/icons'
import { Button, ConfigProvider, Divider, Flex, Pagination, Popconfirm, Progress, Radio, Space, Typography } from 'antd'
import React, { useEffect, useState } from 'react'
import Question from './Question'
import { getQuizById } from '../api/quiz'

const Questions = ({lesson}) => {

  const [quiz, setQuiz] = useState(null)
  const [currentQuestion, setCurrentQuestion] = useState(1)
  const [answers, setAnswers] = useState([])
  const [duration, setDuration] = useState(null)
  useEffect(() => {
    // fetchQuestions()
    console.log(lesson);
    let newListAnswers = lesson?.questions.map(question => {
      return {
        id: question.id,
        choices: []
      }
    })
    console.log(newListAnswers);
    setAnswers(newListAnswers)
    setQuiz(lesson)
  }, [])

  const handlePrev = () => {
    if(currentQuestion > 1) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleNext = () => {
    if(currentQuestion < quiz?.questions?.length) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const showPopconfirm = () => {
    setOpen(true);
  };
  const handleOk = () => {
    setConfirmLoading(true);

    // Call api gửi đáp án

    
    setOpen(false);
    setConfirmLoading(false);
  };
  const handleCancel = () => {
    console.log('Clicked cancel button');
    setOpen(false);
  };

  const handleGetTime = () => {
    let endTime = localStorage.getItem('time')
    let now = new Date().getTime()
    let time = endTime - now

    if(time === 0) {
      // handleSubmit Question
      // handleOk()

      localStorage.removeItem('time')
      return 
    }

    let hours = Math.floor(time / (1000 * 60 * 60))
    let minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60))
    let seconds = Math.floor((time % (1000 * 60)) / 1000)

    let formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`

    console.log(formattedTime);
    setDuration(formattedTime)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      handleGetTime()
    }, 1000);
    return () => clearInterval(interval)
  }, [])

  return (
    <div className='p-8 shadow-lg text-base'>
      <Flex align='center' justify='space-between'>
        <Typography.Title level={3}>{quiz?.title}</Typography.Title>
        <Flex align='center' justify='center' gap={6} className='text-red-500'>
          <ClockCircleOutlined />
          <p>{duration}</p>
        </Flex>
      </Flex>
      <Divider />
      <Flex align='center' justify='space-between' className='mb-2'>
        <p>Exam process: </p>
        <p>Question {currentQuestion} out of {quiz?.questions?.length} </p>
      </Flex>
      <Progress percent={(currentQuestion) / quiz?.questions.length * 100} />
      {quiz &&
        <Question question={quiz?.questions[currentQuestion - 1]} answers={answers} current={currentQuestion} setAnswers={setAnswers} />
      }
      <Flex justify='space-between' align='center' className='mt-4'>
        <Button onClick={() => handlePrev()} className='bg-[#754FFE] text-white px-8' size='large'>Prev</Button>
        <Pagination style={{ marginBottom: 0 }} onChange={(e) => setCurrentQuestion(e)} total={quiz?.questions?.length} defaultPageSize={currentQuestion} current={currentQuestion} />

        {currentQuestion < quiz?.questions?.length &&
          <Button onClick={() => handleNext()} className='bg-[#754FFE] text-white px-8' size='large'>Next</Button>
        }


        {currentQuestion === quiz?.questions?.length &&
            <Popconfirm
            title="Bạn có chắc chắn nộp bài không?"
            description=""
            open={open}
            onConfirm={handleOk}
            okButtonProps={{
              loading: confirmLoading,
            }}
            onCancel={handleCancel}
          >
            <Button onClick={showPopconfirm} className='bg-[#754FFE] text-white px-8' size='large'>Submit</Button>
          </Popconfirm>
        }
      </Flex>
    </div>
  )
}

export default Questions
import {
  ConfigProvider,
  Flex,
  Input,
  Radio,
  Space,
  Switch,
  Typography,
} from "antd";
import React from "react";

const Question = ({ question, answers, current, setAnswers }) => {
  const handleSingleChoice = (e) => {
    console.log(answers);
    let newAnswers = answers;
    newAnswers[current - 1].choices = [e.target.value];
    setAnswers([...newAnswers]); 
  };

  const handleMultipleChoice = (e, value) => {
    console.log(answers);
    if (e) {
      let newAnswers = answers;
      newAnswers[current - 1].choices.push(value);
      setAnswers([...newAnswers]);
    } else {
      let newAnswers = answers;
      let index = newAnswers[current - 1].choices.findIndex(
        (item) => item === value
      );
      newAnswers[current - 1].choices.splice(index, 1);
      setAnswers([...newAnswers]);
    }
  };

  return (
    <Space direction="vertical w-full min-h-72">
      <Typography.Title level={3}>{question.title} ({question.level})</Typography.Title>
      <ConfigProvider
        theme={{
          components: {
            Radio: {
              radioSize: 20,
              dotSize: 10,
            },
          },
        }}
      >
        {question.type === "scq" && (
          <Radio.Group
            onChange={handleSingleChoice}
            className="w-full"
            size="large"
            value={answers[current - 1].choices[0]}
          >
            <Space direction="vertical" size={12} className="w-full">
              {question?.options.map((option, index) => {
                // console.log(option);
                return (
                  <Radio
                    key={index}
                    value={option.label}
                    className="w-full border p-4 rounded-md"
                  >
                    {option.label}
                  </Radio>
                );
              })}
            </Space>
          </Radio.Group>
        )}
        {question.type === "mcq" && (
          <Radio.Group className="w-full" size="large">
            <Space direction="vertical" size={12} className="w-full">
              {question?.options.map((option, index) => {
                console.log(option);
                return (
                  <Flex
                    align="center"
                    gap={12}
                    className="w-full border p-4 rounded-md"
                  >
                    <ConfigProvider
                      theme={{
                        components: {
                          Switch: {
                            // handleBg: '#ccc'
                          },
                        },
                        token: {
                          colorPrimary: "#754FFE",
                          /* here is your global tokens */
                        },
                      }}
                    >
                      <Switch
                        checked={
                          answers[current - 1].choices.includes(option.label)
                            ? true
                            : false
                        }
                        onChange={(e) => handleMultipleChoice(e, option.label)}
                      ></Switch>
                    </ConfigProvider>
                    <Typography.Text>{option.label}</Typography.Text>
                  </Flex>
                );
              })}
            </Space>
          </Radio.Group>
        )}
      </ConfigProvider>
    </Space>
  );
};

export default Question;

import {
  ConfigProvider,
  Flex,
  Input,
  Radio,
  Space,
  Checkbox,
  Typography,
} from "antd";
import React from "react";

const Question = ({ question, answers, current, setAnswers }) => {
  const handleTextChange = (value) => {
    const newAnswers = [...answers];
    newAnswers[current - 1].choices = value;
    setAnswers(newAnswers);
  };

  const handleSingleChoice = (e) => {
    let newAnswers = answers;
    newAnswers[current - 1].choices = [e.target.value];
    setAnswers([...newAnswers]);
  };

  const handleMultipleChoice = (e, value) => {
    if (e.target.checked) {
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
    <Space direction="vertical" className="w-full min-h-72">
      <Typography.Title level={3}>{question.title}</Typography.Title>
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
        {question.type === "single" && (
          <Radio.Group
            onChange={handleSingleChoice}
            className="w-full"
            size="large"
            value={answers[current - 1].choices[0]}
          >
            <Space direction="vertical" size={12} className="w-full">
              {question?.options.map((option, index) => (
                <Radio
                  key={index}
                  value={option.label}
                  className="w-full border p-4 rounded-md"
                >
                  {option.label}
                </Radio>
              ))}
            </Space>
          </Radio.Group>
        )}
        {question.type === "multiple" && (
          <Space direction="vertical" size={12} className="w-full">
            {question?.options.map((option, index) => (
              <Flex
                align="center"
                gap={12}
                className="w-full border p-4 rounded-md"
                key={index}
              >
                <Checkbox
                  checked={
                    answers[current - 1].choices.includes(option.label)
                      ? true
                      : false
                  }
                  onChange={(e) => handleMultipleChoice(e, option.label)}
                />
                <Typography.Text>{option.label}</Typography.Text>
              </Flex>
            ))}
          </Space>
        )}
        {question.type === "text" && (
          <Input.TextArea
            onChange={(e) => handleTextChange(e.target.value)}
            className="w-full p-4 rounded-md"
            size="large"
            value={answers[current - 1].choices || ""}
            placeholder="Fill your answer here..."
            autoSize={{ minRows: 4, maxRows: 10 }}
          />
        )}
      </ConfigProvider>
    </Space>
  );
};

export default Question;

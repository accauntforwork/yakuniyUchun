import React, { useState, useEffect, useRef } from "react";
import test12 from "./test.txt";
import closeIcon from "/close-line.svg";
import flagIcon from "/flag-fill.svg";

function Test() {
  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timer, setTimer] = useState(20 * 60); // 20 minutes in seconds
  const [isTestStarted, setIsTestStarted] = useState(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [totalAnswersCount, setTotalAnswersCount] = useState(0);
  const [selectedTestNumbers, setSelectedTestNumbers] = useState([]);
  const questionRefs = useRef([]);

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const fetchTestQuestions = async () => {
    try {
      const response = await fetch(test12);
      const data = await response.text();
      const questionsData = data.split("++++");
      const formattedQuestions = questionsData.map((questionBlock, index) => {
        const [questionText, ...optionsData] = questionBlock
          .trim()
          .split("====");
        let options = optionsData.map((option, optionIndex) => ({
          id: `${index}-${optionIndex}`, // Unique identifier for options
          text: option.trim().replace(/^#+/, ""), // Remove leading #
          isCorrect: option.trim().startsWith("#") ? true : false,
        }));
        options = shuffleArray(options); // Shuffle options
        return {
          uniqueId: `${index}-${Math.random().toString(36).substr(2, 9)}`, // Unique identifier for questions
          text: questionText.trim(),
          options,
        };
      });
      const shuffledQuestions = shuffleArray(formattedQuestions); // Shuffle questions
      const selectedQuestions = shuffledQuestions.slice(0, 50); // Select first 50 questions
      setQuestions(selectedQuestions);
    } catch (error) {
      console.error("Error fetching test questions:", error);
    }
  };

  useEffect(() => {
    fetchTestQuestions();
  }, []);

  useEffect(() => {
    if (isTestStarted && timer > 0) {
      const intervalId = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [isTestStarted, timer]);

  const startTest = () => {
    setIsTestStarted(true);
    setTimer(20 * 60); // Reset timer
    setSelectedAnswers({});
    setCorrectAnswersCount(0);
    setTotalAnswersCount(0);
    setSelectedTestNumbers([]);
    fetchTestQuestions(); // Refetch and shuffle questions
  };

  const endTest = () => {
    setTimer(0);
  };

  const handleAnswerSelection = (uniqueId, option) => {
    if (selectedAnswers[uniqueId]) {
      return; // Do nothing if an answer is already selected for this question
    }

    setSelectedAnswers((prev) => ({ ...prev, [uniqueId]: option.text }));
    setTotalAnswersCount((prevCount) => prevCount + 1);
    if (option.isCorrect) {
      setCorrectAnswersCount((prevCount) => prevCount + 1);
    }
    setSelectedTestNumbers((prevNumbers) => {
      const newNumbers = [...prevNumbers, uniqueId];
      console.log(uniqueId);
      return newNumbers;
    });
  };

  const handleTestNumberClick = (index) => {
    questionRefs.current[index].scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex flex-col mx-auto bg-[#ECEFF4]">
      {!isTestStarted && (
        <div className="w-[100%] h-[95vh] flex justify-center items-center">
          <button
            className="bg-[#3C8DBC] rounded-sm mt-4 p-2 text-white text-2xl hover:bg-opacity-60"
            onClick={startTest}
          >
            Testni boshlash
          </button>
        </div>
      )}
      {isTestStarted && timer > 0 && (
        <div className="p-4 bg-[#3C8DBC] w-[100vw] sticky top-0 right-0 text-[#E6FBFF] flex items-center justify-between gap-4 px-[5%] z-10">
          <div>
            <div className="text-2xl">
              1:
              {Math.floor(timer / 60)}:
              {timer % 60 < 10 ? `0${timer % 60}` : timer % 60}
            </div>
          </div>
          {/* <div className="flex gap-1 flex-wrap">
            <span>To'g'ri javoblar: {correctAnswersCount}</span>
            <span>Umumiy: {totalAnswersCount}</span>
          </div> */}
          <div className="flex gap-1 flex-wrap">
            <button onClick={startTest} className="">
              <img src={closeIcon} alt="" />
            </button>
            <button onClick={endTest} className="">
              <img src={flagIcon} alt="" />
            </button>
          </div>
        </div>
      )}
      {isTestStarted && timer > 0 && (
        <div className="px-[5%] text-[#545552]">
          <div className="w-full p-4 flex flex-col lg:flex-row gap-4 lg:items-start">
            <div>
              {questions.map((question, index) => (
                <div
                  key={question.uniqueId}
                  className=" mt-2 rounded-md border-t-4 border-[#E0E3EA] bg-white"
                  ref={(el) => (questionRefs.current[index] = el)}
                >
                  <h2 className="text-xl border-b-[1px] border-[#E0E3EA] p-3">
                    {index + 1}. {question.text}
                  </h2>
                  <ul className="flex flex-col gap-2 py-2">
                    {question.options.map((option) => (
                      <li
                        className="px-2 py-1 border-black bg-white hover:bg-emerald-300 flex gap-2 items-center relative"
                        key={option.id}
                        onClick={() =>
                          handleAnswerSelection(question.uniqueId, option)
                        }
                        style={{
                          cursor: "pointer",
                          backgroundColor:
                            selectedAnswers[question.uniqueId] === option.text
                              ? option.isCorrect
                                ? "#69c463"
                                : "red"
                              : selectedAnswers[question.uniqueId] &&
                                option.isCorrect
                              ? "#7cee74"
                              : "bg-white",
                          border:
                            selectedAnswers[question.uniqueId] === option.text
                              ? option.isCorrect
                                ? "2px solid green"
                                : "2px solid red"
                              : selectedAnswers[question.uniqueId] &&
                                option.isCorrect
                              ? "2px solid red"
                              : "2px solid transparent",
                          pointerEvents: selectedAnswers[question.uniqueId]
                            ? "none"
                            : "auto", // Disable further clicks if an answer is already selected
                        }}
                      >
                        <div
                          className="w-4 h-4 p-1 rounded-full border-[1px] border-gray-500 bg-[#F2F2F2] absolute"
                          style={{
                            border:
                              selectedAnswers[question.uniqueId] === option.text
                                ? "3px solid #3C8DBC"
                                : "",
                          }}
                        ></div>
                        <div className="ml-5">{option.text}</div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="w-full lg:max-w-[380px] border-t-4 border-[#E0E3EA] rounded-md bg-white lg:sticky top-20">
              <h1 className="border-b-[1px] border-[#E0E3EA] text-xl p-2 flex justify-between items-center">
                <span>Javoblar</span>
                <div>
                  <span className="text-xl text-green-600">
                    {correctAnswersCount}✅{" "}
                  </span>
                  |{" "}
                  <span className="text-red-600">
                    {totalAnswersCount - correctAnswersCount}
                  </span>
                  ❎ | <span>{totalAnswersCount}</span>
                </div>
              </h1>
              <div className="flex flex-wrap gap-1 p-2 border-b-[1px] border-[#E0E3EA] pb-4 mb-3">
                {questions.map((_, i) => (
                  <div
                    key={i}
                    className="border flex h-4 w-4 p-[20px] text-[16px] justify-center items-center cursor-pointer rounded-full"
                    style={{
                      backgroundColor: selectedTestNumbers.includes(
                        questions[i].uniqueId
                      )
                        ? "#367AB1"
                        : "white",
                      color: selectedTestNumbers.includes(questions[i].uniqueId)
                        ? "white"
                        : "black",
                    }}
                    onClick={() => handleTestNumberClick(i)}
                  >
                    {i + 1}
                  </div>
                ))}
              </div>
              <div className="w-[90%] mx-auto">
                <button
                  onClick={endTest}
                  className="bg-[#3C8DBC] rounded-sm py-1 hover:bg-blue-300 w-full text-white  mb-2 "
                >
                  Yakunlash
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {isTestStarted && timer === 0 && (
        <div className="w-[100%] h-[95vh] flex justify-center items-center text-3xl flex-col gap-4 ">
          <span>To'g'ri javoblar : {correctAnswersCount}</span>
          <span className="text-center">Umumiy: {totalAnswersCount}</span>
          <button
            onClick={startTest}
            className="bg-[#3C8DBC] rounded-sm p-2 hover:bg-blue-300 text-white"
          >
            Testni qaytadan boshlash
          </button>
        </div>
      )}
    </div>
  );
}

export default Test;

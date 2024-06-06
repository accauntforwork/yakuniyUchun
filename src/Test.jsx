import React, { useState, useEffect, useRef } from "react";
import test12 from "./test.txt";

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
      const questionsData = data.split("+++++");
      const formattedQuestions = questionsData.map((questionBlock, index) => {
        const [questionText, ...optionsData] = questionBlock
          .trim()
          .split("=====");
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
      return newNumbers;
    });
  };

  const handleTestNumberClick = (index) => {
    questionRefs.current[index].scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex p-4 flex-col">
      {!isTestStarted && (
        <div className="w-[100%] h-[95vh] flex justify-center items-center">
          <button
            className="bg-blue-500 rounded-lg mt-4 p-2 text-white text-2xl"
            onClick={startTest}
          >
            Testni boshlash
          </button>
        </div>
      )}
      {isTestStarted && timer > 0 && (
        <div className="p-4 bg-blue-500 w-full rounded-lg sticky top-0 right-0 text-white flex items-center gap-4 flex-col">
          <div>
            <div className="font-bold text-red-500 text-xl text-center">
              {Math.floor(timer / 60)}:
              {timer % 60 < 10 ? `0${timer % 60}` : timer % 60}
            </div>
          </div>
          <div className="flex gap-1 flex-wrap">
            <span>To'g'ri javoblar: {correctAnswersCount}</span>
            <span>Umumiy: {totalAnswersCount}</span>
          </div>
          <div className="flex gap-1 flex-wrap">
            <button
              onClick={startTest}
              className="bg-blue-400 rounded-lg p-0.5 px-2 hover:bg-blue-200"
            >
              Qayta boshlash
            </button>
            <button
              onClick={endTest}
              className="bg-blue-400 rounded-lg p-0.5 px-2 hover:bg-blue-200"
            >
              Tugatish
            </button>
          </div>
        </div>
      )}
      {isTestStarted && timer > 0 && (
        <div>
          <div className="w-full p-4 bg-blue-200 bg-opacity-20 rounded-lg">
            {/* Render the table of test numbers */}
            <div className="flex flex-wrap max-w-[400px] gap-1 bg-blue-200 bg-opacity-20 p-2 rounded-md">
              {questions.map((_, i) => (
                <div
                  key={i}
                  className="border flex h-4 w-4 p-4 justify-center items-center cursor-pointer rounded-full"
                  style={{
                    backgroundColor: selectedTestNumbers.includes(
                      questions[i].uniqueId
                    )
                      ? "blue"
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
            {questions.map((question, index) => (
              <div
                key={question.uniqueId}
                className="p-2 mt-4 rounded-md"
                ref={(el) => (questionRefs.current[index] = el)}
              >
                <h2 className="text-xl my-4 p-2 rounded-lg bg-blue-300">
                  {index + 1} {question.text}
                </h2>
                <ul className="flex flex-col gap-2">
                  {question.options.map((option) => (
                    <li
                      className="px-2 py-1 border-black bg-white rounded-lg hover:bg-emerald-300"
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
                      {option.text}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
      {isTestStarted && timer === 0 && (
        <div className="w-[100%] h-[95vh] flex justify-center items-center text-3xl flex-col gap-4">
          <span>To'g'ri javoblar : {correctAnswersCount}</span>
          <span className="text-center">Umumiy: {totalAnswersCount}</span>
          <button
            onClick={startTest}
            className="bg-blue-500 rounded-lg p-2 hover:bg-blue-300 text-white"
          >
            Testni qaytadan boshlash
          </button>
        </div>
      )}
    </div>
  );
}

export default Test;

// ---------------++++++++++++++++++++++++++++++--++++++++++++++++----------------------------------++++++++++++++++++--------------

// import React, { useState, useEffect, useRef } from "react";
// import test12 from "./test.txt";

// function Test() {
//   const [questions, setQuestions] = useState([]);
//   const [selectedAnswers, setSelectedAnswers] = useState({});
//   const [timer, setTimer] = useState(20 * 60); // 20 minutes in seconds
//   const [isTestStarted, setIsTestStarted] = useState(false);
//   const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
//   const [totalAnswersCount, setTotalAnswersCount] = useState(0);
//   const [selectedTestNumbers, setSelectedTestNumbers] = useState([]);
//   const questionRefs = useRef([]);

//   const shuffleArray = (array) => {
//     for (let i = array.length - 1; i > 0; i--) {
//       const j = Math.floor(Math.random() * (i + 1));
//       [array[i], array[j]] = [array[j], array[i]];
//     }
//     return array;
//   };

//   const fetchTestQuestions = async () => {
//     try {
//       const response = await fetch(test12);
//       const data = await response.text();
//       const questionsData = data.split("+++++");
//       const formattedQuestions = questionsData.map((questionBlock, index) => {
//         const [questionText, ...optionsData] = questionBlock
//           .trim()
//           .split("=====");
//         let options = optionsData.map((option, optionIndex) => ({
//           id: `${index}-${optionIndex}`, // Unique identifier for options
//           text: option.trim().replace(/^#+/, ""), // Remove leading #
//           isCorrect: option.trim().startsWith("#") ? true : false,
//         }));
//         options = shuffleArray(options); // Shuffle options
//         return {
//           id: index, // Unique identifier for questions
//           text: questionText.trim(),
//           options,
//         };
//       });
//       const shuffledQuestions = shuffleArray(formattedQuestions); // Shuffle questions
//       const selectedQuestions = shuffledQuestions.slice(0, 50); // Select first 50 questions
//       setQuestions(selectedQuestions);
//     } catch (error) {
//       console.error("Error fetching test questions:", error);
//     }
//   };

//   useEffect(() => {
//     fetchTestQuestions();
//   }, []);

//   useEffect(() => {
//     if (isTestStarted && timer > 0) {
//       const intervalId = setInterval(() => {
//         setTimer((prevTimer) => prevTimer - 1);
//       }, 1000);
//       return () => clearInterval(intervalId);
//     }
//   }, [isTestStarted, timer]);

//   const startTest = () => {
//     setIsTestStarted(true);
//     setTimer(20 * 60); // Reset timer
//     setSelectedAnswers({});
//     setCorrectAnswersCount(0);
//     setTotalAnswersCount(0);
//     setSelectedTestNumbers([]);
//     fetchTestQuestions(); // Refetch and shuffle questions
//   };

//   const endTest = () => {
//     setTimer(0);
//   };

//   const handleAnswerSelection = (questionId, option) => {
//     if (selectedAnswers[questionId]) {
//       return; // Do nothing if an answer is already selected for this question
//     }

//     setSelectedAnswers((prev) => ({ ...prev, [questionId]: option.text }));
//     setTotalAnswersCount((prevCount) => prevCount + 1);
//     if (option.isCorrect) {
//       setCorrectAnswersCount((prevCount) => prevCount + 1);
//     }
//     setSelectedTestNumbers((prevNumbers) => {
//       const newNumbers = [...prevNumbers, questionId + 1];
//       return newNumbers;
//     });
//   };

//   const handleTestNumberClick = (testNumber) => {
//     questionRefs.current[testNumber - 1].scrollIntoView({ behavior: "smooth" });
//   };

//   return (
//     <div className="flex p-4 flex-col">
//       {!isTestStarted && (
//         <div className="w-[100vw] h-[100vh] flex justify-center items-center">
//           <button
//             className="bg-blue-500 rounded-lg mt-4 p-2 text-white text-2xl"
//             onClick={startTest}
//           >
//             Testni boshlash
//           </button>
//         </div>
//       )}
//       {isTestStarted && timer > 0 && (
//         <div className="p-4 bg-blue-500 h-10 w-full rounded-lg sticky top-0 right-0 text-white flex items-center gap-4">
//           <div>
//             <div className="font-bold text-red-500 text-xl text-center">
//               {Math.floor(timer / 60)}:
//               {timer % 60 < 10 ? `0${timer % 60}` : timer % 60}
//             </div>
//           </div>
//           <div>
//             To'g'ri javoblar: {correctAnswersCount} Umumiy: {totalAnswersCount}
//           </div>
//           <button
//             onClick={startTest}
//             className="bg-blue-400 rounded-lg p-0.5 px-2 hover:bg-blue-200"
//           >
//             Qayta boshlash
//           </button>
//           <button
//             onClick={endTest}
//             className="bg-blue-400 rounded-lg p-0.5 px-2 hover:bg-blue-200"
//           >
//             Tugatish
//           </button>
//         </div>
//       )}
//       {isTestStarted && timer > 0 && (
//         <div>
//           <div className="w-full p-4 bg-blue-200 bg-opacity-20 rounded-lg">
//             {/* Render the table of test numbers */}
//             <table className="w-full table-fixed mb-4">
//               <tbody>
//                 <tr>
//                   {[...Array(50)].map((_, i) => (
//                     <td
//                       key={i + 1}
//                       className="border px-2 py-1 text-center cursor-pointer"
//                       style={{
//                         backgroundColor: selectedTestNumbers.includes(i + 1)
//                           ? "blue"
//                           : "white",
//                         color: selectedTestNumbers.includes(i + 1)
//                           ? "white"
//                           : "black",
//                       }}
//                       onClick={() => handleTestNumberClick(i + 1)}
//                     >
//                       {i + 1}
//                     </td>
//                   ))}
//                 </tr>
//               </tbody>
//             </table>
//             {questions.map((question, index) => (
//               <div
//                 key={question.id}
//                 className="p-2 mt-4 rounded-md"
//                 ref={(el) => (questionRefs.current[index] = el)}
//               >
//                 <h2 className="text-xl my-4 p-2 rounded-lg bg-blue-300">
//                   {index + 1} {question.text}
//                 </h2>
//                 <ul className="flex flex-col gap-2">
//                   {question.options.map((option) => (
//                     <li
//                       className="px-2 py-1 border-black bg-white rounded-lg hover:bg-emerald-300"
//                       key={option.id}
//                       onClick={() => handleAnswerSelection(question.id, option)}
//                       style={{
//                         cursor: "pointer",
//                         backgroundColor:
//                           selectedAnswers[question.id] === option.text
//                             ? option.isCorrect
//                               ? "#69c463"
//                               : "red"
//                             : selectedAnswers[question.id] && option.isCorrect
//                             ? "#7cee74"
//                             : "bg-white",
//                         border:
//                           selectedAnswers[question.id] === option.text
//                             ? option.isCorrect
//                               ? "2px solid green"
//                               : "2px solid red"
//                             : selectedAnswers[question.id] && option.isCorrect
//                             ? "2px solid red"
//                             : "2px solid transparent",
//                         pointerEvents: selectedAnswers[question.id]
//                           ? "none"
//                           : "auto", // Disable further clicks if an answer is already selected
//                       }}
//                     >
//                       {option.text}
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//       {isTestStarted && timer === 0 && (
//         <div className="w-[100vw] h-[100vh] flex justify-center items-center text-4xl flex-col gap-4">
//           <span>To'g'ri javoblar : {correctAnswersCount}</span>
//           <span className="text-center">Umumiy: {totalAnswersCount}</span>
//           <button
//             onClick={startTest}
//             className="bg-blue-500 rounded-lg p-2 hover:bg-blue-300 text-white"
//           >
//             Testni qaytadan boshlash
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Test;

// -------------------------------------------------------------------------------------

// import React, { useState, useEffect, useRef } from "react";
// import test12 from "./test.txt";

// function Test() {
//   const [questions, setQuestions] = useState([]);
//   const [selectedAnswers, setSelectedAnswers] = useState({});
//   const [timer, setTimer] = useState(20 * 60); // 20 minutes in seconds
//   const [isTestStarted, setIsTestStarted] = useState(false);
//   const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
//   const [totalAnswersCount, setTotalAnswersCount] = useState(0);
//   const [selectedTestNumber, setSelectedTestNumber] = useState(null);
//   const questionRefs = useRef([]);

//   const shuffleArray = (array) => {
//     for (let i = array.length - 1; i > 0; i--) {
//       const j = Math.floor(Math.random() * (i + 1));
//       [array[i], array[j]] = [array[j], array[i]];
//     }
//     return array;
//   };

//   const fetchTestQuestions = async () => {
//     try {
//       const response = await fetch(test12);
//       const data = await response.text();
//       const questionsData = data.split("+++++");
//       const formattedQuestions = questionsData.map((questionBlock, index) => {
//         const [questionText, ...optionsData] = questionBlock
//           .trim()
//           .split("=====");
//         let options = optionsData.map((option, optionIndex) => ({
//           id: `${index}-${optionIndex}`, // Unique identifier for options
//           text: option.trim().replace(/^#+/, ""), // Remove leading #
//           isCorrect: option.trim().startsWith("#") ? true : false,
//         }));
//         options = shuffleArray(options); // Shuffle options
//         return {
//           id: index, // Unique identifier for questions
//           text: questionText.trim(),
//           options,
//         };
//       });
//       const shuffledQuestions = shuffleArray(formattedQuestions); // Shuffle questions
//       const selectedQuestions = shuffledQuestions.slice(0, 50); // Select first 50 questions
//       setQuestions(selectedQuestions);
//     } catch (error) {
//       console.error("Error fetching test questions:", error);
//     }
//   };

//   useEffect(() => {
//     fetchTestQuestions();
//   }, []);

//   useEffect(() => {
//     if (isTestStarted && timer > 0) {
//       const intervalId = setInterval(() => {
//         setTimer((prevTimer) => prevTimer - 1);
//       }, 1000);
//       return () => clearInterval(intervalId);
//     }
//   }, [isTestStarted, timer]);

//   const startTest = () => {
//     setIsTestStarted(true);
//     setTimer(20 * 60); // Reset timer
//     setSelectedAnswers({});
//     setCorrectAnswersCount(0);
//     setTotalAnswersCount(0);
//     fetchTestQuestions(); // Refetch and shuffle questions
//   };

//   const endTest = () => {
//     setTimer(0);
//   };

//   const handleAnswerSelection = (questionId, option) => {
//     if (selectedAnswers[questionId]) {
//       return; // Do nothing if an answer is already selected for this question
//     }

//     setSelectedAnswers((prev) => ({ ...prev, [questionId]: option.id }));
//     setTotalAnswersCount((prevCount) => prevCount + 1);
//     if (option.isCorrect) {
//       setCorrectAnswersCount((prevCount) => prevCount + 1);
//     }
//     setSelectedTestNumber(questionId + 1); // Set the selected test number
//   };

//   const handleTestNumberClick = (testNumber) => {
//     setSelectedTestNumber(testNumber);
//     questionRefs.current[testNumber - 1].scrollIntoView({ behavior: "smooth" });
//   };

//   return (
//     <div className="flex p-4 flex-col">
//       {!isTestStarted && (
//         <div className="w-[100vw] h-[100vh] flex justify-center items-center">
//           <button
//             className="bg-blue-500 rounded-lg mt-4 p-2 text-white text-2xl"
//             onClick={startTest}
//           >
//             Testni boshlash
//           </button>
//         </div>
//       )}
//       {isTestStarted && timer > 0 && (
//         <div className="p-4 bg-blue-500 h-10 w-full rounded-lg sticky top-0 right-0 text-white flex items-center gap-4">
//           <div>
//             <div className="font-bold text-red-500 text-xl text-center">
//               {Math.floor(timer / 60)}:
//               {timer % 60 < 10 ? `0${timer % 60}` : timer % 60}
//             </div>
//           </div>
//           <div>
//             To'g'ri javoblar: {correctAnswersCount} Umumiy: {totalAnswersCount}
//           </div>
//           <button
//             onClick={startTest}
//             className="bg-blue-400 rounded-lg p-0.5 px-2 hover:bg-blue-200"
//           >
//             Qayta boshlash
//           </button>
//           <button
//             onClick={endTest}
//             className="bg-blue-400 rounded-lg p-0.5 px-2 hover:bg-blue-200"
//           >
//             Tugatish
//           </button>
//         </div>
//       )}
//       {isTestStarted && timer > 0 && (
//         <div>
//           <div className="w-full p-4 bg-blue-200 bg-opacity-20 rounded-lg">
//             {/* Render the table of test numbers */}
//             <table className="w-full table-fixed mb-4">
//               <tbody>
//                 <tr>
//                   {[...Array(50)].map((_, i) => (
//                     <td
//                       key={i + 1}
//                       className="border px-2 py-1 text-center cursor-pointer"
//                       style={{
//                         backgroundColor:
//                           selectedTestNumber === i + 1 ? "blue" : "white",
//                         color: selectedTestNumber === i + 1 ? "white" : "black",
//                       }}
//                       onClick={() => handleTestNumberClick(i + 1)}
//                     >
//                       {i + 1}
//                     </td>
//                   ))}
//                 </tr>
//               </tbody>
//             </table>
//             {questions.map((question, index) => (
//               <div
//                 key={question.id}
//                 className="p-2 mt-4 rounded-md"
//                 ref={(el) => (questionRefs.current[index] = el)}
//               >
//                 <h2 className="text-xl my-4 p-2 rounded-lg bg-blue-300">
//                   {index + 1} {question.text}
//                 </h2>
//                 <ul className="flex flex-col gap-2">
//                   {question.options.map((option) => (
//                     <li
//                       className="px-2 py-1 border-black bg-white rounded-lg hover:bg-emerald-300"
//                       key={option.id}
//                       onClick={() => handleAnswerSelection(question.id, option)}
//                       style={{
//                         cursor: "pointer",
//                         backgroundColor:
//                           selectedAnswers[question.id] === option.id
//                             ? option.isCorrect
//                               ? "#69c463"
//                               : "red"
//                             : selectedAnswers[question.id] && option.isCorrect
//                             ? "#7cee74"
//                             : "bg-white",
//                         border:
//                           selectedAnswers[question.id] === option.id
//                             ? option.isCorrect
//                               ? "2px solid green"
//                               : "2px solid red"
//                             : selectedAnswers[question.id] && option.isCorrect
//                             ? "2px solid red"
//                             : "2px solid transparent",
//                         pointerEvents: selectedAnswers[question.id]
//                           ? "none"
//                           : "auto", // Disable further clicks if an answer is already selected
//                       }}
//                     >
//                       {option.text}
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//       {isTestStarted && timer === 0 && (
//         <div className="w-[100vw] h-[100vh] flex justify-center items-center text-4xl flex-col gap-4">
//           <span>To'g'ri javoblar : {correctAnswersCount}</span>
//           <span className="text-center">Umumiy: {totalAnswersCount}</span>
//           <button
//             onClick={startTest}
//             className="bg-blue-500 rounded-lg p-2 hover:bg-blue-300 text-white"
//           >
//             Testni qaytadan boshlash
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Test;
// ---------------------------------------------------------orginal test-------------------------------------------------------
// import React, { useState, useEffect } from "react";
// import test12 from "./test.txt";

// function Test() {
//   const [questions, setQuestions] = useState([]);
//   const [selectedAnswers, setSelectedAnswers] = useState({});
//   const [timer, setTimer] = useState(20 * 60); // 20 minutes in seconds
//   const [isTestStarted, setIsTestStarted] = useState(false);
//   const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
//   const [totalAnswersCount, setTotalAnswersCount] = useState(0);

//   const shuffleArray = (array) => {
//     for (let i = array.length - 1; i > 0; i--) {
//       const j = Math.floor(Math.random() * (i + 1));
//       [array[i], array[j]] = [array[j], array[i]];
//     }
//     return array;
//   };

//   const fetchTestQuestions = async () => {
//     try {
//       const response = await fetch(test12);
//       const data = await response.text();
//       const questionsData = data.split("+++++");
//       const formattedQuestions = questionsData.map((questionBlock, index) => {
//         const [questionText, ...optionsData] = questionBlock
//           .trim()
//           .split("=====");
//         let options = optionsData.map((option, optionIndex) => ({
//           id: `${index}-${optionIndex}`, // Unique identifier for options
//           text: option.trim().replace(/^#+/, ""), // Remove leading #
//           isCorrect: option.trim().startsWith("#") ? true : false,
//         }));
//         options = shuffleArray(options); // Shuffle options
//         return {
//           id: index, // Unique identifier for questions
//           text: questionText.trim(),
//           options,
//         };
//       });
//       const shuffledQuestions = shuffleArray(formattedQuestions); // Shuffle questions
//       const selectedQuestions = shuffledQuestions.slice(0, 50); // Select first 50 questions
//       setQuestions(selectedQuestions);
//     } catch (error) {
//       console.error("Error fetching test questions:", error);
//     }
//   };

//   useEffect(() => {
//     fetchTestQuestions();
//   }, []);

//   useEffect(() => {
//     if (isTestStarted && timer > 0) {
//       const intervalId = setInterval(() => {
//         setTimer((prevTimer) => prevTimer - 1);
//       }, 1000);
//       return () => clearInterval(intervalId);
//     }
//   }, [isTestStarted, timer]);

//   const startTest = () => {
//     setIsTestStarted(true);
//     setTimer(20 * 60); // Reset timer
//     setSelectedAnswers({});
//     setCorrectAnswersCount(0);
//     setTotalAnswersCount(0);
//     fetchTestQuestions(); // Refetch and shuffle questions
//   };
//   const endTest = () => {
//     setTimer(0);
//   };

//   const handleAnswerSelection = (questionId, option) => {
//     if (selectedAnswers[questionId]) {
//       return; // Do nothing if an answer is already selected for this question
//     }

//     setSelectedAnswers((prev) => ({ ...prev, [questionId]: option.id }));
//     setTotalAnswersCount((prevCount) => prevCount + 1);
//     if (option.isCorrect) {
//       setCorrectAnswersCount((prevCount) => prevCount + 1);
//     }
//   };
//   return (
//     <div className="flex p-4 flex-col ">
//       {!isTestStarted && (
//         <div className="w-[100vw] h-[100vh] flex justify-center items-center">
//           <button
//             className="bg-blue-500 rounded-lg mt-4 p-2 text-white text-2xl"
//             onClick={startTest}
//           >
//             Testni boshlash
//           </button>
//         </div>
//       )}
//       {isTestStarted &&
//         (timer > 0 ? (
//           <div className="p-4 bg-blue-500 h-10 w-full rounded-lg sticky top-0 right-0 text-white flex items-center gap-4">
//             <div>
//               <div className="font-bold text-red-500 text-xl text-center">
//                 {Math.floor(timer / 60)}:
//                 {timer % 60 < 10 ? `0${timer % 60}` : timer % 60}
//               </div>
//             </div>
//             <div>
//               To'g'ri javoblar: {correctAnswersCount} Umumiy:{" "}
//               {totalAnswersCount}
//             </div>
//             <button
//               onClick={startTest}
//               className="bg-blue-400 rounded-lg p-0.5 px-2 hover:bg-blue-200"
//             >
//               Qayta boshlash
//             </button>
//             <button
//               onClick={endTest}
//               className="bg-blue-400 rounded-lg p-0.5 px-2 hover:bg-blue-200"
//             >
//               Tugatish
//             </button>
//           </div>
//         ) : (
//           ""
//         ))}

//       {isTestStarted &&
//         (timer > 0 ? (
//           <div>
//             <div className="w-full p-4 bg-blue-200 bg-opacity-20 rounded-lg">
//               {questions.map((question, index) => (
//                 <div key={question.id} className="p-2 mt-4 rounded-md">
//                   <h2 className="text-xl my-4 p-2 rounded-lg bg-blue-300">
//                     {index + 1} {question.text}
//                   </h2>
//                   <ul className="flex flex-col gap-2">
//                     {question.options.map((option) => (
//                       <li
//                         className="px-2 py-1 border-black bg-white rounded-lg hover:bg-emerald-300"
//                         key={option.id}
//                         onClick={() =>
//                           handleAnswerSelection(question.id, option)
//                         }
//                         style={{
//                           cursor: "pointer",
//                           backgroundColor:
//                             selectedAnswers[question.id] === option.id
//                               ? option.isCorrect
//                                 ? "#69c463"
//                                 : "red"
//                               : selectedAnswers[question.id] && option.isCorrect
//                               ? "#7cee74"
//                               : "bg-white",
//                           border:
//                             selectedAnswers[question.id] === option.id
//                               ? option.isCorrect
//                                 ? "2px solid green"
//                                 : "2px solid red"
//                               : selectedAnswers[question.id] && option.isCorrect
//                               ? "2px solid red"
//                               : "2px solid transparent",
//                           pointerEvents: selectedAnswers[question.id]
//                             ? "none"
//                             : "auto", // Disable further clicks if an answer is already selected
//                         }}
//                       >
//                         {option.text}
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               ))}
//             </div>
//           </div>
//         ) : (
//           <div className="w-[100vw] h-[100vh] flex justify-center items-center text-4xl flex-col gap-4">
//             <span>To'g'ri javoblar : {correctAnswersCount}</span>
//             <span className="text-center">Umumiy: {totalAnswersCount}</span>
//             <button
//               onClick={startTest}
//               className="bg-blue-500 rounded-lg p-2 hover:bg-blue-300 text-white"
//             >
//               Testni qaytadan boshlash
//             </button>
//           </div>
//         ))}
//     </div>
//   );
// }

// export default Test;

import React, { useState, useEffect } from "react";
import test12 from "./test.txt";

function Test() {
  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timer, setTimer] = useState(20 * 60); // 20 minutes in seconds
  const [isTestStarted, setIsTestStarted] = useState(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);

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
          id: index, // Unique identifier for questions
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
    fetchTestQuestions(); // Refetch and shuffle questions
  };

  const handleAnswerSelection = (questionId, option) => {
    if (selectedAnswers[questionId]) {
      return; // Do nothing if an answer is already selected for this question
    }

    setSelectedAnswers((prev) => ({ ...prev, [questionId]: option.id }));
    if (option.isCorrect) {
      setCorrectAnswersCount((prevCount) => prevCount + 1);
    }
  };

  return (
    <div className="flex p-4">
      {!isTestStarted && (
        <div className="w-[100vw] h-[100vh] flex justify-center items-center">
          <button
            className="bg-blue-500 rounded-lg mt-4 p-2"
            onClick={startTest}
          >
            Testni boshlash
          </button>
        </div>
      )}
      {isTestStarted &&
        (timer > 0 ? (
          <div className="w-[80%] p-4 bg-blue-200 bg-opacity-20 rounded-lg">
            {questions.map((question, index) => (
              <div key={question.id}>
                <h2 className="text-2xl my-4 p-2 rounded-lg bg-blue-300">
                  {index + 1} {question.text}
                </h2>
                <ul className="flex flex-col gap-2">
                  {question.options.map((option) => (
                    <li
                      className="px-2 py-1 border-black rounded-lg hover:bg-emerald-400"
                      key={option.id}
                      onClick={() => handleAnswerSelection(question.id, option)}
                      style={{
                        cursor: "pointer",
                        backgroundColor:
                          selectedAnswers[question.id] === option.id
                            ? option.isCorrect
                              ? "#69c463"
                              : "rgba(255, 0, 0, 0.144)"
                            : "transparent",
                        border:
                          selectedAnswers[question.id] === option.id
                            ? option.isCorrect
                              ? "2px solid green"
                              : "2px solid red"
                            : "2px solid transparent",
                        pointerEvents: selectedAnswers[question.id]
                          ? "none"
                          : "auto", // Disable further clicks if an answer is already selected
                      }}
                    >
                      {option.text}
                    </li>
                  ))}
                </ul>
                <hr />
              </div>
            ))}
          </div>
        ) : (
          <div className="w-[100vw] h-[100vh] flex justify-center items-center text-4xl flex-col">
            To'g'ri javoblar : {correctAnswersCount}
            <button
              onClick={startTest}
              className="bg-blue-500 rounded-lg mt-4 p-2"
            >
              Testni qaytadan boshlash
            </button>
          </div>
        ))}
      {isTestStarted &&
        (timer > 0 ? (
          <div className="p-4 bg-blue-500 h-60 w-[18%] rounded-lg mt-4 ml-4 sticky top-6 right-6 text-white flex flex-col items-center">
            <div>
              Qolgan vaqtingiz:
              <div className="font-bold text-red-500 text-xl text-center">
                {Math.floor(timer / 60)}:
                {timer % 60 < 10 ? `0${timer % 60}` : timer % 60}
              </div>
            </div>
            <div>To'g'ri javoblar: {correctAnswersCount}</div>
            <button
              onClick={startTest}
              className="bg-red-500 rounded-lg mt-4 p-2"
            >
              Testni qaytadan boshlash
            </button>
          </div>
        ) : (
          ""
        ))}
    </div>
  );
}

export default Test;

// ---------------------------------------------------------------------------------
// import React, { useState, useEffect } from "react";
// import test12 from "./test.txt";

// function Test() {
//   const [questions, setQuestions] = useState([]);
//   const [selectedAnswers, setSelectedAnswers] = useState({});
//   const [timer, setTimer] = useState(20 * 60); // 20 minutes in seconds
//   const [isTestStarted, setIsTestStarted] = useState(false);
//   const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
//   let countTest = 1;

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
//       setQuestions(shuffleArray(formattedQuestions)); // Shuffle questions
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
//     countTest = 1;
//     setIsTestStarted(true);
//     setTimer(20 * 60); // Reset timer
//     setSelectedAnswers({});
//     setCorrectAnswersCount(0);
//     fetchTestQuestions(); // Refetch and shuffle questions
//   };

//   const handleAnswerSelection = (questionId, option) => {
//     if (selectedAnswers[questionId]) {
//       return; // Do nothing if an answer is already selected for this question
//     }

//     setSelectedAnswers((prev) => ({ ...prev, [questionId]: option.id }));
//     if (option.isCorrect) {
//       setCorrectAnswersCount((prevCount) => prevCount + 1);
//     }
//   };

//   return (
//     <div className="flex p-4">
//       {!isTestStarted && (
//         <div className="w-[100vw] h-[100vh] flex justify-center items-center">
//           <button
//             className="bg-blue-500 rounded-lg mt-4 p-2"
//             onClick={startTest}
//           >
//             Testni boshlash
//           </button>
//         </div>
//       )}
//       {isTestStarted &&
//         (timer > 0 ? (
//           <div className="w-[80%] p-4 bg-blue-200 bg-opacity-20 rounded-lg">
//             {questions.map((question) => (
//               <div key={question.id}>
//                 <h2 className="text-2xl my-4 p-2 rounded-lg bg-blue-300">
//                   {countTest++} {question.text}
//                 </h2>
//                 <ul className="flex flex-col gap-2">
//                   {question.options.map((option) => (
//                     <li
//                       className="px-2 py-1 border-black rounded-lg hover:bg-emerald-400"
//                       key={option.id}
//                       onClick={() => handleAnswerSelection(question.id, option)}
//                       style={{
//                         cursor: "pointer",
//                         backgroundColor:
//                           selectedAnswers[question.id] === option.id
//                             ? option.isCorrect
//                               ? "#69c463"
//                               : "rgba(255, 0, 0, 0.144)"
//                             : "transparent",
//                         border:
//                           selectedAnswers[question.id] === option.id
//                             ? option.isCorrect
//                               ? "2px solid green"
//                               : "2px solid red"
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
//                 <hr />
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="w-[100vw] h-[100vh] flex justify-center items-center text-4xl flex-col">
//             To'g'ri javoblar : {correctAnswersCount}
//             <button
//               onClick={startTest}
//               className="bg-blue-500 rounded-lg mt-4 p-2"
//             >
//               Testni qaytadan boshlash
//             </button>
//           </div>
//         ))}
//       {isTestStarted &&
//         (timer > 0 ? (
//           <div className="p-4 bg-blue-500 h-60 w-[18%] rounded-lg mt-4 ml-4 sticky top-6 right-6 text-white flex flex-col items-center">
//             <div>
//               Qolgan vaqtingiz:
//               <div className="text-red-600 font-bold text-xl text-center">
//                 {Math.floor(timer / 60)}:
//                 {timer % 60 < 10 ? `0${timer % 60}` : timer % 60}
//               </div>
//             </div>
//             <div>To'g'ri javoblar: {correctAnswersCount}</div>

//             <button
//               onClick={startTest}
//               className="bg-red-500 rounded-lg mt-4 p-2"
//             >
//               Testni qaytadan boshlash
//             </button>
//           </div>
//         ) : (
//           ""
//         ))}
//     </div>
//   );
// }

// export default Test;

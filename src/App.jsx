import React, { useEffect, useState } from "react";
import Test from "./Test";
// import test from "./test.txt";
function App() {
  // const [fileContent, setFileContent] = useState("");

  // useEffect(() => {
  //   const fetchFileContent = async () => {
  //     try {
  //       const response = await fetch(test);
  //       const content = await response.text();
  //       setFileContent(content);
  //     } catch (error) {
  //       console.error("Error fetching file:", error);
  //     }
  //   };

  //   fetchFileContent();
  // }, []);
  return (
    <div>
      {/* <pre>{fileContent}</pre> */}
      <Test />
    </div>
  );
}

export default App;

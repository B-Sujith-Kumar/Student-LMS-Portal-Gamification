import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import Navbar from "../../Components/Sidebar/Navbar";

const Page = () => {
  const [prompttext2, setPromptText2] = useState("");
  const [response, setResponse] = useState("");
  const [response2, setResponse2] = useState("");
  const [matchingCourseNames, setMatchingCourseNames] = useState([]);

  useEffect(() => {
    const matchingNames = [];

    async function fetchData() {
      try {
        const user = localStorage.getItem("user");
        const userCoursesResponse = await axios.get(`http://localhost:4500/student/${user}`);
        const userCourses = userCoursesResponse.data.courses;

        const allCoursesResponse = await axios.get("http://localhost:4500/courses");
        const allCourses = allCoursesResponse.data;

        for (const userCourse of userCourses) {
          const matchingCourse = allCourses.find((course) => course._id === userCourse.courseId);
          if (matchingCourse) {
            matchingNames.push(matchingCourse.courseName);
          }
        }

        setMatchingCourseNames(matchingNames);
      } catch (err) {
        console.log(err);
      }
    }

    fetchData();

    async function fetchdata2() {
      const apiUrl =
        "https://generativelanguage.googleapis.com/v1beta2/models/text-bison-001:generateText?key=AIzaSyBO0yZ1BNCPkm_Jh0vMQ6s3UItCNkEMjZU";
      var joinedNames = "";
      for (var i = 0; i < matchingCourseNames.length; i++) {
        joinedNames += matchingCourseNames[i];
        if (i < matchingCourseNames.length - 1) {
          joinedNames += ", ";
        }
      }

      const requestData = {
        prompt: {
          text: `"Analyze and evaluate a student across their enrolled courses ${joinedNames}. Provide insights into their strengths, areas of improvement, and overall comprehension. Consider the student's performance metrics, engagement. Suggest personalized recommendations for optimizing learning strategies, addressing challenges, and enhancing future academic success. Additionally, explore potential correlations between course performance and the student's long-term academic and career goals."`,
        },
      };

      try {
        const response = await axios.post(apiUrl, requestData);
        setResponse2(response.data.candidates[0].output);
      } catch (error) {
        console.error(error);
      }
    }

    fetchdata2();
  }, []);

  const callApi = async (e) => {
    e.preventDefault();

    const apiUrl =
      "https://generativelanguage.googleapis.com/v1beta2/models/text-bison-001:generateText?key=AIzaSyBO0yZ1BNCPkm_Jh0vMQ6s3UItCNkEMjZU";

    const requestData = {
      prompt: {
        text: `${prompttext2} `,
      },
    };

    try {
      const response = await axios.post(apiUrl, requestData);
      setResponse(response.data.candidates[0].output);
    } catch (error) {
      console.error(error);
    }
  };

  const containerStyle = {
    maxWidth: "800px",
    margin: "auto",
    marginTop: "20px",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
  };

  const inputBoxStyle = {
    marginBottom: "20px",
  };

  const inputStyle = {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    fontSize: "16px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    boxSizing: "border-box",
  };

  const buttonStyle = {
    display: "block",
    width: "100%",
    padding: "12px",
    backgroundColor: "#1890ff",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
  };

  const responseBoxStyle = {
    marginTop: "20px",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    backgroundColor: "#f5f5f5",
  };

  const responseHeaderStyle = {
    fontSize: "18px",
    marginBottom: "10px",
  };

  const responseContentStyle = {
    fontSize: "16px",
    whiteSpace: "pre-wrap",
  };

  const matchingCoursesStyle = {
    marginTop: "20px",
    fontSize: "16px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    padding: "20px",
    backgroundColor: "#fff",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  };

  const courseListStyle = {
    listStyleType: "none",
    padding: 0,
  };

  const courseItemStyle = {
    marginBottom: "10px",
    fontSize: "14px",
    color: "#333",
  };

  const response2Style = {
    marginTop: "20px",
    fontSize: "16px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    padding: "20px",
    backgroundColor: "#f5f5f5",
    whiteSpace: "pre-wrap",
  };

  return (
    <Navbar>
      <div style={containerStyle}>
        <div style={inputBoxStyle}>
          <form onSubmit={callApi}>
            <label htmlFor="prompttext2">Prompt Text 2</label>
            <input
              type="text"
              id="prompttext2"
              value={prompttext2}
              onChange={(e) => setPromptText2(e.target.value)}
              style={inputStyle}
            />

            <button type="submit" style={buttonStyle}>
              Submit
            </button>
          </form>
        </div>
      </div>
      <div style={{ padding: "40px" }}>
        {response && (
          <div style={responseBoxStyle}>
            <h5 style={responseHeaderStyle}>API Response:</h5>
            <p style={responseContentStyle}>{response}</p>
          </div>
        )}
      </div>
      <div style={matchingCoursesStyle}>
        <h5 className="" style={{marginBottom:"20px"}}>Recently Accessed Courses:</h5>
        <ul style={courseListStyle}>
          {matchingCourseNames.map((courseName, index) => (
            <li key={index} style={courseItemStyle}>{courseName}</li>
          ))}
        </ul>
        <div style={response2Style}>
          <h5>Student Performance Analysis:</h5>
          <p style={responseContentStyle}>{response2}</p>
        </div>
      </div>
    </Navbar>
  );
};

export default Page;

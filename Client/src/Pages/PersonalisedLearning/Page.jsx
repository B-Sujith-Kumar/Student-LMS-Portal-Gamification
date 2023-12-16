import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createContent, getContentData } from "../../Redux/content/action";
import axios from "axios";
// components
import Navbar from "../../Components/Sidebar/Navbar";
import Header from "../../Components/Header/Header";
import ContentBox from "../../Components/Content/ContentBox";
import AddIcon from "../../Components/AddIcon/AddIcon";

// css imports
import { Button, Drawer, Space, Spin, message } from "antd";

const Page = () => {
  const [prompttext2, setPromptText2] = useState("");
  const [response, setResponse] = useState("");

  const callApi = async (e) => {
    e.preventDefault();

    const apiUrl =
      "https://generativelanguage.googleapis.com/v1beta2/models/text-bison-001:generateText?key=AIzaSyBO0yZ1BNCPkm_Jh0vMQ6s3UItCNkEMjZU";

    const requestData = {
      prompt: {
        text: `${prompttext2} for  in an interactive and exciting way which captures attention of the students. Give the content in paragraphs`,
      },
    };

    try {
      const response = await axios.post(apiUrl, requestData);
      console.log(response.data);
      setResponse(response.data.candidates[0].output);
    } catch (error) {
      console.error(error);
    }
  };

  const containerStyle = {
    maxWidth: "800px",
    margin: "auto",
    marginTop:"20px",
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
      <div style={{padding:"40px"}}>
          {response && (
            <div style={responseBoxStyle}>
              <h5 style={responseHeaderStyle}>API Response:</h5>
              <p style={responseContentStyle}>{response}</p>
            </div>
          )}
        </div>
    </Navbar>
  );
};

export default Page;

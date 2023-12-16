import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createContent, getContentData } from "../../Redux/content/action";
import img from "../Contents/gff.jpg";

//components
import Navbar from "../../Components/Sidebar/Navbar";
import Header from "../../Components/Header/Header";
import ContentBox from "../../Components/Content/ContentBox";
import AddIcon from "../../Components/AddIcon/AddIcon";

//css imports
import { Button, Drawer, Space, Spin, message } from "antd";
import "./Content.css";

const courses = [
  {
    courseName: "Introduction to Computer Science",
    courseCode: "CS101",
    instructor: "Sujith Kumar B",
    progress: 65,
  },
  {
    courseName: "Database Management Systems",
    courseCode: "CS201",
    instructor: "Raviteja S",
    progress: 50,
  },
  {
    courseName: "Operating Systems",
    courseCode: "CS301",
    instructor: "G Sugam",
    progress: 80,
  },
  {
    courseName: "Computer Networks",
    courseCode: "CS401",
    instructor: "Ch Teja",
    progress: 25,
  },
  {
    courseName: "Software Engineering",
    courseCode: "CS501",
    instructor: "Pavan Kumar",
    progress: 90,
  }, 
  {
    courseName: "Automata Theory and Compiler Design",
    courseCode: "CS696",
    instructor: "Krishna Sureddi",
    progress: 65,
  }
];

const Content = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //redux states
  const {
    data: { isAuthenticated },
  } = useSelector((store) => store.auth);
  const { user } = useSelector((store) => store.auth.data);
  const { content, load } = useSelector((store) => store.content);

  //loading state
  const [loading, setLoading] = useState(false);

  //alert api
  const [messageApi, contextHolder] = message.useMessage();

  //drawer states and functions
  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  //form states and functions
  const initialFormData = {
    title: "",
    class: "",
    subject: "",
    type: "",
    creator: user?.name,
  };
  const [formData, setFormData] = useState(initialFormData);
  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  //upload file states
  const [size, setSize] = useState("");
  const [fileType, setFileType] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");

  //upload refs
  const UploadRef = useRef();
  const WidgetRef = useRef();

  //upload and add content function
  const handleSubmit = () => {
    for (let keys in formData) {
      if (formData[keys] == "") {
        return alert("please fill all the details");
      }
    }
    if (size == "" || fileType == "" || fileUrl == "" || thumbnailUrl == "") {
      return alert("Please choose a correct file type");
    }
    let obj = { ...formData, size, fileType, thumbnailUrl, fileUrl };
    setLoading(true);
    dispatch(createContent(obj)).then((res) => {
      if (res.msg == "Error") {
        setLoading(false);
        messageApi.open({
          type: "info",
          content: "Error",
          duration: 3,
        });
      } else {
        setLoading(false);
        onClose();
        return messageApi.open({
          type: "info",
          content: "Quiz Created",
          duration: 3,
        });
      }
    });
  };

  // cloudinary upload settings
  useEffect(() => {
    UploadRef.current = window.cloudinary;
    WidgetRef.current = UploadRef.current.createUploadWidget(
      {
        cloudName: "diverse",
        uploadPreset: "diverse",
        maxFiles: 1,
        clientAllowedFormats: ["jpg", "jpeg", "mp4"],
        maxFileSize: 52445000,
        thumbnailTransformation: [{ width: 240, height: 135, crop: "fill" }],
      },
      function (err, result) {
        if (result.info.secure_url) {
          setFileUrl(result.info.secure_url);
        }
        if (result.info.bytes) {
          setSize((result.info.bytes / 1000000).toFixed(3));
        }
        if (result.info.thumbnail_url) {
          setThumbnailUrl(result.info.thumbnail_url);
        }
        if (result.info.format) {
          setFileType(result.info.format);
        }
      }
    );
  }, []);

  useEffect(() => {
    dispatch(getContentData());
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      return navigate("/");
    }
  }, []);

  return (
    <>
      <Navbar>
        <div className="content">
          {/* header component */}
          <Header Title={"Contents"} Address={"Contents"} />

          {/* content component */}
          <div className="contentData">
            {courses.map((data, i) => {
              return (
                <div className="course-card" key={i} style={{cursor: "pointer"}}>
                  <img
                    className="course-image"
                    src={img}
                    alt="Course Image"
                  />

                  <div className="course-details">
                    <div className="course-title">{data.courseName}</div>

                    <div className="creator-name">
                      Instructor: {data.instructor}
                    </div>

                    <div className="progress-bar">
                      <div
                        className="progress-bar-inner"
                        style={{ width: `${data.progress}%` }}
                      ></div>
                    </div>

                    <div className="progress-label">
                      Progress: {data.progress}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {user?.userType !== "Student" ? (
            <div onClick={showDrawer}>
              <AddIcon />
            </div>
          ) : (
            ""
          )}

          {/* create content drawer */}
          <Drawer>
            {loading ? (
              <Space
                style={{
                  width: "100vw",
                  height: "100vh",
                  position: "absolute",
                  backgroundColor: "rgba(0,0,0,0.2)",
                  top: "0",
                  left: "0",
                  display: "flex",
                  justifyContent: "center",
                  alignItem: "center",
                }}
              >
                <Spin size="large"></Spin>
              </Space>
            ) : null}
          </Drawer>

          {/* main loading indicator  */}
          {contextHolder}
          {load ? (
            <Space
              style={{
                width: "100vw",
                height: "100vh",
                position: "absolute",
                backgroundColor: "rgba(0,0,0,0.2)",
                top: "0",
                left: "0",
                display: "flex",
                justifyContent: "center",
                alignItem: "center",
              }}
            >
              <Spin size="large"></Spin>
            </Space>
          ) : null}
        </div>
      </Navbar>
    </>
  );
};

export default Content;

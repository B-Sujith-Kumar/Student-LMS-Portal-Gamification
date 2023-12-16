import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getStudentData } from "../../Redux/student/action";
import axios from "axios";
import badge1 from "./badge.png";
import badge2 from "./silver-medal.png";
import badge3 from "./medal.png";

//component imports
import Navbar from "../../Components/Sidebar/Navbar";
import Header from "../../Components/Header/Header";
import LeaderboardRow from "../../Components/Table/LeaderboardRow";

//css imports
import "./LeaderBoard.css";

const LeaderBoard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [userDet, setUserDet] = useState(null);
  const [count, setCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [img, setImg] = useState(null);

  //redux states
  const {
    data: { isAuthenticated },
  } = useSelector((store) => store.auth);
  const { students } = useSelector((store) => store.student);

  useEffect(() => {
    async function fetchData() {
      try {
        const user = localStorage.getItem("user");
        const res = await axios.get(`http://localhost:4500/student/${user}`);
        console.log(res.data.courses);
        setUserDet(res);
      } catch (err) {
        console.log(err);
      }
    }
    fetchData();
    dispatch(getStudentData());
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      return navigate("/");
    }
  }, []);

  var count2;
  function getBadges() {
    console.log(userDet.data.courses);
    count2 = 0;
    userDet.data.courses.map((course) => {
      if (course.completed === "true") {
        count2++;
      }
    });
    console.log(count2);
    setCount(count2);
    console.log(count);
  }

  function handleClick() {
    setOpen(!open);
    if (count <= 2) {
      setImg(badge1);
    } else if (count <= 4) {
      setImg(badge2);
    } else {
      setImg(badge3);
    }
  }

  return (
    <Navbar>
      {/* header  */}
      <div className="leaderboard">
        <Header Title={"Ranking"} Address={"Leaderboard"} />
      </div>

      <div className="leaderboardData">
        {/* table */}
        <section className="tableAndBadgeContainer" style={{display: "flex", flexWrap: "wrap"}}>
          <div className="tableContainer" style={{ width: "50%" }}>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Class</th>
                  <th>Quiz attended</th>
                  <th>Points</th>
                </tr>
              </thead>
              <tbody>
                {students
                  .sort((a, b) => (a.totalPoints > b.totalPoints ? -1 : 1))
                  .map((data, i) => (
                    <LeaderboardRow key={i} data={data} />
                  ))}
              </tbody>
            </table>
          </div>
          <div style={{ width: "50%" }}>
            <center style={{ marginTop: "3%" }}>
              <button onClick={handleClick} className="viewBadgesButton">
                {open ? "Close" : "View Badges"}
              </button>
            </center>
            {/* <center> */}
              {open && <img src={img} alt="Badge" style={{height: "100px", marginTop: "2%", marginLeft: "10px"}}/>}
              {open && img === badge1 ? "Bronze medal": ""}
            {/* </center> */}
          </div>
        </section>
      </div>
    </Navbar>
  );
};

export default LeaderBoard;

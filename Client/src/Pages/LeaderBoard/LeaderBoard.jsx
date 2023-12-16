import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getStudentData } from "../../Redux/student/action";
import axios from "axios";

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
        console.log(res);
        setUserDet(res);
        console.log(count);
      } catch (err) {
        console.log(err);
      }
    }
    dispatch(getStudentData());
    fetchData();
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      return navigate("/");
    }
  }, []);

  return (
    <Navbar>
      {/* header  */}
      <div className="leaderboard">
        <Header Title={"Ranking"} Address={"Leaderboard"} />
      </div>

      <div className="leaderboardData">
        {/* table */}
        <section className="tableBody">
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
        </section>
      </div>
    </Navbar>
  );
};

export default LeaderBoard;

import React, {useEffect, useState} from "react";
import './App.css';

const BASE_URL = "https://mc-dev-5.herokuapp.com/";
const ADD_TO_FAVORITES = `${BASE_URL}jsonapi/v1/favorite?email=etorres5702@gmail.com`
const REMOVE_FROM_FAVORITES = `${BASE_URL}jsonapi/v1/favorite?email=etorres5702@gmail.com`

const Course = ({ courseInfo, setFavorite }) => {
  return (
    <div className="courseContainer">
      <div className={courseInfo.favorite ? "favorite" : "notFavorite"} onClick={() => setFavorite(courseInfo)}>{
        courseInfo.favorite
         ? "YOU LOVE THIS" 
         : "ADD TO FAVORITES"
      }</div>
      <img className="instructorImage" src={courseInfo.instructor_image_url} alt="img"/>
      <div className="courseDetails">
        <div>{courseInfo.instructor_name}</div>
        <div>{courseInfo.title}</div>
      </div>
    </div>
  )
}


function App() {
  const COURSES_ENDPOINT =`${BASE_URL}/jsonapi/v1/courses?email=etorres5702@gmail.com`;
  const [courses, setCourses] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);

  const fetchCourses = () => {
    fetch(COURSES_ENDPOINT).then((res) => res.json()).then(data => setCourses(data));
  }

  useEffect(() => {
    fetchCourses();
  }, []);

  const setFavorite = (courseInfo) => {
    const { favorite } = courseInfo;
    const ENDPOINT = favorite ? REMOVE_FROM_FAVORITES : ADD_TO_FAVORITES;
    const METHOD = favorite ? "DELETE" : "POST";
 
    fetch(ENDPOINT, {
      method: METHOD,
      headers: {'Content-Type': 'application/json'}, 
      body: JSON.stringify({
        email: "etorres5702@gmail.com",
        course_id: courseInfo.id,
      })
    }).then(res => {
      const { status } = res;
      if ([200, 204].includes(status)) {
        console.log("200 status")
        fetchCourses();
      }
    });
  }

  return (
    <div className="App">
      <div>COURSES</div>
      <div className="filterButton" onClick={() => setShowFavorites(!showFavorites)}>{ showFavorites ? "SHOW ALL": "SHOW FAVORITES"}</div>
      {courses
        .filter((courseInfo) => showFavorites ? courseInfo.favorite: true)
        .map((courseInfo) => <Course key={courseInfo.id} setFavorite={setFavorite} courseInfo={courseInfo}/>)}
    </div>
  );
}

export default App;

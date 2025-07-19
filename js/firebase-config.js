import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

const firebaseConfig = {
  apiKey: "AIzaSyBA2d63razNQLMHaMuDxsY65QTvejc0QhI",
  authDomain: "notesapp-65203.firebaseapp.com",
  databaseURL:
    "https://notesapp-65203-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "notesapp-65203",
  storageBucket: "notesapp-65203.firebasestorage.app",
  messagingSenderId: "950063433448",
  appId: "1:950063433448:web:961be74e38afbebd3deb5d",
  measurementId: "G-B8BS905KWB",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

import {
  getDatabase,
  ref,
  child,
  get,
  set,
  update,
  remove,
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";

const db = getDatabase();

class HandleFirebase {
  AddTopic() {
    let topicID = "topic" + Date.now();
    const now = new Date();
    const day = now.getDate();
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const month = monthNames[now.getMonth()];
    const year = now.getFullYear();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes;
    const formattedTime = `${hours}:${minutes} ${ampm}`;
    const formattedDate = `${day}/${month}/${year} ${formattedTime}`;
    set(ref(db, "topics/" + topicID), {
      id: topicID,
      topicTitle: window.newTopicData.topicTitle,
      topicTechStack: window.newTopicData.topicTechStack,
      topicDefinition: window.newTopicData.topicDefinition,
      topicUnderstanding: window.newTopicData.topicUnderstanding,
      topicSource: window.newTopicData.topicSource,
      topicYouTubeID: window.newTopicData.topicYouTubeID,
      topicCompleted: false,
      topicParked: false,
      topicNeedClarification: false,
      topicHandsOnNeeded: false,
      topicReadyForInterview: false,
      userId: "udhayakumarp",
      createdOn: formattedDate,
      updatedOn: formattedDate,
    })
      .then(() => {
        document.getElementById("topicAddedModal").style.display = "flex";
      })
      .catch((err) => {
        alert("Data Not Inserted");
        console.log();
      });
  }

  GetData() {
    const dbRef = ref(db);
    get(child(dbRef, "topics"))
      .then((snapshot) => {
        if (snapshot.exists()) {
          window.TopicData = snapshot.val();
          HandlePaintData.PaintUserTopic();
          if (localStorage.getItem("SelectedTopic")) {
            HandlePaintData.paintViewTopic();
          }
          HandlePaintData.PaintTechStackCategoryDropdown();
          console.log("User data:", snapshot.val());
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error("Error getting data:", error);
      });
  }

  UpdateTopic() {
    let topicID = localStorage.getItem("SelectedTopic");
    const now = new Date();
    const day = now.getDate();
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const month = monthNames[now.getMonth()];
    const year = now.getFullYear();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes;
    const formattedTime = `${hours}:${minutes} ${ampm}`;
    const formattedDate = `${day}/${month}/${year} ${formattedTime}`;
    update(ref(db, "topics/" + topicID), {
      topicTitle: window.EditTopicData.topicTitle,
      topicTechStack: window.EditTopicData.topicTechStack,
      topicDefinition: window.EditTopicData.topicDefinition,
      topicUnderstanding: window.EditTopicData.topicUnderstanding,
      topicSource: window.EditTopicData.topicSource,
      topicYouTubeID: window.EditTopicData.topicYouTubeID,
      updatedOn: formattedDate,
    })
      .then(() => {
        document.getElementById("topicEditedModal").style.display = "flex";
      })
      .catch((err) => {
        alert("Data Not Inserted");
        console.log();
      });
  }

  UpdateYourViewOnTopic() {
    let topicID = localStorage.getItem("SelectedTopic");
    const now = new Date();
    const day = now.getDate();
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const month = monthNames[now.getMonth()];
    const year = now.getFullYear();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes;
    const formattedTime = `${hours}:${minutes} ${ampm}`;
    const formattedDate = `${day}/${month}/${year} ${formattedTime}`;
    update(ref(db, "topics/" + topicID), {
      topicCompleted: window.YourViewOnTopicData.topicCompleted,
      topicParked: window.YourViewOnTopicData.topicParked,
      topicNeedClarification: window.YourViewOnTopicData.topicNeedClarification,
      topicHandsOnNeeded: window.YourViewOnTopicData.topicHandsOnNeeded,
      topicReadyForInterview: window.YourViewOnTopicData.topicReadyForInterview,
      updatedOn: formattedDate,
    })
      .then(() => {
        document.getElementById("topicEditedModal").style.display = "flex";
      })
      .catch((err) => {
        alert("Data Not Inserted");
        console.log();
      });
  }
}

window.HandleFirebaseDB = new HandleFirebase();
HandleFirebaseDB.GetData();

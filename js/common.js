class ValidFormFields {
  NullCheck(fieldVal) {
    return fieldVal.length === 0 ? false : true;
  }
  onFormSubmit(formID) {
    let reqFieldCount = $("#" + formID + " .req-field").length;
    $("#" + formID + " .req-field").each(function () {
      if (!HandleFormFields.NullCheck($(this).val())) {
        $(this).addClass("border-red-500");
      } else {
        $(this).removeClass("border-red-500");
        --reqFieldCount;
      }
    });
    if (reqFieldCount === 0) {
      let callFormSubmission = $("#" + formID).attr("action");
      window[callFormSubmission]();
    }
  }
}

class PaintTopicData {
  PaintCoveredTechStack() {
    if (window.TopicData.length) {
      $("#techstack-covered-list").empty();
      $.each(window.TopicData, function (i, item) {
        let category = item.topicTechStack;
        window.TechStackCovered[category] =
          (window.TechStackCovered[category] || 0) + 1;
      });

      $.map(window.TechStackCovered, function (count, category) {
        let techImgName = window.AvailableTechStackBgImg.indexOf(category.toLowerCase()) > -1 ? category.toLowerCase() : 'addtechstackbg';
        let showTechStackName = (techImgName === 'addtechstackbg') ? false : true;
        $("#techstack-covered-list").append(`<li>
            <div class="shadow-lg cursor-pointer relative" onclick="HandlePaintData.PaintSelectedTechStack('${category}');">
              <img src="./images/techstack/${techImgName}.jpg" alt="" />
              <h2 class="absolute bottom-2 left-2 font-bold text-xl ${showTechStackName ? 'hidden' : ''}"><span class="block text-4xl">{}</span>${category}</h2>
              <div
                class="absolute bottom-2 right-0 pr-2 text-right block w-full"
              >
                <p class="font-bold text-2xl">${count
                  .toString()
                  .padStart(2, "0")}</p>
              </div>
            </div>
          </li>`);
      });

      window.TechStackCovered = $.map(
        window.TechStackCovered,
        function (count, category) {
          return { category: category, count: count };
        }
      );

      if (window.TechStackCovered.length < 5) {
        $("#techstack-covered-list").append(`<li>
            <div class="shadow-lg cursor-pointer relative" onclick="window.location.href='./addnotes.html'">
              <img src="./images/techstack/addtechstackbg.jpg" alt="" />
              <div
                class="absolute flex flex-col top-0 left-0 text-center align-center w-full"
              >
                <i class="fa-solid fa-circle-plus text-xl mt-6"></i>
                <p class="font-bold text-xl mt-1 min-h-full">Add Topic</p>
              </div>
            </div>
          </li>`);
      }
    }
  }
  

  PaintSelectedTechStack(selectedTechStack) {
    $("#ViewUserTopicRow, #backToCoveredTop").removeClass("hidden");
    $("#ViewTechStackCoveredRow, #NoOfTopicHead, #DashboardWidgets").addClass(
      "hidden"
    );
    HandlePaintData.PaintUserTopic(selectedTechStack);
    $("#techstackTopicsHead").text(selectedTechStack);
  }

  PaintUserTopic(selectedTechStack) {
    let YourReviewcounters = {
      topicCompleted: 0,
      topicHandsOnNeeded: 0,
      topicNeedClarification: 0,
      topicParked: 0,
      topicReadyForInterview: 0,
    };
    $("#notes-data-list").empty();
    const notesData = window.TopicData;
    let NumberOfTopics = 0;
    $.each(notesData, function (index, topic) {
      if (selectedTechStack === topic.topicTechStack) {
        $("#notes-data-list").append(`<div
                class="topic-container box-border border-1 rounded-md p-2 cursor-pointer hover:opacity-80"
                onclick="HandlePaintData.NavigateViewTopic('${topic.id}')"
              >
                <h5 class="text-md font-bold">${topic.topicTitle}</h5>
                <p class="text-sm line-clamp-2">${topic.topicDefinition}</p>
              </div>`);
        Object.keys(YourReviewcounters).forEach((key) => {
          if (topic[key] === true) {
            YourReviewcounters[key]++;
          }
        });
        NumberOfTopics++;
      }
    });
    window.yourTechStackReviewChartData = YourReviewcounters;
    HandleChartLaunch(selectedTechStack, NumberOfTopics);
  }

  PaintSearchFilter() {
    const notesData = window.TopicData;
    $("#searchResultList").empty();
    let searchVal = $("#searchfield").val();
    if (searchVal.length > 3) {
      $.each(notesData, function (index, topic) {
        if (
          topic.topicTitle.indexOf(searchVal) > -1 ||
          topic.topicTitle.toLowerCase().indexOf(searchVal) > -1
        ) {
          $("#searchResultList").append(`<li
              class="odd:bg-gray-100 p-2 hover:bg-gray-200 cursor-pointer hover:font-medium"
              onclick="HandlePaintData.NavigateViewTopic('${topic.id}')"
            >
              <p>${topic.topicTitle}</p>
            </li>`);
          $("#searchResultRow").removeClass("hidden");
        }
      });
    } else {
      $("#searchResultRow").addClass("hidden");
    }
  }

  PaintRecentlyAddedTopics() {
    $("#RecentlyAddedTopicsList").empty();
    const notesData = window.TopicData;
    let topicStatuscolor;
    $.each(notesData, function (index, topic) {
      topicStatuscolor = 'orange';
      if (
        topic.topicParked ||
        topic.topicNeedClarification ||
        topic.topicHandsOnNeeded
      ) {
       topicStatuscolor = 'red'; 
      } else if(
        topic.topicReadyForInterview ||
        topic.topicCompleted
      ) {
        topicStatuscolor = 'green';
      }
      if (index < 5) {
        $("#RecentlyAddedTopicsList").append(`<div class="grid grid-cols-1 mt-0 sm:grid-cols-12 rounded-md gap-2 p-2 odd:bg-gray-100 cursor-pointer hover:opacity-80" onclick="HandlePaintData.NavigateViewTopic('${topic.id}')">
          <div class="col-span-11">
            <h5 class="text-md font-bold">${topic.topicTitle}</h5>
            <p class="text-sm line-clamp-2">${topic.topicTechStack}</p>
          </div>
          <div class="col-span-1 text-center">
            <span class="relative flex size-4 left-1 top-[30%]">
                <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-${topicStatuscolor}-400 opacity-75"></span>
                <span class="relative inline-flex size-4 rounded-full bg-${topicStatuscolor}-500"></span>
              </span>
          </div>
        </div>`);
      }
    });
  }

  PaintReadyForInterviewTopics() {
    $("#ReadyForInterviewTopicsList").empty();
    const notesData = window.TopicData;
    $.each(notesData, function (index, topic) {
      if (topic.topicReadyForInterview) {
        $("#ReadyForInterviewTopicsList").append(`<div class="grid grid-cols-1 mt-0 sm:grid-cols-12 rounded-md gap-2 p-2 odd:bg-gray-100 cursor-pointer hover:opacity-80" onclick="HandlePaintData.NavigateViewTopic('${topic.id}')">
          <div class="col-span-11">
            <h5 class="text-md font-bold">${topic.topicTitle}</h5>
            <p class="text-sm line-clamp-2">${topic.topicTechStack}</p>
          </div>
          <div class="col-span-1 text-center">
            <span class="relative flex size-4 left-1 top-[30%]">
                <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                <span class="relative inline-flex size-4 rounded-full bg-green-500"></span>
              </span>
          </div>
        </div>`);
      }
    });
  }

  PaintActionableTopics() {
    $("#ActionableTopicsList").empty();
    const notesData = window.TopicData;
    $.each(notesData, function (index, topic) {
      if (
        topic.topicParked ||
        topic.topicNeedClarification ||
        topic.topicHandsOnNeeded
      ) {
        $("#ActionableTopicsList").append(`<div class="grid grid-cols-1 mt-0 sm:grid-cols-12 rounded-md gap-2 p-2 odd:bg-gray-100 cursor-pointer hover:opacity-80" onclick="HandlePaintData.NavigateViewTopic('${topic.id}')">
          <div class="col-span-11">
            <h5 class="text-md font-bold">${topic.topicTitle}</h5>
            <p class="text-sm line-clamp-2">${topic.topicTechStack}</p>
          </div>
          <div class="col-span-1 text-center">
            <span class="relative flex size-4 left-1 top-[30%]">
                <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                <span class="relative inline-flex size-4 rounded-full bg-red-500"></span>
              </span>
          </div>
        </div>`);
      }
    });
  }


  NavigateViewTopic(topicid) {
    localStorage.setItem("SelectedTopic", topicid);
    window.location.href = "./viewnotes.html";
  }

  paintViewTopic() {
    let selectedTopic = localStorage.getItem("SelectedTopic");
    let selectedTopicData = Object.values(window.TopicData).filter(
      (items) => items.id === selectedTopic
    );
    $("#topicTitleTxt").text(selectedTopicData[0].topicTitle);
    $("#topicTechStackTxt").text(selectedTopicData[0].topicTechStack);
    $("#topicDefinitionTxt").text(selectedTopicData[0].topicDefinition);
    $("#topicUserUnderstandingTxt").text(
      selectedTopicData[0].topicUnderstanding
    );
    $("#topicSourceTxt").text(selectedTopicData[0].topicSource);
    $("#topicYoutubeId").attr(
      "src",
      "https://www.youtube.com/embed/" + selectedTopicData[0].topicYouTubeID
    );
    HandlePaintData.PaintYourViewOnTopic();
  }

  PaintYourViewOnTopic() {
    let selectedTopic = localStorage.getItem("SelectedTopic");
    let selectedTopicData = Object.values(window.TopicData).filter(
      (items) => items.id === selectedTopic
    );

    if (selectedTopicData[0].topicCompleted) {
      $("#topicCompletedCB").prop("checked", true);
    }
    if (selectedTopicData[0].topicParked) {
      $("#topicParkedCB").prop("checked", true);
    }
    if (selectedTopicData[0].topicNeedClarification) {
      $("#topicNeedClarificationCB").prop("checked", true);
    }
    if (selectedTopicData[0].topicHandsOnNeeded) {
      $("#topicHandsOnNeededCB").prop("checked", true);
    }
    if (selectedTopicData[0].topicReadyForInterview) {
      $("#topicReadyFInterviewCB").prop("checked", true);
    }
    // HandleYourViewUpdates();
  }

  PaintTechStackCategoryDropdown() {
    let TechStackDropdownData = [];
    $("select#topicTechStack").empty();
    let selectedTopicData = [];
    if (localStorage.getItem("SelectedTopic")) {
      let selectedTopic = localStorage.getItem("SelectedTopic");
      selectedTopicData = Object.values(window.TopicData).filter(
        (items) => items.id === selectedTopic
      );
      $("#topicTitle").val(selectedTopicData[0].topicTitle);
      $("#topicDefinition").val(selectedTopicData[0].topicDefinition);
      $("#topicUnderstanding").val(selectedTopicData[0].topicUnderstanding);
      $("#topicSource").val(selectedTopicData[0].topicSource);
      $("#topicYouTubeID").val(selectedTopicData[0].topicYouTubeID);
    }
    if (window.TopicData.length > 0) {
      Object.values(window.TopicData).map((items) => {
        if (TechStackDropdownData.indexOf(items.topicTechStack) === -1) {
          TechStackDropdownData.push(items.topicTechStack);

          if (localStorage.getItem("SelectedTopic")) {
            if (selectedTopicData[0].topicTechStack === items.topicTechStack) {
              $("select#topicTechStack").append(
                `<option value="${items.topicTechStack}" selected>${items.topicTechStack}</option>`
              );
            } else {
              $("select#topicTechStack").append(
                `<option value="${items.topicTechStack}">${items.topicTechStack}</option>`
              );
            }
          } else {
            $("select#topicTechStack").append(
              `<option value="${items.topicTechStack}">${items.topicTechStack}</option>`
            );
          }
        }
      });
    } else {
      $("#AddNewTechStackRow").removeClass("hidden");
      $("#AddNewTechStack").addClass("req-field");
    }

    $("select#topicTechStack").append(`<option value="Other">Other</option>`);
  }
}

$(document).on("focus", ".req-field", function () {
  $(this).removeAttr("readonly");
});

class UserSession {
  // LoggedUser() {
  //   if (localStorage.getItem("username")) {
  //     window.location.href = "dashboard.html";
  //   } else {
  //     window.location.href = "index.html";
  //   }
  // }
  SessionLogout() {
    localStorage.setItem("username", "");
    window.location.href = "./index.html";
  }
}

class BackNavigation {
  BackToOverViewCharts() {
    $("#OverViewYourTopicRow").addClass("hidden");
    $("#chart").removeClass("hidden");
    $("#backToCoveredTop").attr("onclick", "HandleBackToTechStack();");
    $("#topicDetailsTab")
      .removeClass("opacity-30")
      .removeClass("pointer-events-none");
  }
}

window.newTopicData = [];
window.EditTopicData = [];
window.YourViewOnTopicData = [];
window.TopicData = [];
window.LoginformData = [];
window.TechStackCovered = {};
window.RegisterformData = [];
window.SessionUserData = [];
window.UserAvailCheck = false;
window.yourTechStackReviewChartData = {
  topicCompleted: 0,
  topicHandsOnNeeded: 0,
  topicNeedClarification: 0,
  topicParked: 0,
  topicReadyForInterview: 0,
};

var HandleFormFields = new ValidFormFields();
var HandlePaintData = new PaintTopicData();
var HandleUserSession = new UserSession();
var HandleBackNavigation = new BackNavigation();
window.AvailableTechStackBgImg = ['dart', 'react', 'javascript', 'flutter', 'typescript'];

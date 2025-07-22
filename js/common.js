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
        $("#techstack-covered-list").append(`<li>
            <div class="shadow-lg cursor-pointer relative" onclick="HandlePaintData.PaintSelectedTechStack('${category}');">
              <img src="./images/techstack/${category.toLowerCase()}.jpg" alt="" />
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
    $("#ViewTechStackCoveredRow, #NoOfTopicHead").addClass("hidden");
    HandlePaintData.PaintUserTopic(selectedTechStack);
    $("#techstackTopicsHead").text(selectedTechStack);
  }

  PaintUserTopic(selectedTechStack) {
    let YourReviewcounters = {
      topicCompleted: 0,
      topicHandsOnNeeded: 0,
      topicNeedClarification: 0,
      topicParked: 0,
      topicReadyForInterview: 0
    };
    $("#notes-data-list").empty();
    const notesData = window.TopicData;
    let NumberOfTopics = 0;
    $.each(notesData, function (index, topic) {
      if (selectedTechStack === topic.topicTechStack)
      {
        $("#notes-data-list").append(`<div
                class="topic-container box-border border-1 rounded-md p-2 cursor-pointer hover:opacity-80"
                onclick="HandlePaintData.NavigateViewTopic('${topic.id}')"
              >
                <h5 class="text-md font-bold">${topic.topicTitle}</h5>
                <p class="text-sm line-clamp-2">${topic.topicDefinition}</p>
              </div>`);
        Object.keys(YourReviewcounters).forEach(key => {
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
    HandleYourViewUpdates();
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
    BackToOverViewCharts(){
      $('#OverViewYourTopicRow').addClass('hidden');
      $('#chart').removeClass('hidden');
      $('#backToCoveredTop').attr('onclick', 'HandleBackToTechStack();');
      $('#topicDetailsTab').removeClass('opacity-30').removeClass('pointer-events-none');
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
    "topicCompleted": 0,
    "topicHandsOnNeeded": 0,
    "topicNeedClarification": 0,
    "topicParked": 0,
    "topicReadyForInterview": 0
};

var HandleFormFields = new ValidFormFields();
var HandlePaintData = new PaintTopicData();
var HandleUserSession = new UserSession();
var HandleBackNavigation = new BackNavigation();

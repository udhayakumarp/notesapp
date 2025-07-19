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
  PaintUserTopic() {
    $("#notes-data-list").empty();
    const notesDate = window.TopicData;
    $.each(notesDate, function (index, topic) {
      $("#notes-data-list").append(`<div
                class="topic-container box-border border-1 rounded-md p-2 cursor-pointer hover:opacity-80"
                onclick="HandlePaintData.NavigateViewTopic('${topic.id}')"
              >
                <h5 class="text-md font-bold">${topic.topicTitle}</h5>
                <p class="text-sm line-clamp-2">${topic.topicDefinition}</p>
              </div>`);
    });
  }

  NavigateViewTopic(topicid) {
    localStorage.setItem("SelectedTopic", topicid);
    window.location.href = "/viewnotes.html";
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
    $("select#topicTechStack").append(`<option value="Other">Other</option>`);
  }
}

window.newTopicData = [];
window.EditTopicData = [];
window.YourViewOnTopicData = [];
window.TopicData = [];

var HandleFormFields = new ValidFormFields();
var HandlePaintData = new PaintTopicData();

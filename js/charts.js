function HandleChartLaunch(selectedTechStack, NumberOfTopics) {
  const options = {
  title: {
    text: "Your TechStack Review",
    align: "center",
    style: {
      fontSize: "14px"
    }
  },
  chart: {
    type: 'donut',
    height: 400,
    events: {
      dataPointSelection: function(event, chartContext, config) {
        const label = config.w.config.labels[config.dataPointIndex];
        const value = config.w.config.series[config.dataPointIndex];
        let Chartlabels =['Parked for Later', 'Clarification Needed', 'HandsOn Needed', 'Completed', 'Ready For Interview'];
        let apiLabels = ['topicParked', 'topicNeedClarification', 'topicHandsOnNeeded', 'topicCompleted', 'topicReadyForInterview'];
        let findLabelIndex = Chartlabels.indexOf(label);
        PaintSelectedOverviewTopic(apiLabels[findLabelIndex], selectedTechStack, label);
      }
    }
  },
  dataLabels: {
    style: {
      fontSize: "10px"
    }
  },
  plotOptions: {
    pie: {
      customScale: 1,
      expandOnClick: false,
      dataLabels: {
        enabled: false
      },
      donut: {
        size: "75%",
        labels: {
          show: true,
          value: {
            formatter: function (value) {
              return value.toLocaleString();
            }
          },
          total: {
            show: true,
            formatter: function (value) {
              let total = NumberOfTopics;
              return total.toLocaleString();
            }
          }
        }
      }
    }
  },
  series: [
    window.yourTechStackReviewChartData.topicParked, 
    window.yourTechStackReviewChartData.topicNeedClarification, 
    window.yourTechStackReviewChartData.topicHandsOnNeeded, 
    window.yourTechStackReviewChartData.topicCompleted, 
    window.yourTechStackReviewChartData.topicReadyForInterview],
  labels: ['Parked for Later', 'Clarification Needed', 'HandsOn Needed', 'Completed', 'Ready For Interview'],
  legend: {
    position: 'bottom',
  },
  responsive: [{
    breakpoint: 480,
    options: {
      chart: {
        width: 300
      },
      legend: {
        position: 'bottom',
        floating: false,
        offsetY: 0
      }
    }
  }]
};
    var chart = new ApexCharts(document.querySelector("#chart"), options);
    chart.render();
}

function PaintSelectedOverviewTopic(selectedReviewType, selectedTechStack, topicHeading){
    const notesData = window.TopicData;
    $("#OverViewYourTopicList").empty();
    $('#OverViewYourTopicHeading > span').text(topicHeading);
    $.each(notesData, function (index, topic) {
      if (selectedTechStack === topic.topicTechStack && topic[selectedReviewType])
      {
        $("#OverViewYourTopicList").append(`<div
                class="topic-container box-border border-1 rounded-md p-2 cursor-pointer hover:opacity-80"
                onclick="HandlePaintData.NavigateViewTopic('${topic.id}')"
              >
                <h5 class="text-md font-bold">${topic.topicTitle}</h5>
                <p class="text-sm line-clamp-2">${topic.topicDefinition}</p>
              </div>`);
      }
    });
    $('#OverViewYourTopicRow').removeClass('hidden');
    $('#chart').addClass('hidden');
    $('#topicDetailsTab').addClass('opacity-30').addClass('pointer-events-none');
    $('#backToCoveredTop').attr('onclick', 'HandleBackNavigation.BackToOverViewCharts()');
  }
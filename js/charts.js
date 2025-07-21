var options = {
  series: [0, 1, 1, 0, 1],
  chart: {
    type: "donut"
  },
  title: {
    text: "Your TechStack Review",
    align: "center",
    style: {
      fontSize: "14px"
    }
  },
  labels: ["Completed", "Parked for Later", "Clarification Needed", "Ready for Interview", "HandsOn Needed"],
  dataLabels: {
    enabled: false
  },
  dataLabels: {
    enabled: false
  },
  plotOptions: {
    pie: {
      customScale: 1,
      expandOnClick: false,
      dataLabels: {
        enabled: false
      },
      donut: {
        size: "80%",
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
              let total = value.globals.seriesTotals.reduce((a, b) => a + b, 0);
              return total.toLocaleString();
            }
          }
        }
      }
    }
  },
  legend: {
    position: "bottom",
    offsetY: 0
  },
  tooltip: {
    enabled: false
  },

  states: {
    hover: {
      filter: {
        type: "none"
      }
    }
  }
};


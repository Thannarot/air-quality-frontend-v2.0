export function getDonutChartOptions(series, colors, lables, total_lable) {
    return {
      series: series,
      colors: colors,
      chart: {
        height: 320,
        width: "100%",
        type: "donut",
      },   
      stroke: {
        colors: ["transparent"],
        lineCap: "",
      },
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
              name: {
                show: true,
                fontFamily: "Inter, sans-serif",
                offsetY: 20,
              },
              total: {
                show: true,
                showAlways: true,
                label: 'Area ha.',
                fontSize: '14px',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 600,
                color: '#373d3f',
                formatter: function (w) {
                  const sum = w.globals.seriesTotals.reduce((a, b) => {
                    return a + b
                  }, 0)
           
                  return `${sum.toFixed(2)}`
                },
              },
              value: {
                show: true,
                fontFamily: "Inter, sans-serif",
                offsetY: -20,
                formatter: function (value) {
                  return value
                },
              },
            },
            size: "60%",
          },
        },
      },
      grid: {
        padding: {
          top: -2,
        },
      },
      labels: lables,
      dataLabels: {
        enabled: false,
      },
      legend: {
        position: "bottom",
        fontFamily: "Inter, sans-serif",
      },
      yaxis: {
        labels: {
          formatter: function (value) {
            return value + "ha."
          },
        },
      },
      xaxis: {
        labels: {
          formatter: function (value) {
            return value  + "ha."
          },
        },
        axisTicks: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
      },
    }
  }

  // Function to handle the checkbox change event
  export function handleCheckboxChange(event, chart) {
    const checkbox = event.target;
    if (checkbox.checked) {
        switch(checkbox.value) {
          case 'desktop':
            chart.updateSeries([15.1, 22.5, 4.4, 8.4]);
            break;
          case 'tablet':
            chart.updateSeries([25.1, 26.5, 1.4, 3.4]);
            break;
          case 'mobile':
            chart.updateSeries([45.1, 27.5, 8.4, 2.4]);
            break;
          default:
            chart.updateSeries([55.1, 28.5, 1.4, 5.4]);
        }

    } else {
        chart.updateSeries([35.1, 23.5, 2.4, 5.4]);
    }
}

export function getColumnChartOptions(series, colors) {
    return {
          // colors: colors,
          series: series,
          chart: {
            type: "bar",
            height: "280px",
            fontFamily: "Inter, sans-serif",
            toolbar: {
              show: false,
            },
          },
          plotOptions: {
            bar: {
              horizontal: false,
              columnWidth: "30%",
              borderRadiusApplication: "end",
              borderRadius: 0,
            },
          },
          tooltip: {
            shared: true,
            intersect: false,
            style: {
              fontFamily: "Inter, sans-serif",
            },
          },
          states: {
            hover: {
              filter: {
                type: "darken",
                value: 1,
              },
            },
          },
          stroke: {
            show: true,
            width: 0,
            colors: ["transparent"],
          },
          grid: {
            show: false,
            strokeDashArray: 4,
            padding: {
              left: 2,
              right: 2,
              top: -14
            },
          },
          dataLabels: {
            enabled: false,
          },
          legend: {
            show: false,
          },
          xaxis: {
            floating: false,
            labels: {
              show: true,
              style: {
                fontFamily: "Inter, sans-serif",
                cssClass: 'text-xs font-normal fill-gray-500 dark:fill-gray-400'
              }
            },
            axisBorder: {
              show: false,
            },
            axisTicks: {
              show: false,
            },
          },
          yaxis: {
            show: false,
          },
          fill: {
            opacity: 1,
          },
        }
      
    }

  export function addData(chart, label, newData, colors) {
      // chart.data.labels.push(label);
      chart.data.labels = label;
      chart.data.datasets[0].data = newData;
      // chart.data.datasets[0].backgroundColor = colors;
      // chart.data.datasets.forEach((dataset) => {
      //     dataset.data.push(newData);
      // });
      chart.update();
  }
  
  export function removeData(chart) {
      chart.data.labels = [];
      chart.data.datasets[0].data = [];
      chart.update();
  }
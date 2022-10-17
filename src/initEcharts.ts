import * as echarts from "echarts"

export const initEcharts = async (): Promise<echarts.ECharts> => {
  // initialize the echarts instance
  const myChart = echarts.init(document.getElementById("main")!, undefined, {
    renderer: "canvas",
  })

  // resize the chart on window size change
  window.onresize = () => {
    myChart.resize()
  }

  return myChart
}

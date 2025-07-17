import React, { useEffect } from 'react';

function CurveChart() {
  useEffect(() => {
    // Load the Google Charts script
    const script = document.createElement('script');
    script.src = "https://www.gstatic.com/charts/loader.js";
    script.onload = () => {
      window.google.charts.load('current', { packages: ['corechart'] });
      window.google.charts.setOnLoadCallback(drawChart);
    };
    document.body.appendChild(script);

    function drawChart() {
      const data = window.google.visualization.arrayToDataTable([
        ['Time', 'Active', 'Inactive'],
        ['08:00', 10, 20],
        ['11:00', 15, 15],
        ['14:00', 28, 2],
        ['17:00', 19, 11],
        ['20:00', 13, 17],
        ['23:00', 10, 20],
        ['02:00', 1, 29],
        ['05:00', 8, 22],
      ]);

      const options = {
        title: 'Driver Activity',
        curveType: 'function',
        legend: { position: 'bottom' }
      };

      const chart = new window.google.visualization.LineChart(document.getElementById('curve_chart'));
      chart.draw(data, options);
    }
  }, []);

  return <div id="curve_chart" style={{ width: '1100px', height: '600px' }}></div>;
}

export default CurveChart;
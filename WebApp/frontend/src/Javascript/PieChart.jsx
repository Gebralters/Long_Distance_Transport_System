import React, { useEffect } from 'react';

function PieChart() {
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
        ['Type', 'Overall Bookings'],
        ['Parcel Bookings', 29],
        ['Passenger Bookings', 71],
      ]);

      const options = {
        title: 'Number of Bookings (Parcel vs Passenger)',
      };

      const chart = new window.google.visualization.PieChart(document.getElementById('piechart'));
      chart.draw(data, options);
    }
  }, []);

  return <div id="piechart" style={{ width: '1000px', height: '700px' }}></div>;
}

export default PieChart;
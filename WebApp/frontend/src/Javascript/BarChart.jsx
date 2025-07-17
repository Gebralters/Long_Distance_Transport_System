import React, { useEffect } from 'react';

function BarChart() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://www.gstatic.com/charts/loader.js";
    script.onload = () => {
      window.google.charts.load('current', { 'packages': ['bar'] });
      window.google.charts.setOnLoadCallback(drawChart);
    };
    document.body.appendChild(script);

    function drawChart() {
      const data = window.google.visualization.arrayToDataTable([
        ['Year', 'Sales', 'Expenses', 'Profit'],
        ['2014', 1000, 400, 200],
        ['2015', 1170, 460, 250],
        ['2016', 660, 1120, 300],
        ['2017', 1030, 540, 350]
      ]);

      const options = {
        chart: {
          title: 'Company Performance',
          subtitle: 'Sales, Expenses, and Profit: 2014-2017',
        },
        bars: 'horizontal'
      };

      const chart = new window.google.charts.Bar(document.getElementById('barchart_material'));
      chart.draw(data, window.google.charts.Bar.convertOptions(options));
    }
  }, []);

  return <div id="barchart_material" style={{ width: '990px', height: '600px' }}></div>;
}

export default BarChart;
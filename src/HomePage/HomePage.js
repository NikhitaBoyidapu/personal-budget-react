import React, { useEffect,useState } from 'react';
import axios from "axios";
import Chart from 'chart.js/auto';
import * as d3 from 'd3'; 
function HomePage() {

  const [dataSource] = useState({
    datasets: [
      {
        data: [],
        backgroundColor: [
          '#ffcd56',
          '#ff6384',
          '#36a2eb',
          '#fd6b19',
          '#9BA960',
          '#964B00',
          '#581845'
        ],
      },
    ],
    labels: [],
  });

  const createChart = () => {
    const ctx = document.getElementById("myChart").getContext("2d");
    const myPieChart = new Chart(ctx, {
      type: 'pie',
      data: dataSource
    });
  }
  const newChart = () =>{
    const width = 400,
                height = 400,
                margin = 40;
            const radius = Math.min(width, height) / 2 - margin;
            const svg = d3.select("#newChart")
                .append("svg")
                .attr("width", width)
                .attr("height", height)
                .append("g")
                .attr("transform", `translate(${width / 2},${height / 2})`);

            const color = d3.scaleOrdinal()
                .domain(dataSource.labels) 
                .range(d3.schemeDark2);

            const pie = d3.pie()
                .sort(null) 
                .value(d => d.data);

            const data_ready = pie(dataSource.datasets[0].data.map((data, index) => ({
                data: data,
                label: dataSource.labels[index]
            })));

            const arc = d3.arc()
                .innerRadius(radius * 0.5) 
                .outerRadius(radius * 0.8);
            const outerArc = d3.arc()
                .innerRadius(radius * 0.9)
                .outerRadius(radius * 0.9);

            svg
                .selectAll('allSlices')
                .data(data_ready)
                .join('path')
                .attr('d', arc)
                .attr('fill', d => color(d.data.label)) 
                .attr("stroke", "white")
                .style("stroke-width", "2px")
                .style("opacity", 0.7);

            svg
                .selectAll('allPolylines')
                .data(data_ready)
                .join('polyline')
                .attr("stroke", "black")
                .style("fill", "none")
                .attr("stroke-width", 1)
                .attr('points', function (d) {
                    const posA = arc.centroid(d); 
                    const posB = outerArc.centroid(d); 
                    const posC = outerArc.centroid(d); 
                    const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2; 
                    posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1); 
                    return [posA, posB, posC];
                });

            svg
                .selectAll('allLabels')
                .data(data_ready)
                .join('text')
                .text(d => d.data.label) 
                .attr('transform', function (d) {
                    const pos = outerArc.centroid(d);
                    const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
                    pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
                    return `translate(${pos})`;
                })
                .style('text-anchor', function (d) {
                    const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
                    return (midangle < Math.PI ? 'start' : 'end');
                });
  }

  const getBudget = () => {
    axios.get('http://localhost:3000/budget')
      .then(function (res) {
       // console.log(res);
        for (var i = 0; i < res.data.myBudget.length; i++) {
          dataSource.datasets[0].data[i] = res.data.myBudget[i].budget;
          dataSource.labels[i] = res.data.myBudget[i].title;
      }
      createChart();
      newChart();
      })
      .catch(function (error) {
        console.error('Error fetching budget data:', error);
      });
  }

  useEffect(() => {
    getBudget();
  }, []);
  return (
    <main className="center" id="skiptomain">

        <div className="page-area">
            <article>
                <h1>Stay on track</h1>
                <p>
                    Do you know where you are spending your money? If you really stop to track it down,
                    you would get surprised! Proper budget management depends on real data... and this
                    app will help you with that!
                </p>
            </article>
    
            <article>
                <h1>Alerts</h1>
                <p>
                    What if your clothing budget ended? You will get an alert. The goal is to never go over the budget.
                </p>
            </article>
    
            <article>
                <h1>Results</h1>
                <p>
                    People who stick to a financial plan, budgeting every expense, get out of debt faster!
                    Also, they to live happier lives... since they expend without guilt or fear... 
                    because they know it is all good and accounted for.
                </p>
            </article>
    
            <article>
                <h1>Free</h1>
                <p>
                    This app is free!!! And you are the only one holding your data!
                </p>
            </article>
    
            <article>
                <h1>Stay on track</h1>
                <p>
                    Do you know where you are spending your money? If you really stop to track it down,
                    you would get surprised! Proper budget management depends on real data... and this
                    app will help you with that!
                </p>
            </article>
    
            <article>
                <h1>Alerts</h1>
                <p>
                    What if your clothing budget ended? You will get an alert. The goal is to never go over the budget.
                </p>
            </article>
    
            <article>
                <h1>D3JS Chart</h1>
                    <div id="newChart"></div>
            </article>
    
            <article>
                <h1>Chart</h1>
                <p>
                   <canvas id="myChart" width="400" height="400"> </canvas>
                </p>
            </article>

        </div>

    </main>
  );
}

export default HomePage;

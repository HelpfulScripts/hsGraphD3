// create data set:
const data = {
   colNames:['date', 'line', 'series'], 
   rows:[   [0,       0.2,     -0.2]], 
};
let index = 0;
while (index<11) { 
   val = Math.random();
   data.rows.push([index++, val, val-1]); 
}

// create the graph and define the series to plot:
const graph = new hsGraphD3.Graph(root);
graph.add('line', {x:'date', y:'line', y0:()=>0});
graph.add('timeseries', {x:'date', y:'series', y0:()=>-1});

//----- adjust some settings:
with (graph.defaults) {
   scales.dims.hor.aggregateOverTime = false; // forget the past
   series.series0.area.rendered = true;  
   series.series1.area.rendered = true;  
   axes.ver.tickLabel.rendered = false;  // hide vertical axis labels
}

// trigger the update loop to plot the data
graph.render(data).update(1000, cycle);

function cycle(data) { 
     // add a row of data
     val = Math.random();
     data.rows.push([index++, val, val-1]);

     // remove old row of data:
     if (data.rows.length > 10) { data.rows.shift(); }

     // continue update calls:
     return true; 
};

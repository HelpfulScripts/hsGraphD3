// create data set:
const data = {
   colNames:['date', 'time', 'volume', 'costs'], 
   rows:[   ['1/1/14', -1,     0.2,    0.3], 
            ['1/1/16',  0.2,   0.7,    0.2], 
            ['9/1/16',  0.4,   0.1,    0.3],
            ['5/1/17',  0.6,  -0.2,    0.1], 
            ['7/1/18',  0.8,   0.3,    0.5], 
            ['1/1/19',  1,     0.2,    0.4]]
};

// create the graph and define the series to plot:
const graph = new hsGraphD3.Graph(root);
graph.add('bubble', {x:'time', y:'volume', r:'costs'});

// adjust some settings:
graph.axes.defaults.color = '#88f';  // both axes appear blue
with (graph.scales.defaults.dims.size.range) {
     min = 10;                       // min marker size
     max = 50;                       // max marker size
}

// trigger the update loop to plot the data
graph.render(data).update(2000, data => {
     // modify the data in this round:
     data.rows.map(row => { 
         row[2] = (Math.random()-0.1)*200;   // y-value
         row[3] = Math.random();             // radius
     });
     return true;
});

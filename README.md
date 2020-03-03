hsGraphD3
========
[![npm version](https://badge.fury.io/js/hsgraphd3.svg)](https://badge.fury.io/js/hsgraphd3)
[![GitHub](https://img.shields.io/badge/GitHub-hsGraphD3-blue.svg)](https://github.com/helpfulscripts/hsgraphd3)
[![docs](https://img.shields.io/badge/hsDocs-hsGraphD3-blue.svg)](https://helpfulscripts.github.io/hsGraphD3/#!/api/hsGraphD3/0)
[![Build Status](https://travis-ci.org/HelpfulScripts/hsGraphD3.svg?branch=master)](https://travis-ci.org/HelpfulScripts/hsGraphD3)
[![Dependencies Status](https://david-dm.org/helpfulscripts/hsgraphd3.svg)](https://david-dm.org/helpfulscripts/hsgraphd3)
[![Coverage Status](https://coveralls.io/repos/github/HelpfulScripts/hsGraphD3/badge.svg?branch=master)](https://coveralls.io/github/HelpfulScripts/hsGraphD3?branch=master)
[![Known Vulnerabilities](https://snyk.io/test/github/HelpfulScripts/hsGraphD3/badge.svg?targetFile=package.json)](https://snyk.io/test/github/HelpfulScripts/hsGraphD3?targetFile=package.json)
[![NPM License](https://img.shields.io/badge/license-MIT-brightgreen.svg)](https://www.npmjs.com/package/hsgraphd3)

Helpful Scripts D3 convenience wrappers for simple plotting.

**hsGraphD3** Provides JavaScript directives to facilitate really simple plotting of data. The API is designed to utilize the vast power of the [D3 framework](d3js.org) while hiding the complexity and steep learning curve.

## Installation
`npm i hsgraphd3`

## Usage
Create a data set to plot. The first row contains column names: 
```
import { GraphCartesian } from 'hsgraphd3';

const data = {
    colNames: ['date', 'time', 'volume', 'costs'], 
    rows:  [
        ['1/1/14', -1,     0.2,      0.3], 
        ['1/1/16',  0.2,   0.7,      0.2], 
        ['9/1/16',  0.4,   0.1,      0.3],
        ['5/1/17',  0.6,  -0.2,      0.1], 
        ['7/1/18',  0.8,   0.3,      0.5], 
        ['1/1/19',  1,     0.2,      0.4]
    ]
};
```

Create the graph and define the series to plot, using the column names:
```
const root = document.root;

const graph = new GraphCartesian(root);
graph.addSeries('bubble', {x:'time', y:'volume', r:'costs'});
```

Optionally, adjust some settings. See <a href='https://helpfulscripts.github.io/hsGraphD3/#!/api/hsGraphD3/hsGraphD3.Settings' target=_blank>Configuration Defaults</a> for a list of all available settings.
```
graph.defaults.axes.color = '#00a';
```

Render the graph:
```
graph.render(data);
```

To create a periodically updated graph, call the update method returned by `render`:
```
const ms = 1000;  // millisecond period

graph.render(data).update(ms, data => {
    data.rows.forEach(row => row[2] = Math.random();
});
``` 

See an [example](https://helpfulscripts.github.io/hsGraphD3/#!/api/hsGraphD3/0) or visit the example pages for
[Cartesian Plots](https://helpfulscripts.github.io/hsGraphD3/#!/api/hsGraphD3/hsGraphD3.CartExamples) or
[Polar Plots](https://helpfulscripts.github.io/hsGraphD3/#!/api/hsGraphD3/hsGraphD3.PolarExamples)

## Series Definitions
Series are defined via the pattern
```
graph.addSeries(<type>, {<dim>:<ValueDef>, ...});
```
- `<type>` defines the type of the plot. For plot types see [ordinal series](https://helpfulscripts.github.io/hsGraphD3/#!/api/hsGraphD3/hsGraphD3.plots.OrdinalSeriesPlot), [numeric series](https://helpfulscripts.github.io/hsGraphD3/#!/api/hsGraphD3/hsGraphD3.plots.NumericSeriesPlot) and [polar series](https://helpfulscripts.github.io/hsGraphD3/#!/api/hsGraphD3/hsGraphD3.plots.PolarSeriesPlot).
- `<dim>` valid series dims are defined as extensions of [SeriesDimensions](https://helpfulscripts.github.io/hsGraphD3/#!/api/hsGraphD3/hsGraphD3.SeriesPlot.SeriesDimensions), for example for [CartesianSeriesDimensions](https://helpfulscripts.github.io/hsGraphD3/#!/api/hsGraphD3/hsGraphD3.CartSeriesPlot.CartSeriesDimensions) or [PolarSeriesDimensions](https://helpfulscripts.github.io/hsGraphD3/#!/api/hsGraphD3/hsGraphD3.PolarSeriesPlot.PolarSeriesDimensions).
- `<ValueDef>` defines the values for `<dim>`. See [ValueDef](https://helpfulscripts.github.io/hsGraphD3/#!/api/hsGraphD3/hsGraphD3.SeriesPlot.ValueDef) for details. In general, values can be defined as 
   - column key for the data set to plot 
   - a numeric constant
   - or a user-defined function of the rowindex of the data set to plot 
   

### Example: [Column plot](https://helpfulscripts.github.io/hsGraphD3/#!/api/hsGraphD3/hsGraphD3.plots.Column)
Side-by-side columns with data-driven popups and labels:
```
graph.series.add('column', {x:'State', y:'costs', label:'State', popup:'costs'});
graph.series.add('column', {x:'State', y:'volume', popup:'volume'});

graph.scales.defaults.dims.hor.ordinal.gap = 0.25;
```

Stacked columns with inline-calculated item label strings:
```
graph.series.add('column', {x:'State', y:'costs',  label:i=>`costs ${i}`,  stacked:'group1'});
graph.series.add('column', {x:'State', y:'volume', label:_=>'volume', stacked:'group1'});
```
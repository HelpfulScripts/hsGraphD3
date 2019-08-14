hsGraphD3
========
[![npm version](https://badge.fury.io/js/hsgraphd3.svg)](https://badge.fury.io/js/hsgraphd3)
[![GitHub](https://img.shields.io/badge/GitHub-hsGraphD3-blue.svg)](https://github.com/helpfulscripts/hsgraphd3)
[![docs](https://img.shields.io/badge/hsDocs-hsGraphD3-blue.svg)](https://helpfulscripts.github.io/hsGraphD3/#!/api/hsGraphD3/0)
[![Build Status](https://travis-ci.org/HelpfulScripts/hsGraphD3.svg?branch=master)](https://travis-ci.org/HelpfulScripts/hsGraphD3)
[![Coverage Status](https://coveralls.io/repos/github/HelpfulScripts/hsGraphD3/badge.svg?branch=master)](https://coveralls.io/github/HelpfulScripts/hsGraphD3?branch=master)
[![NPM License](https://img.shields.io/badge/license-MIT-brightgreen.svg)](https://www.npmjs.com/package/hsgraphd3)
[![Known Vulnerabilities](https://snyk.io/test/github/HelpfulScripts/hsGraphD3/badge.svg?targetFile=package.json)](https://snyk.io/test/github/HelpfulScripts/hsGraphD3?targetFile=package.json)

Helpful Scripts D3 convenience wrappers for for very simple plotting stuff.

**hsGraphD3** Provides JavaScript directives to facilitate really simple plotting of data. The API is designed to utilize the vast power of the [D3 framework](d3js.org) while hiding the complexity and steep learning curve.

## Installation
`npm i hsgraphd3`

## Usage
Create a data set to plot. The first row contains column names: 
```
import { GraphCartesian } from 'hsgraphd3';

const data = [
    ['date', 'time', 'volume', 'costs'], 
    ['1/1/14', -1,  0.2, 0.3], 
    ['1/1/16', 0.2, 0.7, 0.2], 
    ['9/1/16', 0.4, 0.1, 0.3],
    ['5/1/17', 0.6, -0.2,   0.1], 
    ['7/1/18', 0.8, 0.3, 0.5], 
    ['1/1/19', 1,   0.2, 0.4]
];
```

Create the graph and define the series to plot, using the column names:
```
const root = document.root;

const graph = new GraphCartesian(root);
graph.addSeries('bubble', 'time', 'volume', 'costs');
```

Optionally, adjust some settings:
```
graph.defaults.axes.color = '#00a';
```
See [Settings](https://helpfulscripts.github.io/hsGraphD3/#!/api/hsGraphD3/hsGraphD3.Settings) for a list of all available settings.

Render the graph:
```
graph.render(data);
```

See an [example](https://helpfulscripts.github.io/hsGraphD3/#!/api/hsGraphD3/0).

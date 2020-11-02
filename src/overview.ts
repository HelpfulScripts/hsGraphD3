/**
# hsGraphD3
 
Helpful Scripts Graph convenience wrapper for D3js. 
 * <a href="./data/src/hsGraphD3/coverage/" target="_blank">[Coverage Info]</a>

[![npm version](https://badge.fury.io/js/hsgraphd3.svg)](https://badge.fury.io/js/hsgraphd3)
[![GitHub](https://img.shields.io/badge/GitHub-hsGraphD3-blue.svg)](https://github.com/helpfulscripts/hsgraphd3)
[![docs](https://img.shields.io/badge/hsDocs-hsGraphD3-blue.svg)](https://helpfulscripts.github.io/hsGraphD3/#!/api/hsGraphD3/0)
[![Build Status](https://travis-ci.com/HelpfulScripts/hsGraphD3.svg?branch=master)](https://travis-ci.com/HelpfulScripts/hsGraphD3)
[![Dependencies Status](https://david-dm.org/helpfulscripts/hsgraphd3.svg)](https://david-dm.org/helpfulscripts/hsgraphd3)
[![codecov](https://codecov.io/gh/HelpfulScripts/hsGraphD3/branch/master/graph/badge.svg)](https://codecov.io/gh/HelpfulScripts/hsGraphD3)
[![Known Vulnerabilities](https://snyk.io/test/github/HelpfulScripts/hsGraphD3/badge.svg?targetFile=package.json)](https://snyk.io/test/github/HelpfulScripts/hsGraphD3?targetFile=package.json)
[![NPM License](https://img.shields.io/badge/license-MIT-brightgreen.svg)](https://www.npmjs.com/package/hsgraphd3)

 * ___
 * `hsGraphD3` provides convienent programmatic shortcuts to plotting data with [`D3js`](https://d3js.org/).
 * 
 * 
 * ## Usage
 * 1. create a {@link Graph.Graph `Graph`} object with a root DOM element to attach to: <br>
 * `graph = new hsGraphD3.Graph(root);`
 * 2. add desired series configurations, specifying the type of series, as well as the data to use for the x- and y-axes, 
 * and other variables, depending on the series type:<br>
 * `graph.add('area', {x:'time', y:'volume', r:()=>5});`
 * 3. apply any desired formatting changes to the default:<br>
 * `graph.axes.defaults.color = '#88f';`
 * 4. render the graph for a given data set: <br>
 * `graph.render(data);`
 * 
 * To dynamically update the graph to new data, call the {@link Graph.RenderChain `update`} method.
 * 
 * #### Using {@link SeriesPlot.SeriesDimensions Labels, Popups, Colors, }
 * 
 * ## Available Plots:
 * - **Cartesian plots:** {@link CartExamples examples}
 *     - line and scatter plots: {@link plots.Line Line}, {@link plots.Area Area}, {@link plots.Bubble Bubble}, {@link plots.TimeSeries TimeSeries}
 *     - categorical plots: {@link plots.Bar Bar}, {@link plots.Column Column}
 *     - compound plots: {@link plots.Voronoi Voronoi}, 
 * - **Polar plots:** {@link PolarExamples examples}
 *     - pie and doughnut plots: {@link plots.Pie Pie}, 
 * - **non-metric plots**
 *     - Sankey plots: {@link plots.Sankey Sankey}, 
 * 
 * ## Data
 * Data is provided either in table form
 * ```
 * [
 *    colNames[],
 *    <number|string|Date>[],
 *    ...
 * ]
 * ```
 * or in object-literal form 
 * ```
 * {
 *    name?:  string;
 *    colNames:  string[];   
 *    rows:   <number|string|Date>[][];
 * }
 * ```
 * 
 * 
 * ## Example 1: {@link plots.Bubble `bubble`} chart
 * <example height=200px libs={hsGraphD3:'hsGraphD3'}>
 * <file name='script.js'>ximport='overview.x1.js'</file>
 * </example>
 * 
 * ## Example 2: {@link plots.Line `line`} vs. {@link plots.TimeSeries `timeseries`}
 * <example height=200px libs={hsGraphD3:'hsGraphD3'}>
 * <file name='script.js'>ximport='overview.x2.js'</file>
 * </example>
 * 
 * ## Integrations
 * Besides using the standalone version (see examples above), `hsGraph` supports integration 
 * with [`Mithriljs`](http://mithriljs.org):
 * ```
 * m(Graph, {
 *      rootID: 'root',
 *      define: (graph:Graph) => {
 *          graph.add('column', {x:'date', y:'volume'});
 *          graph.defaults.scales.margin.left = 50;
 *      },
 *      data: data
 * })
 * ```  
 * Mithril will take care of the rendering automatically. Render updates can be done via two additional attributes, 
 * `updatePeriod` and `updateCallback`. See the {@link Graph.Graph.constructor Graph.constructor} for details:
 * 
 * ## Dynamically changing the data series
 * When defining the series (e.g. `graph.add('column', {x:'date', y:'volume'});`) 
 * the column names used as reference to the data are made available in the defaults of the series and can 
 * be dynamically changed there:
 * ```
 *    graph.defaults.series[0].dims.y = 'costs';
 * ```
 * If this is done within an event listener that Mithril is aware of, redrawing happens automatically. 
 * Otherwise a redraw can be triggered by calling `m.redraw();`
 */

 /** */
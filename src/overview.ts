/**
# hsGraphD3
 
Helpful Scripts Graph convenience wrapper for D3js. 
 * <a href="./data/src/hsGraphD3/coverage/" target="_blank">[Coverage Info]</a>

[![npm version](https://badge.fury.io/js/hsgraphd3.svg)](https://badge.fury.io/js/hsgraphd3)
[![GitHub](https://img.shields.io/badge/GitHub-hsGraphD3-blue.svg)](https://github.com/helpfulscripts/hsgraphd3)
[![docs](https://img.shields.io/badge/hsDocs-hsGraphD3-blue.svg)](https://helpfulscripts.github.io/hsGraphD3/#!/api/hsGraphD3/0)
[![Build Status](https://travis-ci.org/HelpfulScripts/hsGraphD3.svg?branch=master)](https://travis-ci.org/HelpfulScripts/hsGraphD3)
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
 * <file name='script.js'>
 * // create data set:
 * const data = {
 *    colNames:['date', 'time', 'volume', 'costs'], 
 *    rows:[   ['1/1/14', -1,     0.2,    0.3], 
 *             ['1/1/16',  0.2,   0.7,    0.2], 
 *             ['9/1/16',  0.4,   0.1,    0.3],
 *             ['5/1/17',  0.6,  -0.2,    0.1], 
 *             ['7/1/18',  0.8,   0.3,    0.5], 
 *             ['1/1/19',  1,     0.2,    0.4]]
 * };
 * 
 * // create the graph and define the series to plot:
 * const graph = new hsGraphD3.Graph(root);
 * graph.add('bubble', {x:'time', y:'volume', r:'costs'});
 * 
 * // adjust some settings:
 * graph.axes.defaults.color = '#88f';  // both axes appear blue
 * with (graph.scales.defaults.dims.size.range) {
 *      min = 10;                       // min marker size
 *      max = 50;                       // max marker size
 * }
 * 
 * // trigger the update loop to plot the data
 * graph.render(data).update(2000, data => {
 *      // modify the data in this round:
 *      data.rows.map(row => { 
 *          row[2] = (Math.random()-0.1)*200;   // y-value
 *          row[3] = Math.random();             // radius
 *      });
 *      return true;
 * });
 * </file>
 * </example>
 * 
 * ## Example 2: {@link plots.Line `line`} vs. {@link plots.TimeSeries `timeseries`}
 * <example height=200px libs={hsGraphD3:'hsGraphD3'}>
 * <file name='script.js'>
 * // create data set:
 * const data = {
 *    colNames:['date', 'line', 'series'], 
 *    rows:[   [0,       0.2,     -0.2]], 
 * };
 * let index = 0;
 * while (index<11) { 
 *    val = Math.random();
 *    data.rows.push([index++, val, val-1]); 
 * }
 * 
 * // create the graph and define the series to plot:
 * const graph = new hsGraphD3.Graph(root);
 * graph.add('line', {x:'date', y:'line', y0:()=>0});
 * graph.add('timeseries', {x:'date', y:'series', y0:()=>-1});
 * 
 * //----- adjust some settings:
 * with (graph.defaults) {
 *    scales.dims.hor.aggregateOverTime = false; // forget the past
 *    series.series0.area.rendered = true;  
 *    series.series1.area.rendered = true;  
 *    axes.ver.tickLabel.rendered = false;  // hide vertical axis labels
 * }
 * 
 * // trigger the update loop to plot the data
 * graph.render(data).update(1000, cycle);
 * 
 * function cycle(data) { 
 *      // add a row of data
 *      val = Math.random();
 *      data.rows.push([index++, val, val-1]);
 * 
 *      // remove old row of data:
 *      if (data.rows.length > 10) { data.rows.shift(); }
 * 
 *      // continue update calls:
 *      return true; 
 * };
 * </file>
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
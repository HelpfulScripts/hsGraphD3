/**
 * # hsGraphD3
 * 
 * Helpful Scripts Graph convenience wrapper for D3js. 
 * [`[Github page]`](https://github.com/HelpfulScripts/hsGraphd3)
 * [`[Coverage Info]`](./data/src/hsGraphD3/coverage/)
 * ___
 * `hsGraphD3` provides convienent programmatic shortcuts to plotting data with [`D3js`](https://d3js.org/).
 * 
 * ## Usage
 * 1. create a {@link Graph `Graph`} object with a root DOM element to attach to: `graph = new hsGraphD3.Graph(root);'
 * 2. add desired series configuartions, specifying the type of series, as well as the column names to use for the x- and y-axes, 
 * and other variables, depending on the series type.
 * 3. apply any desired formatting changes to the default
 * 3. render the graph for a given data set: `graph.render(data);`
 * 
 * To dynamically update the graph to new data, call the `update`
 * 
 * ## Data
 * Data is provided either as a [`Data`](https://helpfulscripts.github.io/hsDatab/#!/api/hsDatab/0) object, 
 * or in table form
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
 * ## Example 1: `bubble` chart
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
 * const graph = new hsGraphD3.GraphCartesian(root);
 * graph.addSeries('bubble', 'time', 'volume', 'costs');
 * 
 * // adjust some settings:
 * graph.defaults.axes.color = '#88f';  // both axes appear blue
 * with (graph.defaults.scales.dims.size.range) {
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
 * ## Example 2: `line` vs. `timeseries`
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
 * const graph = new hsGraphD3.GraphCartesian(root);
 * graph.addSeries('line', 'date', 'line');
 * graph.addSeries('timeseries', 'date', 'series');
 * 
 * //----- adjust some settings:
 * with (graph.defaults) {
 *    scales.dims.hor.aggregateOverTime = false; // forget the past
 *    series.series0.line.color = '#00a';  // first line blue
 *    series.series1.line.color = '#0a0';  // second line green
 *    axes.ver.tickLabel.rendered = false; // hide vertical axis labels
 * }
 * 
 * // trigger the update loop to plot the data
 * graph.render(data).update(1000, data => { 
 *      // add a row of data
 *      val = Math.random();
 *      data.rows.push([index++, val, val-1]);
 * 
 *      // remove old row of data:
 *      if (data.rows.length > 10) { data.rows.shift(); }
 * 
 *      // continue update calls:
 *      return true; 
 * });
 * </file>
 * </example>
 */

 /** */
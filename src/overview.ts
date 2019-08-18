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
 * ## Example 1
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
 * with (graph.defaults.scales.dims.costs.range) {
 *      min = 10;                       // min marker size
 *      max = 80;                       // max marker size
 * }
 * 
 * // trigger the update loop to plot the data
 * update();
 * 
 * function update() {
 *      // modify the data in this round:
 *      data.rows.map(row => { // change y-value and radius
 *          row[2] = (Math.random()-0.1)*graph.viewport.height;
 *          row[3] = Math.random()*50;
 *      });
 * 
 *      // render the graph: 
 *      graph.render(data);
 * 
 *      // trigger next update in 2s:
 *      setTimeout(update, 2000);  // update every 2 seconds
 * }
 * </file>
 * </example>
 * 
 * ## Example 2
 * <example height=200px libs={hsGraphD3:'hsGraphD3'}>
 * <file name='script.js'>
 * // create data set:
 * const data = {
 *    colNames:['date', 'time', 'volume'], 
 *    rows:[   [0,       0.2,     -0.2]], 
 * };
 * 
 * // create the graph and define the series to plot:
 * const graph = new hsGraphD3.GraphCartesian(root);
 * graph.addSeries('line', 'date', 'time');
 * graph.addSeries('line', 'date', 'volume');
 * 
 * // adjust some settings:
 * graph.defaults.scales.hor.aggregateOverTime = false;  // forget early indexes
 * graph.defaults.series.series0.line.color = '#00a';  // first line blue
 * graph.defaults.series.series1.line.color = '#0a0';  // first line blue
 * 
 * // trigger the update loop to plot the data
 * let index = 0;
 * update();
 * 
 * function update() {
 *      index++;
 *      // modify the data in this round:
 *      data.rows.push([index, Math.random(), Math.random()-1]);
 *      if (data.rows.length > 10) { data.rows.shift(); }
 * 
 *      // render the graph: 
 *      graph.render(data);
 * 
 *      // trigger next update in 1s:
 *      setTimeout(update, 1000);
 * }
 * </file>
 * </example>
 */

 /** */
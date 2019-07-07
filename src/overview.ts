/**
 * # hsGraphD3
 * 
 * Helpful Scripts Graph convenience wrapper for D3js. 
 * [`[Github page]`](https://github.com/HelpfulScripts/hsGraphd3)
 * [`[Coverage Info]`](./data/src/hsGraph/coverage/)
 * ___
 * `hsGraphD3` provides convienent programmatic shortcuts to plotting data with [`D3js`](https://d3js.org/).
 * 
 * ## Usage
 * 1. create a {@link Graph `Graph`} object with a root DOM element to attach to: `graph = new hsGraphD3.Graph(root);'
 * 2. add desired series configuartions, specifying the type of series, as well as the column names to use for the x- and y-axes, 
 * and other variables, depending on the series type.
 * 3. render the graph for a given data set: `graph.render(data);`
 * 
 * ## Data
 * Data is provided either as a [`Data`](https://helpfulscripts.github.io/hsDatab/#!/api/hsDatab/0) object, or in the form 
 * ```
 * {
 * name?:  string;
 * colNames:  string[];   
 * rows:   <number|string|Date>[][];
 * }
 * ```
 * 
 * ## Example
 * <example height=200px libs={hsGraphD3:'hsGraphD3',hsDatab:'hsDatab',d3:'https://d3js.org/d3.v5.min.js'}>
 * <file name='script.js'>
 * // create data set:
 * const data = new hsDatab.Data({
 *    colNames:['date', 'time', 'volume', 'costs'], 
 *    rows:[['1/1/14', -1,  0.2, 0.3], ['1/1/16', 0.2, 0.7, 0.2], ['9/1/16', 0.4, 0.1, 0.3],
 *          ['5/1/17', 0.6, 0,   0.1], ['7/1/18', 0.8, 0.3, 0.5], ['1/1/19', 1,   0.2, 0.4]]
 * });
 * 
 * // setup and plot the data:
 * const graph = new hsGraphD3.Graph(root);
 * graph.addSeries('bubble', 'time', 'volume', 'costs');
 * graph.addSeries('bubble', 'time', 'volume', 'costs');
 * 
 * //with (graph.defaults.Scales('costs').scale) {
 * //     range.min = 0
 * //     range.min = 20
 * //}
 * 
 * with (graph.defaults.Graph.canvas) {
 *      fill.color = '#eee';
 *      stroke.width = 0;
 * }
 * with (graph.defaults.Axes.hor) {
 *      tickLabel.font.size = 200;
 * }
 * with (graph.defaults.Plot.area) {
 *      //fill.color = '#fcc';
 * }
 * graph.render(data);
 * 
 * // change values avery 2s:
 * setInterval(() => {
 *    data.getData().map(row => {
 *      //row[1] = Math.random()*graph.config.viewPort.width;
 *      row[2] = Math.random()*graph.config.viewPort.height;
 *      row[3] = Math.random()*50;
 *      graph.render(data);
 *    });
 *    data.sort('ascending', 'x');
 * }, 2000);
 * 
 * 
 * </file>
 * </example>
 */

 /** */
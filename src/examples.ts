/**
 * #Examples
 * 
 * <example height=600px libs={hsGraphD3:'hsGraphD3', hsUtil:'hsUtil'}>
 * <file name='script.js'>
 * const log = hsUtil.log('EXAMPLES');
 * const data = {
 *    colNames:['item', 'date', 'line', 'series'], 
 *    rows:[['a', 0.0,  0.2, -0.3], 
 *          ['b', 0.2,  0.7, -0.2], 
 *          ['c', 0.4,  0.1, -0.9],
 *          ['d', 0.6,  0.2, -0.1], 
 *          ['e', 0.8,  0.3, -0.5], 
 *          ['f', 1,    0.2, -0.4]]
 * };
 * 
 * const content = [
 *      m(nodeGraph(graph => {
 *          graph.addSeries('line', {x:'date', y:'line', y0:()=>0});
 *      })), 
 *      m(nodeGraph(graph => {
 *          graph.addSeries('timeseries', {x:'date', y:'series', y0:()=>-1});
 *      })), 
 *      m(nodeGraph(graph => {
 *          graph.addSeries('bubble', {x:'date', y:'series', r:'date'});
 *      })), 
 *      m(nodeGraph(graph => {
 *          graph.addSeries('bar', {x:'line', y:'item'});
 *      })), 
 *      m(nodeGraph(graph => {
 *          graph.addSeries('column', {x:'item', y:'line'});
 *      }))
 * ];
 * 
 * m.mount(root, {
 *   view:() => m(hsLayout.Layout, { rows: [], content:content }),
 * });
 * 
 * function nodeGraph(configure) {
 *      const cls = 'a'+parseInt(''+Math.random()*100000);
 *      return {
 *          view:() => m(`div.${cls}#${cls}`),
 *          oncreate:() => {
 *              const svg = root.getElementsByClassName(cls)[0];
 *              if (svg) { 
 *                  const graph = new hsGraphD3.GraphCartesian(svg);
 *                  configure(graph); 
 *                  graph.render(data);
 *              }
 *          }
 *      }
 * }
 * </file>
 * </example>
 * 
 */

 /** */
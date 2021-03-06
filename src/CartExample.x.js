const content = [
     graph => {
         graph.add('line', {y:'Joe'});
         graph.add('line', {y:'Mary'});
         graph.title.text = `simple indexed 'line' graph`;
         graph.render(data);
     }, 

     graph => {
         graph.add('line', {x:'time', y:'Joe'});
         graph.add('line', {x:'time', y:'Mary'});
         graph.title.text = `simple 'line' graph`;
         graph.render(data);
     }, 

     graph => {  
         graph.add('line', {x:'time', y:'Joe'});
         graph.add('line', {x:'time', y:'Mary'});
         graph.title.text = `'line' graph with dynamic updates`;
         graph.render(data).update(2000, update);
     }, 

     graph => {
         graph.add('area', {x:'time', y:'Joe'});
         graph.add('area', {x:'time', y:'Mary'});
         graph.title.text = `simple 'area' graph`;
         graph.render(data).update(2000);
     }, 

     graph => {
         graph.add('area', {x:'time', y:'Joe'});
         graph.add('area', {x:'time', y:'Mary', y0:'Joe'});
         graph.title.text = `difference 'area' graph`;
         graph.render(data).update(2000);
     }, 

     graph => {
         graph.add('area', {x:'time', y:'Joe', stacked:'myStack'});
         graph.add('area', {x:'time', y:'Mary', stacked:'myStack'});
         graph.title.text = `stacked 'area' graph`;
         graph.render(data).update(2000);
     }, 

     graph => {
         graph.add('area', {x:'time', y:'Joe'});
         graph.add('area', {x:'time', y:'Mary', y0:()=>1});
         graph.title.text = `raised 'area' graph`;
         graph.render(data).update(2000);
     }, 

     graph => {
         graph.add('area', {x:'time', y:'Joe', y0:()=>1});
         graph.add('area', {x:'time', y:'Mary', y0:()=>1});
         graph.title.text = `opposed 'area' graph`;
         graph.render(data).update(2000);
     }, 

     graph => {
         graph.add('line', {x:'time', y:'Joe'});
         graph.add('line', {x:'time', y:'Mary'});
         graph.series.defaults.series0.area.rendered = true;
         graph.series.defaults.series0.marker.rendered = true;
         graph.title.text = `'line' graph with area and markers for 1st series`;
         graph.render(data).update(2000);
     }, 

     graph => { 
         graph.add('bubble', {x:'time', y:'Joe'});
         graph.add('bubble', {x:'time', y:'Mary', r:'Joe'});
         graph.title.text = `'bubble' graph`;
         graph.render(data).update(2000);
     }, 

     graph => {
         graph.add('timeseries', {x:'time', y:'Joe'});
         graph.add('timeseries', {x:'time', y:'Mary'});
         graph.title.text = `'time series'`;
         graph.render(dataTS).update(2000, updateTS);
     }, 


     graph => { 
         graph.add('column', {x:'item', y:'Joe', label:'item'});
         graph.add('column', {x:'item', y:'Mary', label:(row,i)=>i});
         graph.title.text = `'column' graph`;
         graph.render(data).update(2000);
     }, 

     graph => { 
         graph.add('column', {x:'item', y:'Joe', stacked:'myGroup', label:(row,i)=>`<${i}>`});
         graph.add('column', {x:'item', y:'Mary', stacked:'myGroup', label:5});
         graph.title.text = `stacked 'column' graph`;
         graph.render(data).update(2000);
     }, 


     graph => { 
         graph.add('column', {x:'item', y:'Mary', color:(row,i)=>i});
         graph.title.text = `'default colored column' graph`;
         graph.render(data).update(2000);
     }, 


     graph => { 
         graph.add('column', {x:'item', y:'Mary', color:'item'});
         graph.title.text = `'default colored column' graph`;
         graph.render(data).update(2000);
     }, 


     graph => { 
         graph.add('column', {x:'item', y:'Mary', color:'greens'});
         graph.title.text = `'greens colored column' graph`;
         graph.render(data).update(2000);
     }, 


     graph => { 
         graph.add('column', {x:'item', y:'Mary', color:'time'});
         graph.title.text = `'data colored column' graph`;
         graph.render(data).update(2000);
     }, 

     
     graph => { 
         graph.add('bar', {x:'Joe', y:'item'});
         graph.add('bar', {x:'Mary', y:'item'});
         graph.title.text = `'bar' graph`;
         graph.render(data).update(2000);
     }, 

     graph => {
         graph.add('bar', {x:'Joe', y:'item', stacked:'myGroup'});
         graph.add('bar', {x:'Mary', y:'item', stacked:'myGroup'});
         graph.title.text = `stacked 'bar' graph`;
         graph.render(data).update(2000);
     }, 
];

const data = {
   colNames:['item', 'time', 'Joe', 'Mary'], 
   rows:[   ['a',    0.0,    0.2,    1.3], 
            ['b',    0.2,    0.7,    1.2], 
            ['c',    0.4,    0.1,    1.9],
            ['d',    0.6,    0.2,    1.1], 
            ['e',    0.8,    0.3,    1.5], 
            ['f',    1,      0.2,    1.4]]
}

const update = (data) => {
     const Joe = data.colNames.indexOf('Joe');
     const Mary = data.colNames.indexOf('Mary');
     data.rows.forEach(row => {
         row[Joe]  = Math.random();
         row[Mary] = Math.random() + 1;
     });
     // continue updating
}

// time series structures
const dataTS = {
   colNames:['time', 'Joe', 'Mary'], 
   rows:[]
}

let time = 0;
while (time<11) { 
   val = Math.random();
   dataTS.rows.push([(time++)/5, val, val-1]); 
}

const updateTS = (data) => {
     dataTS.rows.push([(time++)/5, Math.random(), Math.random() + 1]);
     if (dataTS.rows.length > 10) { dataTS.rows.shift(); }
     // no return -> continue updating
}

m.mount(root, {
    view:() => m(hsWidget.Grid, { rows: `50px repeat(${content.length}, 130px)` }, [
        m('div', {style:'background-color:white;'}),
        ...content.map(fn => m(nodeGraph(fn)))
    ]),
});

function nodeGraph(configure) {
     // create a random class and ID.
     const cls = 'a'+parseInt(''+Math.random()*100000);

     // return a mithril node
     return {
         view:() => m(`div.${cls}#${cls}`),
         oncreate:() => {
             const graphRoot = root.getElementsByClassName(cls)[0];
             if (graphRoot) { 
                 const graph = new hsGraphD3.Graph(graphRoot);
                 graph.defaults.popup.offset.xPx = -45;
                 graph.defaults.popup.offset.yPx = -45;
                 configure(graph); 
             }
         }
     }
}

   
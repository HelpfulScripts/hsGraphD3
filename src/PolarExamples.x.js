const content = [
     graph => {
         graph.add('pie', {phi:'Joe'});
         graph.title.text = `angular 'pie' graph: constant radius`;
         setDefaults(graph)
         graph.render(data);
     }, 








     graph => {
         graph.add('pie', {r:'Mary', label:'Mary'});
         graph.title.text = `radial 'pie' graph: constant angles`;
         setDefaults(graph)
         graph.render(data);
     }, 








     graph => {
         graph.add('pie', {r:'Mary', r0:1.5, label:'Mary'});
         graph.title.text = `inward radial 'pie' graph: constant angles`;
         setDefaults(graph)
         graph.render(data);
     }, 








     graph => {
         graph.add('pie', {phi:'Mary', r0:0.5});
         graph.title.text = `'doughnut' graph`;
         setDefaults(graph, 0.02)
         graph.render(data);
     }, 








     graph => {
         graph.add('pie', {phi:'Mary', r0:0.5, color:i=>i});
         graph.title.text = `colored 'doughnut' graph`;
         setDefaults(graph, 0.02)
         graph.render(data);
     }, 








     graph => {
         graph.add('pie', {r:'Joe', r0:0.7, color:i=>i});
         graph.title.text = `dynamic pie: outward and inward radials`;
         setDefaults(graph, 0.02)
         graph.render(data).update(2000, update);
     }, 


];

function setDefaults(graph, pad=0) {
     with (graph.defaults.series[0]) {
         marker.stroke.color = '#fff';
         cornerRadius = 5;
         padAngle = pad;
         label.xpos = '80%';
     }
}

const data = {
   colNames:['item', 'time', 'Joe', 'Mary'], 
   rows:[   ['a',    0.0,    0.2,    0.7], 
            ['b',    0.2,    0.7,    1.2], 
            ['c',    0.4,    0.1,    0.6],
            ['d',    0.6,    0.2,    0.7], 
            ['e',    0.8,    0.3,    0.8], 
            ['f',    1,      0.2,    0.7]]
}

const update = (data) => {
     const Joe = data.colNames.indexOf('Joe');
     const Mary = data.colNames.indexOf('Mary');
     data.rows.forEach(row => {
         row[Joe]  = Math.random() + 0.2;
         row[Mary] = Math.random() + 0.5;
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
    view:() => m(hsWidget.Grid, { rows: `50px repeat(${content.length}, 250px)` }, [
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

   
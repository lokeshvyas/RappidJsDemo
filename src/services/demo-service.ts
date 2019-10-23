import * as joint from "../../vendor/rappid";
import * as $ from 'jquery';
window.joint = joint;
//import {shapes, dia} from "../../vendor/rappid";


//import * as joint from 'jointjs'

import * as dagre from 'dagre';
import *  as _ from "lodash";
import {ToolbarService} from "./toolbar-service";
import {HaloService} from "./halo-service";
import * as appShape from '../shapes/app-shapes';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
//
export class DemoService {
  nodes:any;
  edges:any;
  x: any
  el: Element;
  graph: joint.dia.Graph;
  paper: joint.dia.Paper;
  paperScroller: joint.ui.PaperScroller;
  commandManager: joint.dia.CommandManager;
  selection: joint.ui.Selection;
  navigator: joint.ui.Navigator;
  snaplines: joint.ui.Snaplines;
  toolbarService: ToolbarService;
  haloService: HaloService;

  // variables
  filePath ='../assets/scheme.json';

  // Constrcutor
  constructor(private http: HttpClient, el: Element, toolbarService: ToolbarService, haloService: HaloService){
    this.el = el;
    // apply current joint js theme
    new joint.mvc.View({ el: this.el });
    this.toolbarService = toolbarService
    this.haloService= haloService;
  }

  startRappid(){
    joint.setTheme('modern');//modern//bpmn
    // requires initialization of many libraries:
   //this.createModel();
    //this.getModel();
    this.createActualModel();
  //   this.initializePaper();
  //  // this.initializeToolbar();
  //   //this.initializeToolsAndInspector();

  //   // rendering
    //this.forceLayoutRendering();
  }

createActualModel(){
  // read json
  this.getData().subscribe(data=>{
console.log(data);
     // get the nodes
  this.nodes = data.nodes.map( (n) => {
    return {"type": "standard.Rectangle",
			"size": {"width": 150,"height": 80},
      "id": n.name, "z": 1,
			"attrs": {
				"body": {"fill": "gray"},
        "label": {
            "fill": "white",
            "text": this.wrapText(n.text,150,80)

            // "wraptext": {
            //   "text": n.text,
            //   "width": -10, // reference width minus 10
            //   "height": '50%' // half of the reference height
            // }

          }

			}
		}
   });
   // get the edges, links
   this.edges = data.edges.map((e) =>
   {
    return {
      "type": "standard.Link",
      "source": {"id": e.from_node},
      "target": { "id": e.to_node},
      "id": e.name, "z": 2,
      "anchor" : {name: "center", args: {rotate:true}},
      //"router":{"name":"orthogonal", "args" :{"padding": "10"}},
      "router":{"name":"manhattan", "args" :{"padding": "10", "startDirections": ["top"], "endDirections": ["bottom"]}},//
      "connector":{"name":"rounded"},
      labelOffset: 10,
      labelSize: {
          width: 200,
          height: 100
      },
      labels: [{
        markup: [{
            tagName: 'rect',
            selector: 'labelBody'
        }, {
            tagName: 'text',
            selector: 'labelText'
        }],
        attrs: {
            labelText: {
                fill: 'gray',
                textAnchor: 'middle',
                refY: 5,
                refY2: '-50%',
                cursor: 'pointer',
                text:this.wrapText(e.text,200,100)
            },
            labelBody: {
                fill: 'lightgray',
                stroke: 'gray',
                strokeWidth: 2,
                refWidth: '100%',
                refHeight: '100%',
                refX: '-50%',
                refY: '-50%',
                rx: 5,
                ry: 5
            }
        },
        size: {
            width: 200, height: 100
        }
    }]
      // "labels":[{
      //     "attrs":
      //      {
      //         "text":
      //            {
      //              "text":e.text,
      //              textAnchor: 'middle',
      //              refY: 5,
      //              refY2: '-50%',
      //              fontSize: 20,
      //              cursor: 'pointer'
      //           },
      //           size: {
      //             width: 150, height: 30
      //            },
      //            'rect':{
      //             fill: 'lightgray',
      //             stroke: 'gray',
      //             strokeWidth: 2,
      //             refWidth: '100%',
      //             refHeight: '100%',
      //             refX: '-50%',
      //             refY: '-50%',
      //             rx: 5,
      //             ry: 5
      //         }

      //     }

      //   }
      // ]
      }
    });

    const graph = this.graph= new joint.dia.Graph( {type: 'standard' },{});
    graph.on('add',(cell: joint.dia.Cell, connection: any, opt: any)=>{});
    this.commandManager = new joint.dia.CommandManager({graph: graph});
      // move index of last node to the end of the array
   let node1 = this.nodes.filter((p)=> p.key === "end_node");
   let index = this.nodes.indexOf(node1[0])
   this.nodes.splice(this.nodes.length, 0, this.nodes.splice(index,1)[0] );

    //let xg = { "cells":[this.edges, this.nodes]};

    //let b = JSON.stringify(this.edges) + "," + JSON.stringify(this.nodes);
    //let z= $.extend( this.edges,this.nodes );
    let p = { "cells":[]};
    //let xd = p.cells.push(this.edges);
    for(let i=0;i<this.nodes.length;i++) {
      //if(i>10)  break;
      p.cells.push(this.nodes[i]);
    }
    for(let i=0;i<this.edges.length;i++) {
      //if(i>10)  break;
      p.cells.push(this.edges[i]);
    }

   // p.cells.push(this.nodes);
    console.log(p);
    this.graph.fromJSON(p);

    this.initializePaper();
    //this.forceLayoutRendering();
    this.treeLayoutRendering();
    //this.layoutDirected();
  }, error=> console.log(error));
}

getModel(){
  let str={ "cells": [
		{
			"type": "standard.Rectangle",

			"size": {
				"width": 100,
				"height": 40
			},

			"id": "node1",
			"z": 1,
			"attrs": {
				"body": {
					"fill": "gray"
				},
				"label": {
					"fill": "white",
					"text": "node1"
				}
			}
		},
		{
			"type": "standard.Rectangle",

			"size": {
				"width": 100,
				"height": 40
			},

			"id": "node2",
			"attrs": {
				"body": {
					"fill": "gray"
				},
				"label": {
					"fill": "white",
					"text": "node2"
				}
			}
		},
		{
			"type": "standard.Link",
			"source": {
				"id": "node1"
			},
			"target": {
				"id": "node2"
			},
			"id": "link1",
      "z": 2,
      "labels":[
        {
          "attrs":
          {
            "text":
            {
              "text":"test link!"
            }
          }
        }
      ]
		}
  ]};
  console.log(str);
  //str  = this.x;
  //let ss = new joint.dia.Element.define()
  const graph = this.graph= new joint.dia.Graph( {type: 'standard' },{// type: 'appShape',//new joint.dia.Graph({},
  //  cellNamespace:  joint.shapes.standard,
   });
let s = new joint.shapes.bpmn.Activity().subProcess
    graph.on('add',(cell: joint.dia.Cell, connection: any, opt: any)=>{});
   this.commandManager = new joint.dia.CommandManager({graph: graph});
//let s = joint.shapes.standard.Link
  // this.getData().subscribe(data=>{
  // this.graph.fromJSON(data);
  // }, error=> console.log(error));
  let ss = this.graph.fromJSON( str);
  //this.graph.parse();
  //this.graph= this.graph.fromJSON( str);
  //console.log(ss.getLinks[0]);
//   if(this.graph.getLinks[0])
//   this.graph.getLinks[0].appendLabel({ attrs: {
//     text: {
//         text: 'Hello, World!'
//     }
// }});
  console.log(this.graph);
}

forceLayoutRendering(){
  var graphLayout = new joint.layout.ForceDirected({
    graph: this.graph, // or array of selected cells
    x: 0,
    y: 0,
     width: document.getElementById('app-body').clientWidth,//1200,
     height: document.getElementById('app-body').clientHeight,//800,
    gravityCenter: { x: 600, y: 600 },
    charge: 180,
    linkDistance: 100
  });

  graphLayout.start();

  //Array.from({ length: 100 }).forEach(function() { graphLayout.step(); });
  _.each(_.range(100), function() { graphLayout.step(); });
}

treeLayoutRendering(){
  var layout = new joint.layout.TreeLayout({
    graph: this.graph,
    parentGap: 20,
    siblingGap: 20,
  });
  var root = this.graph.getElements()[0].position(200, 200);

  layout.layout();
}

//read the input from scheme.json and create a modal out of that
getData(): Observable<any> {
  return this.http.get(this.filePath);
}

initializePaper() {
  console.log('initialing ')
  // const graph = this.graph= new joint.dia.Graph({},
  //   {cellNamespace: appShape});

  // graph.on('add',(cell: joint.dia.Cell, connection: any, opt: any)=>{});
  // this.commandManager = new joint.dia.CommandManager({graph: graph});

  const paper = this.paper = new joint.dia.Paper({
    //el: document.getElementById('app-body'),
      width:document.getElementById('app-body').clientWidth,
      height:document.getElementById('app-body').clientHeight,
      drawGrid: true,

      background: new OffwhiteBackground(),
      model: this.graph});

      var paperScroller = new joint.ui.PaperScroller({
        paper: paper,
        autoResizePaper:true,
        contentOptions: { minWidth: 930, minHeight: 870, gridHeight:870, gridWidth:930 }

      });
      $('#app-body').append(paperScroller.render().el);
      console.log('completed')
}

createModel(){
  // var graph = new joint.dia.Graph;
  const graph = this.graph= new joint.dia.Graph({},
   {cellNamespace: joint.shapes.standard});

   graph.on('add',(cell: joint.dia.Cell, connection: any, opt: any)=>{});
   this.commandManager = new joint.dia.CommandManager({graph: graph});

       var rect = new joint.shapes.standard.Rectangle();
      // rect.position(100, 30);
       rect.resize(100, 40);
       rect.attr({
           body: {
               fill: 'blue'
           },
           label: {
               text: 'node1',
               fill: 'white'
           }
       });
       rect.addTo(graph);

       var rect2 = rect.clone() as (joint.shapes.standard.Rectangle) ;
      // rect2.position(300, 0);
       rect2.attr('label/text', 'node2');
       rect2.addTo(graph);

       var link = new joint.shapes.standard.Link();
       link.source(rect);
       link.target(rect2);
       link.addTo(graph);
       link.appendLabel({
        attrs: {
            text: {
                text: 'test link!'
            }
        }
    });
       console.log(JSON.stringify(graph.toJSON()));
       this.x = graph.toJSON();
       console.log(graph);
 }

initializeToolbar() {

  this.toolbarService.create(this.commandManager, this.paperScroller);

  this.toolbarService.toolbar.on({
      'svg:pointerclick': this.openAsSVG.bind(this),
      'png:pointerclick': this.openAsPNG.bind(this),
      'to-front:pointerclick': this.applyOnSelection.bind(this, 'toFront'),
      'to-back:pointerclick': this.applyOnSelection.bind(this, 'toBack'),
      'layout:pointerclick': this.layoutDirectedGraph.bind(this),
      'snapline:change': this.changeSnapLines.bind(this),
      'clear:pointerclick': this.graph.clear.bind(this.graph),
      'print:pointerclick': this.paper.print.bind(this.paper),
      'grid-size:change': this.paper.setGridSize.bind(this.paper)
  });

    this.renderPlugin('.toolbar-container', this.toolbarService.toolbar);
}


layoutDirected() {

  // var paper = this.options.paper;
  // var graph = paper.model;
  // var cells = this.options.cells;

  this.paper.freeze();

  joint.layout.DirectedGraph.layout(this.graph, this.getLayoutOptions());

  if (this.graph.getCells().length === 0) {
      // The graph could be empty at the beginning to avoid cells rendering
      // and their subsequent update when elements are translated
     // this.graph.resetCells(cells);
  }

 this. paper.fitToContent({
     // padding: this.options.padding,
      allowNewOrigin: 'any',
      useModelGeometry: true
  });

  this.paper.unfreeze();
}

layoutDirectedGraph() {

  joint.layout.DirectedGraph.layout(this.graph, {
      graphlib: dagre.graphlib,
      dagre: dagre,
      setVertices: true,
      rankDir: 'TB',
      marginX: 100,
      marginY: 100,
  });

  this.paperScroller.centerContent();
}
getLayoutOptions() {
  return {
      dagre: dagre,
      graphlib: dagre.graphlib,
      setVertices: true,
      setLabels: true,
     // ranker: $('#ranker').val(),
     // rankDir: $('#rankdir').val(),
      align: $('#align').val(),
     // rankSep: $('#ranksep').val(),
    //  edgeSep: $('#edgesep').val(),
     // nodeSep: $('#nodesep').val()
  };
}
renderPlugin(selector: string, plugin: any): void {

  this.el.querySelector(selector).appendChild(plugin.el);
  plugin.render();
}

initializeToolsAndInspector() {

    this.paper.on('element:pointerup', (elementView: joint.dia.ElementView) => {

        const element = elementView.model;

        if (this.selection.collection.contains(element)) return;

        new joint.ui.FreeTransform({
            cellView: elementView,
            allowRotation: false,
            preserveAspectRatio: !!element.get('preserveAspectRatio'),
            allowOrthogonalResize: element.get('allowOrthogonalResize') !== false
        }).render();

        this.haloService.create(elementView);
        this.selection.collection.reset([]);
        this.selection.collection.add(element, { silent: true });

        this.paper.removeTools();
       // this.inspectorService.create(element)
    });

    this.paper.on('link:pointerup', (linkView: joint.dia.LinkView) => {

        const link = linkView.model;

        const ns = joint.linkTools;
        const toolsView = new joint.dia.ToolsView({
            name: 'link-pointerdown',
            tools: [
                new ns.Vertices(),
                new ns.SourceAnchor(),
                new ns.TargetAnchor(),
                new ns.SourceArrowhead(),
                new ns.TargetArrowhead(),
                new ns.Segments,
                new ns.Boundary({ padding: 15 }),
                new ns.Remove({ offset: -20, distance: 40 })
            ]
        });

        this.selection.collection.reset([]);
        this.selection.collection.add(link, { silent: true });

        const paper = this.paper;
        joint.ui.Halo.clear(paper);
        joint.ui.FreeTransform.clear(paper);
        paper.removeTools();

        linkView.addTools(toolsView);

        //this.inspectorService.create(link)
    });

    this.paper.on('link:mouseenter', (linkView: joint.dia.LinkView) => {

        // Open tool only if there is none yet
        if (linkView.hasTools()) return;

        const ns = joint.linkTools;
        const toolsView = new joint.dia.ToolsView({
            name: 'link-hover',
            tools: [
                new ns.Vertices({ vertexAdding: false }),
                new ns.SourceArrowhead(),
                new ns.TargetArrowhead()
            ]
        });

        linkView.addTools(toolsView);
    });

    this.paper.on('link:mouseleave', (linkView: joint.dia.LinkView) => {

        // Remove only the hover tool, not the pointerdown tool
        if (linkView.hasTools('link-hover')) {
            linkView.removeTools();
        }
    });

    this.graph.on('change', (cell: joint.dia.Cell, opt: any ) => {

        if (!cell.isLink() || !opt.inspector) return;

        const ns = joint.linkTools;
        const toolsView = new joint.dia.ToolsView({
            name: 'link-inspected',
            tools: [
                new ns.Boundary({ padding: 15 }),
            ]
        });

        cell.findView(this.paper).addTools(toolsView);
    });
}

initializeNavigator() {

  const navigator = this.navigator = new joint.ui.Navigator({
      width: 240,
      height: 115,
      paperScroller: this.paperScroller,
      zoom: false,
      paperOptions: {
          async: true,
       //   elementView: appShapes.NavigatorElementView,
       //   linkView: appShapes.NavigatorLinkView,
          cellViewNamespace: { /* no other views are accessible in the navigator */ }
      }
  });

  this.renderPlugin('.navigator-container', navigator);
}


openAsSVG() {

  this.paper.hideTools().toSVG((svg: string) => {
      new joint.ui.Lightbox({
          image: 'data:image/svg+xml,' + encodeURIComponent(svg),
          downloadable: true,
          fileName: 'Rappid'
      }).open();
      this.paper.showTools();
  }, { preserveDimensions: true, convertImagesToDataUris: true });
}
openAsPNG() {

  this.paper.hideTools().toPNG((dataURL: string) => {
      new joint.ui.Lightbox({
          image: dataURL,
          downloadable: true,
          fileName: 'Rappid'
      }).open();
      this.paper.showTools();
  }, { padding: 10 });
}
applyOnSelection(method: string) {
  this.graph.startBatch('selection');
  this.selection.collection.models.forEach(function(model: joint.dia.Element) { model[method](); });
  this.graph.stopBatch('selection');
}
changeSnapLines(checked: boolean) {

  if (checked) {
      this.snaplines.startListening();
     // this.stencilService.stencil.options.snaplines = this.snaplines;
  } else {
      this.snaplines.stopListening();
     // this.stencilService.stencil.options.snaplines = null;
  }
}
wrapText (text: string, width: number, height: number){
  return joint.util.breakText(text, {
  width:width,
  height: height || 30
});
}
}

class OffwhiteBackground implements joint.dia.Paper.BackgroundOptions {
  color: 'gray'//'#fffccc'
}

declare global {
  interface Window {
      joint:any;
  }
  // class global implements Window {
  //   joint:any;
  // }
 }

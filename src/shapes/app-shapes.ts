import * as joint from '../../vendor/rappid';
import {} from 'lodash';

export namespace app {

  export class GroupModel extends joint.shapes.bpmn.Group {
    portLabelMarkup = [{
      tagName: 'text',
      selector: 'portLabel'
  }];

  defaults(){
    return joint.util.defaultsDeep({
      type: 'app.GroupModel',

    },joint.shapes.bpmn.Group.prototype.defaults() );
  }
  }
  export class FlowModel extends joint.shapes.bpmn.Flow {
   portlabelMarkup =[{
    tagName: 'text',
    selector: 'portLabel'
   }];
   defaults(){
     return joint.util.defaultsDeep({
       type: 'app.FlowModel',
       attrs:{
         root:{
           magnet: false
         }
       },
       ports: {
         groups: {//CSS
           'in': {
          markup:[{
            tagName: 'circle',
            selector: 'portBody',
            attributes: {'r': 10}
          }],
          attrs: {
            portBody: {
              magnet: true,
              fill: '#463cdf',
              strokeWidth: 0
            },
            portLabel: {
              fontSize:11,
              fill: '#61549c',
              fontWeight: 800
            }
          },
            position:{
              name: 'left'
            },
            label: {
              position:{
                name: 'left',
                args: {y:0}
              }
            }
         },
         'out': {
           markup: [{
            tagName: 'circle',
            selector: 'portBody',
            attributes: {
              'r': 10
            }
           }],
           position: {
             name: 'right'
           },
           attrs: {
            portBody: {
              magnet: true,
              fill: '#463cdf',
              strokeWidth: 0
            },
            portLabel: {
              fontSize:11,
              fill: '#61549c',
              fontWeight: 800
            }
          },
          label: {
            position:{
              name: 'left',
              args: {y:0}
            }
          }
         }
        }
       }
     }, joint.shapes.bpmn.Flow.prototype.defaults);
   }
  }

  export class ActivityModel extends joint.shapes.bpmn.Activity {
    portLabelMarkup = [{
      tagName: 'text',
      selector: 'portLabel'
  }];
  defaults(){
    return new joint.shapes.bpmn.Activity({
      attrs: {
          '.body': { fill: 'gold', stroke: 'black' },
          '.label': { text: 'My Activity' }
      },
      content: 'A content of the Activity',
      activityType: 'transaction'
  });
  }

  }



export class GroupMessage extends joint.shapes.bpmn.Message {
  portLabelMarkup = [{
    tagName: 'text',
    selector: 'portLabel'
}];
  }
}

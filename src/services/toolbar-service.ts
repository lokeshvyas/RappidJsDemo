import * as joint from "../../vendor/rappid";


export class ToolbarService {
toolbar: joint.ui.Toolbar;

create (commandManager: joint.dia.CommandManager, prepareScroller: joint.ui.PaperScroller) {
  const {tools, groups} = this.getToolbarConfig();
  this.toolbar = new joint.ui.Toolbar ({
    groups,
    tools,
    references: {
      commandManager: commandManager,
      prepareScroller: prepareScroller
    }
  });
}

getToolbarConfig (){
  return {
    groups: {
       'undo-redo': {index: 1, align: joint.ui.Toolbar.Align.Left},
       'clear': {index:2, align: joint.ui.Toolbar.Align.Left },
    },
    tools:[
      {
        type: 'undo',
        name: 'undo',
        group: 'undo-redo',
        attrs: {
            button: {
              'data-tooltip': 'undo',
              'data-tooltip-position': 'top',
              'data-tooltip-position-selector':'.toolbar-container'
            }
          }
    }
  ],
    references:{} }
  }
}

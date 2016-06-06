import React from 'react'
import ReactDOM from 'react-dom'
import {
  AtomicBlockUtils,
  Editor,
  EditorState,
  Entity,
  Modifier,
  SelectionState
} from 'draft-js'

class MyEditor extends React.Component {
  constructor(props) {
    super(props)
    this.state = {editorState: EditorState.createEmpty()}
    this.onChange = (editorState) => this.setState({editorState})
    this.addImage = this._addImage.bind(this);
    this.removeImage = this.removeImage.bind(this)
  }


  _addMedia(type) {
    const src = 'https://facebook.github.io/react/img/logo.svg'
    const entityKey = Entity.create(type, 'IMMUTABLE', {src});
    return AtomicBlockUtils.insertAtomicBlock(
      this.state.editorState,
      entityKey,
      ' '
    );
  }

  _addImage() {
    this.onChange(this._addMedia('image'))
  }

  removeImage(blockKey) {
    this.onChange(this._removeImage(blockKey))
  }

  _removeImage(blockKey) {
    const editorState = this.state.editorState
    const content = editorState.getCurrentContent();
    const block = content.getBlockForKey(blockKey);

    const targetRange = new SelectionState({
      anchorKey: blockKey,
      anchorOffset: 0,
      focusKey: blockKey,
      focusOffset: block.getLength(),
    });

    const withoutTeX = Modifier.removeRange(content, targetRange, 'backward');
    const resetBlock = Modifier.setBlockType(
      withoutTeX,
      withoutTeX.getSelectionAfter(),
      'unstyled'
    );

    const newState = EditorState.push(editorState, resetBlock, 'remove-range');
    return EditorState.forceSelection(newState, resetBlock.getSelectionAfter());
  }

  mediaBlockRenderer(block) {
    if (block.getType() === 'atomic') {
      return {
        component: Media,
        editable: false,
        props: {
          removeImage: (blockKey) => {
            this.removeImage(blockKey)
          }
        }
      };
    }
    return null;
  }


  render() {
    const {editorState} = this.state
    return (
      <div>
        <Editor
            blockRendererFn={this.mediaBlockRenderer.bind(this)}
            editorState={editorState}
            onChange={this.onChange}
        />
        <button onClick={this.addImage}>add</button>
      </div>
    )
  }
}

ReactDOM.render(
  <MyEditor />,
  document.getElementById('container')
)

class Media extends React.Component {
  remove() {
    this.props.blockProps.removeImage(this.props.block.getKey())
  }

  render() {
    const entity = Entity.get(this.props.block.getEntityAt(0));
    const {src} = entity.getData();
    return (
      <div>
        <img src={src}/>
        <button onClick={this.remove.bind(this)}>remove</button>
      </div>
    )
  }
}

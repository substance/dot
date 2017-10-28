import {
  ProseEditorPackage, EditorSession,
  Configurator
} from 'substance'

window.onload = () => {
  let configurator = new Configurator()
  configurator.import(ProseEditorPackage)
  let importer = configurator.createImporter('html')
  let doc = importer.importDocument('<p>Hello world!</p>')
  let editorSession = new EditorSession(doc, { configurator })
  let onDocumentChange = function(change) {
    console.log(JSON.stringify(change.toJSON()))
  }
  ProseEditorPackage.ProseEditor.mount({ editorSession }, window.document.body)
  editorSession.onUpdate('document', onDocumentChange, this, {
    resource: 'document'
  })
}

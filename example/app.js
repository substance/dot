import {
  ProseEditorPackage, EditorSession,
  Configurator
} from 'substance'

import { serializeChange } from 'substance-dot'

window.onload = () => {
  let configurator = new Configurator()
  configurator.import(ProseEditorPackage)
  let importer = configurator.createImporter('html')
  let doc = importer.importDocument('<p id="p-1">Hello world!</p>')
  let editorSession = new EditorSession(doc, { configurator })
  ProseEditorPackage.ProseEditor.mount({ editorSession }, window.document.body)
  editorSession.onUpdate('document', (change) => {
    console.log(serializeChange(change))
  })
}

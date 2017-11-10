import { EditorSession } from 'substance'
import { ProsePlugin } from 'substance-dot'

window.onload = () => {
  const plugin = ProsePlugin
  let doc = plugin.import(plugin.seed)
  let editorSession = new EditorSession(doc, { configurator: plugin })
  plugin.Editor.mount({ editorSession }, window.document.body)
}

import {
  ProseEditorPackage, EditorSession, Configurator, HTMLExporter
} from 'substance'

// TODO: this should go into ProseEditorPackage
class ProseHTMLExporter extends HTMLExporter {

  convertDocument(doc) {
    let el = this.createElement('div')
    el.append(
      this.convertContainer(doc.get('body'))
    )
    return el
  }

}

let configurator = new Configurator()
configurator.import(ProseEditorPackage)
configurator.addExporter('html', ProseHTMLExporter)

export default {
  import: function(seed) {
    let importer = configurator.createImporter('html')
    return importer.importDocument(seed)
  },
  export: function(doc) {
    let exporter = configurator.createExporter('html')
    let dom = exporter.exportDocument(doc)
    return dom.serialize()
  },
  seed: '<p data-id="p1"></p>',
  Editor: ProseEditorPackage.ProseEditor,
  configurator: configurator,
}

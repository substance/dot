module.exports = [
  {
    version: 0,
    changes: [
      // create a document record
      {
        type: 'create',
        data: {
          uuid: 'ABC',
          type: 'document',
          schemaName: 'Prose',
          schemaVersion: '1',
          location: 'document.html',
          serialization: 'HTML',
          version: 0
        },
        user: 'A'
      },
      // initial changes leading to an empty doc
      {
        type: 'update',
        resource: 'ABC',
        data: {
          version: 1,
          ops: [
            'c { id: "body", type: "container" }'
          ]
        }
      }
    ]
  },
  {
    version: 1,
    changes: [
      // changes leading to 'Hello World'
      {
        type: 'update',
        resource: 'ABC',
        data: {
          version: 2,
          ops: [
            // ... document changes
            'c { id: "h1", type: "heading", level: 1, content: "Hello World"}',
            'c { id: "p1", type: "paragraph", content: "The quick brown fox jumps over the lazy dog."}',
            'u body.nodes a+ 0 h1',
            'u body.nodes a+ 1 p1'
          ]
        }
      }
    ]
  },
  {
    version: 2,
    changes: [
      // changes leading to 'Hello World'
      {
        type: 'update',
        resource: 'ABC',
        data: {
          version: 3,
          ops: [
            'u p1.content t+ 4 little ',
          ]
        }
      }
    ]
  }
]

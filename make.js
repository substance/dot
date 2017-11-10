let b = require('substance-bundler')

b.rm('dist')

/* Lib */
b.js('index.js', {
  targets: [{
    dest: 'dist/substance-dot.js',
    format: 'umd',
    moduleName: 'substanceDot'
  }, {
    dest: 'dist/substance-dot.cjs.js',
    format: 'cjs'
  }],
  external: ['substance'],
  globals: {
    substance: 'window.substance'
  }
})

/* Example */
b.js('example/app.js', {
  target: {
    dest: 'tmp/app.js',
    format: 'umd',
    moduleName: 'dotExample'
  },
  external: ['substance', 'substance-dot'],
  globals: {
    'substance': 'window.substance',
    'substance-dot': 'window.substanceDot'
  }
})
b.css('example/app.css', 'tmp/app.css', { variables: true })

/* Editor */
b.copy('node_modules/substance/dist', './dist/substance')
b.copy('node_modules/font-awesome', './dist/font-awesome')
b.copy('editor/index.html', 'dist/editor/')
b.copy('editor/main.js', 'dist/editor/')
b.copy('editor/package.json.in', 'dist/editor/package.json')
b.css('editor/editor.css', 'dist/editor/editor.css', { variables: true })
b.js('editor/editor.js', {
  target: {
    dest: 'dist/editor/editor.js',
    format: 'umd',
    moduleName: 'editor'
  },
  external: ['substance', 'substance-dot'],
  globals: {
    'substance': 'window.substance',
    'substance-dot': 'window.substanceDot'
  }
})

/* Tests */
b.js('test/**/*.test.js', {
  dest: 'tmp/tests.js',
  format: 'umd', moduleName: 'tests',
  external: {
    'substance': 'window.substance',
    'substance-test': 'window.substanceTest',
    'substance-dot': 'window.substanceDot'
  },
})

b.setServerPort(4002)
b.serve({ static: true, route: '/', folder: '.' })

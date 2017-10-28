let b = require('substance-bundler')

b.js('index.js', {
  target: {
    dest: 'dist/substance-dot.js',
    format: 'umd',
    moduleName: 'substanceDot'
  },
  external: ['substance'],
  globals: {
    substance: 'window.substance'
  }
})

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

b.js('test/**/*.test.js', {
  dest: 'tmp/tests.js',
  format: 'umd', moduleName: 'tests',
  external: {
    'substance': 'window.substance',
    'substance-test': 'window.substanceTest'
  },
})

b.setServerPort(4002)
b.serve({ static: true, route: '/', folder: '.' })

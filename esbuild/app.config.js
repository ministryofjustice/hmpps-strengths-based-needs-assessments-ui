const { copy } = require('esbuild-plugin-copy')
const esbuild = require('esbuild')
const glob = require('glob')
const pkg = require('../package.json')
const { spawn } = require("child_process");

const buildApp = buildConfig => {
  const build = () => esbuild.build({
    entryPoints: glob.sync(buildConfig.app.entryPoints),
    outdir: buildConfig.app.outDir,
    bundle: true,
    sourcemap: buildConfig.sourcemap,
    platform: 'node',
    format: 'cjs',
    external: [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})],
    plugins: [
      copy({
        resolveFrom: 'cwd',
        assets: buildConfig.app.copy,
      }),
    ],
  })

  return new Promise((resolve, reject) => {
    const typecheck = spawn('npx tsc --noEmit', { stdio: 'pipe', shell: true })
    const log = (data) => { console.log(data.toString()) }
    typecheck.stdout.on('data', log)
    typecheck.stderr.on('data', log)
    typecheck.on('exit', (code) => code !== 0 ? reject(`Type check failed.`) : build().then(resolve))
  })
}

module.exports = buildConfig => {
  console.log('\u{1b}[1m\u{2728}  Building app...\u{1b}[0m')

  return buildApp(buildConfig)
}

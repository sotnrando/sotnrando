// This is a generated file. Do not edit it directly.
// Make your changes to presets/safe.json then rebuild
// this file with `npm run build-presets -- safe`.
(function(self) {

  // Boilerplate.
  let util
  if (self) {
    util = self.sotnRando.util
  } else {
    util = require('../../src/util')
  }
  const PresetBuilder = util.PresetBuilder

  // Create PresetBuilder.
  const builder = PresetBuilder.fromJSON({"metadata":{"id":"safe","name":"Safe","description":"A source preset for the Randomizer. Meant to mimic the complexity of the original game by having nine layers of complexity. Requires no speedrun or glitch knowledge for completion.","author":["3snow_p7im","setz","soba"],"weight":-2150,"knowledgeCheck":"None","metaExtension":"Guarded","metaComplexity":"9","itemStats":"Randomized","timeFrame":"Normal","moddedLevel":"None","castleType":"Normal","transformEarly":"No","transformFocus":"None","winCondition":"Normal"},"inherits":"casual","complexityGoal":{"min":9,"goals":["Holy glasses + Heart of Vlad + Tooth of Vlad + Rib of Vlad + Ring of Vlad + Eye of Vlad"]}})

  // Export.
  const preset = builder.build()

  if (self) {
    const presets = (self.sotnRando || {}).presets || []
    presets.push(preset)
    self.sotnRando = Object.assign(self.sotnRando || {}, {
      presets: presets,
    })
  } else if (!module.parent) {
    console.log(preset.toString())
  } else {
    module.exports = preset
  }
})(typeof(self) !== 'undefined' ? self : null)

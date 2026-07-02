// This is a generated file. Do not edit it directly.
// Make your changes to presets/safe-stwo.json then rebuild
// this file with `npm run build-presets -- safe-stwo`.
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
  const builder = PresetBuilder.fromJSON({"metadata":{"id":"safe-stwo","name":"Safe Season 2","description":"A popular variant that emulates how Safe felt in Season 2. Requires no speedrun or glitch knowledge for completion.","author":["3snow_p7im","setz","soba"],"weight":-2175,"knowledgeCheck":"None","metaExtension":"Guarded","metaComplexity":"8","itemStats":"Normal","timeFrame":"Normal","moddedLevel":"None","castleType":"Normal","transformEarly":"No","transformFocus":"None","winCondition":"Normal","defaultGoal":"default","compatibleGoals":["default","b","r","a","v"],"listSortFlag":["Evergreen"]},"inherits":"casual","stats":false,"complexityGoal":{"min":8,"goals":["Holy glasses + Heart of Vlad + Tooth of Vlad + Rib of Vlad + Ring of Vlad + Eye of Vlad"]}})

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

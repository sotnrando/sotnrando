// This is a generated file. Do not edit it directly.
// Make your changes to presets/grand-tour.json then rebuild
// this file with `npm run build-presets -- grand-tour`.
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
  const builder = PresetBuilder.fromJSON({"metadata":{"id":"grand-tour","name":"Grand Tour","description":"To be discontinued in the near future. Meant for players who want to see more unique locations of the castle.","author":["eldri7ch","MottZilla"],"weight":-2450,"knowledgeCheck":"None","metaExtension":"Scenic","metaComplexity":"8","itemStats":"Normal","timeFrame":"Slow","moddedLevel":"None","castleType":"Normal","transformEarly":"No","transformFocus":"None","winCondition":"Normal"},"inherits":"casual","relicLocationsExtension":"scenic","music":false,"complexityGoal":{"min":8,"goals":["Holy glasses + Heart of Vlad + Tooth of Vlad + Rib of Vlad + Ring of Vlad + Eye of Vlad"]}})

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

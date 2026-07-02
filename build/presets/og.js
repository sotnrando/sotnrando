// This is a generated file. Do not edit it directly.
// Make your changes to presets/og.json then rebuild
// this file with `npm run build-presets -- og`.
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
  const builder = PresetBuilder.fromJSON({"metadata":{"id":"og","name":"O.G.","description":"The first Randomizer preset. Only randomizes relic locations and item locations. Soul of Bat, Form of Mist and Jewel of Open are guaranteed to be in first castle.","author":["3snow_p7im"],"weight":-2250,"knowledgeCheck":"None","metaExtension":"Classic","metaComplexity":"1","itemStats":"Normal","timeFrame":"Fast","moddedLevel":"None","castleType":"Normal","transformEarly":"No","transformFocus":"None","winCondition":"Normal","defaultGoal":"default","compatibleGoals":["default","b","r","a","v"],"listSortFlag":["Evergreen"]},"inherits":"casual","relicLocationsExtension":false,"preventLeaks":false,"stats":false,"music":false,"placeRelic":[{"location":"Silver ring","relic":"Silver ring"},{"location":"Gold ring","relic":"Gold ring"},{"location":"Holy glasses","relic":"Holy glasses"},{"location":"Spike Breaker","relic":"Spike Breaker"}]})

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

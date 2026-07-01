// This is a generated file. Do not edit it directly.
// Make your changes to presets/guarded-og.json then rebuild
// this file with `npm run build-presets -- guarded-og`.
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
  const builder = PresetBuilder.fromJSON({"metadata":{"id":"guarded-og","name":"Guarded O.G.","description":"The best preset for trying out the SOTN Randomizer. Utilizes our 'guarded' relic locations but Gold ring, Silver ring, Holy glasses and Spike Breaker are in the same locations as the original game.  Soul of Bat, Form of Mist and Jewel of Open are guaranteed to be in first castle. You can find more details on the 'guarded' checks at https://symphonyrando.fun/locations","author":["TalicZealot"],"weight":-2425,"knowledgeCheck":"None","metaExtension":"Guarded","metaComplexity":"1","itemStats":"Normal","timeFrame":"Fast","moddedLevel":"None","castleType":"Normal","transformEarly":"No","transformFocus":"None","winCondition":"Normal","listSortFlag":["Evergreen"]},"inherits":"casual","preventLeaks":false,"stats":false,"music":false,"placeRelic":[{"location":"Silver ring","relic":"Silver ring"},{"location":"Gold ring","relic":"Gold ring"},{"location":"Holy glasses","relic":"Holy glasses"},{"location":"Spike Breaker","relic":"Spike Breaker"}]})

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

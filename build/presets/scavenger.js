// This is a generated file. Do not edit it directly.
// Make your changes to presets/scavenger.json then rebuild
// this file with `npm run build-presets -- scavenger`.
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
  const builder = PresetBuilder.fromJSON({"metadata":{"id":"scavenger","name":"Scavenger","description":"No enemy drops. Equipment must be found in item locations throughout the map.","author":["3snow_p7im"],"weight":-2125,"knowledgeCheck":"None","metaExtension":"Guarded","metaComplexity":"9","itemStats":"Randomized","timeFrame":"Slow","moddedLevel":"None","castleType":"Normal","transformEarly":"No","transformFocus":"None","winCondition":"Normal"},"inherits":"safe","placeRelic":[{"location":"Jewel of Open","relic":["Fire of Bat","Force of Echo","Power of Wolf","Skill of Wolf","Gas Cloud","Cube of Zoe","Spirit Orb","Holy Symbol","Faerie Scroll","Bat Card","Ghost Card","Faerie Card","Demon Card","Sword Card","Sprite Card","Nosedevil Card",null]}],"enemyDrops":[{"enemy":"*","items":[null,null]},{"enemy":"Global","items":["Heart","Heart","Heart","Heart","Heart","Heart","Heart","Heart","Heart","Heart","Heart","Heart","Heart","Heart","Heart","Heart","Heart","Heart","Heart","Heart","Heart","Heart","Heart","Heart","Heart","Heart","Heart","Heart","Heart","Heart","Heart","Heart"]}]})

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

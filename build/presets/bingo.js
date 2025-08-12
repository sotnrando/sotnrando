// This is a generated file. Do not edit it directly.
// Make your changes to presets/bingo.json then rebuild
// this file with `npm run build-presets -- bingo`.
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
  const builder = PresetBuilder.fromJSON({"metadata":{"id":"bingo","name":"Bingo","description":"Bot-only preset. Created for the 2024 Bingo Tournament. Does not randomize relics but randomizes items.","author":["Dr4gonBlitz","eldri7ch"],"weight":-3975,"knowledgeCheck":"Varies","metaExtension":"Guarded","metaComplexity":"1","itemStats":"Normal","timeFrame":"Slow","moddedLevel":"Slightly","castleType":"Normal","transformEarly":"No","transformFocus":"None","winCondition":"Meet Bingo Conditions"},"relicLocationsExtension":false,"preventLeaks":false,"stats":false,"music":false,"turkeyMode":false,"placeRelic":[{"location":"Soul of Bat","relic":"Soul of Bat"},{"location":"Echo of Bat","relic":"Echo of Bat"},{"location":"Force of Echo","relic":"Force of Echo"},{"location":"Fire of Bat","relic":"Fire of Bat"},{"location":"Soul of Wolf","relic":"Soul of Wolf"},{"location":"Power of Wolf","relic":"Power of Wolf"},{"location":"Skill of Wolf","relic":"Skill of Wolf"},{"location":"Form of Mist","relic":"Form of Mist"},{"location":"Power of Mist","relic":"Power of Mist"},{"location":"Gas Cloud","relic":"Gas Cloud"},{"location":"Cube of Zoe","relic":"Cube of Zoe"},{"location":"Spirit Orb","relic":"Spirit Orb"},{"location":"Faerie Scroll","relic":"Faerie Scroll"},{"location":"Holy Symbol","relic":"Holy Symbol"},{"location":"Gravity Boots","relic":"Gravity Boots"},{"location":"Leap Stone","relic":"Leap Stone"},{"location":"Jewel of Open","relic":"Jewel of Open"},{"location":"Merman Statue","relic":"Merman Statue"},{"location":"Ghost Card","relic":"Ghost Card"},{"location":"Bat Card","relic":"Bat Card"},{"location":"Faerie Card","relic":"Faerie Card"},{"location":"Demon Card","relic":"Demon Card"},{"location":"Sword Card","relic":"Sword Card"},{"location":"Silver ring","relic":"Silver ring"},{"location":"Gold ring","relic":"Gold ring"},{"location":"Holy glasses","relic":"Holy glasses"},{"location":"Spike Breaker","relic":"Spike Breaker"},{"location":"Tooth of Vlad","relic":"Tooth of Vlad"},{"location":"Eye of Vlad","relic":"Eye of Vlad"},{"location":"Ring of Vlad","relic":"Ring of Vlad"},{"location":"Heart of Vlad","relic":"Heart of Vlad"},{"location":"Rib of Vlad","relic":"Rib of Vlad"}],"replaceRelic":[{"relic":"Sprite Card","item":"Turkey"},{"relic":"Nosedevil Card","item":"Harper"}],"blockDrops":[{"enemy":"*","items":["Duplicator","Library card"]}],"writes":[{"comment":"Jump to injected code","address":"0x000fa97c","type":"word","value":"0x0c04db00"},{"address":"0x00158c98","comment":"Save Return Address for rA (Armor Code)","type":"word","value":"0x37F70000"},{"comment":"Give Holy glasses","type":"word","value":"0x34040022"},{"type":"word","value":"0x34050001"},{"type":"word","value":"0x0C03F61D"},{"type":"word","value":"0x00000000"},{"comment":"Recall Return Address for rA (Armor Code)","type":"word","value":"0x36FF0000"},{"type":"word","value":"0x00000000","comment":"nop"},{"comment":"j 0x800e493c","type":"word","value":"0x0803924f"},{"type":"word","value":"0x00000000","comment":"nop"},{"comment":"Require Different Buttons","type":"word","address":"0x53765DC","value":"0x3C028009"},{"type":"word","value":"0x94427490"},{"type":"word","address":"0x53765E8","value":"0x34040101"},{"type":"word","value":"0x1444000D"},{"type":"word","address":"0x5376618","value":"0x18000002"}]})

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

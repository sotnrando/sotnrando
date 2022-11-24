// This is a generated file. Do not edit it directly.
// Make your changes to presets/nimble.json then rebuild
// this file with `npm run build-presets -- nimble`.
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
  const builder = PresetBuilder.fromJSON({"metadata":{"id":"nimble","name":"Nimble","description":"Start with Soul of Bat, Leap Stone, Gravity Boots, Duplicator, Manna prism, and Buffalo star.","author":"3snow_p7im","weight":-200},"stats":false,"startingEquipment":[{"slot":"Right hand","item":"Manna prism"},{"slot":"Left hand","item":"Buffalo star"},{"slot":"Head","item":"Dragon helm"},{"slot":"Body","item":"Alucard mail"},{"slot":"Cloak","item":"Twilight cloak"},{"slot":"Other","item":"Duplicator"}],"lockLocation":[{"location":"Soul of Bat","comment":"Requires Mist","locks":["Form of Mist"]},{"location":"Force of Echo","comment":"In second castle","locks":["Holy glasses"]},{"location":"Gas Cloud","comment":"In second castle","locks":["Holy glasses"]},{"location":"Holy Symbol","locks":["Jewel of Open + Merman Statue"]},{"location":"Merman Statue","locks":["Jewel of Open"]},{"location":"Demon Card","locks":["Jewel of Open"]},{"location":"Heart of Vlad","comment":"In second castle","locks":["Holy glasses"]},{"location":"Tooth of Vlad","comment":"In second castle","locks":["Holy glasses"]},{"location":"Rib of Vlad","comment":"In second castle","locks":["Holy glasses"]},{"location":"Ring of Vlad","comment":"In second castle","locks":["Holy glasses"]},{"location":"Eye of Vlad","comment":"In second castle","locks":["Holy glasses"]},{"location":"Spike Breaker","locks":["Jewel of Open + Echo of Bat"]},{"location":"Gold ring","locks":["Jewel of Open"]},{"location":"Silver ring","locks":["Jewel of Open + Spike Breaker + Form of Mist"]},{"location":"Holy glasses","locks":["Silver ring + Gold ring"]},{"location":"Crystal cloak","locks":["Jewel of Open"]},{"location":"Mormegil","locks":["Jewel of Open"]},{"location":"Dark Blade","locks":["Holy glasses"]},{"location":"Ring of Arcana","locks":["Holy glasses"]},{"location":"Trio","locks":["Holy glasses"]},{"location":"Jewel sword","locks":["Soul of Wolf"]},{"location":"Alucart sword","locks":["Cube of Zoe"]},{"location":"Bandanna","locks":["Jewel of Open"]},{"location":"Secret boots","locks":["Jewel of Open"]},{"location":"Nunchaku","locks":["Jewel of Open + Holy Symbol"]},{"location":"Knuckle duster","locks":["Jewel of Open"]},{"location":"Caverns Onyx","locks":["Jewel of Open"]},{"location":"Combat knife","locks":["Jewel of Open"]},{"location":"Ring of Ares","locks":["Jewel of Open + Demon Card","Jewel of Open + Nosedevil Card"]},{"location":"Bloodstone","locks":["Jewel of Open"]},{"location":"Icebrand","locks":["Jewel of Open"]},{"location":"Walk armor","locks":["Jewel of Open"]},{"location":"Beryl circlet","locks":["Holy glasses + Soul of Wolf"]},{"location":"Talisman","locks":["Holy glasses"]},{"location":"Katana","locks":["Holy glasses"]},{"location":"Goddess shield","locks":["Holy glasses"]},{"location":"Twilight cloak","locks":["Holy glasses + Form of Mist"]},{"location":"Talwar","locks":["Holy glasses"]},{"location":"Sword of Dawn","locks":["Holy glasses"]},{"location":"Bastard sword","locks":["Holy glasses"]},{"location":"Royal cloak","locks":["Holy glasses"]},{"location":"Lightning mail","locks":["Holy glasses"]},{"location":"Moon rod","locks":["Holy glasses"]},{"location":"Sunstone","locks":["Holy glasses"]},{"location":"Luminus","locks":["Holy glasses"]},{"location":"Dragon helm","locks":["Holy glasses"]},{"location":"Shotel","locks":["Holy glasses + Form of Mist"]},{"location":"Staurolite","locks":["Holy glasses + Form of Mist"]},{"location":"Badelaire","locks":["Holy glasses"]},{"location":"Forbidden Library Opal","locks":["Holy glasses"]},{"location":"Reverse Caverns Diamond","locks":["Holy glasses"]},{"location":"Reverse Caverns Opal","locks":["Holy glasses"]},{"location":"Reverse Caverns Garnet","locks":["Holy glasses"]},{"location":"Osafune katana","locks":["Holy glasses"]},{"location":"Alucard shield","locks":["Holy glasses"]},{"location":"Alucard sword","locks":["Holy glasses"]},{"location":"Necklace of J","locks":["Holy glasses"]},{"location":"Floating Catacombs Diamond","locks":["Holy glasses"]},{"location":"Sword of Hador","locks":["Holy glasses"]},{"location":"Alucard mail","locks":["Holy glasses"]},{"location":"Gram","locks":["Holy glasses"]},{"location":"Fury plate","locks":["Holy glasses"]}],"complexityGoal":{"min":6,"goals":["Holy glasses + Heart of Vlad + Tooth of Vlad + Rib of Vlad + Ring of Vlad + Eye of Vlad"]},"writes":[{"comment":"Jump to injected code","address":"0x000fa97c","type":"word","value":"0x0c04db00"},{"address":"0x00158c98","type":"word","value":"0x34020003","comment":"ori v0, 0x0003"},{"type":"word","value":"0x3c038009","comment":"lui v1, 0x8009"},{"comment":"sb v0, 0x7964 (v1)","type":"word","value":"0xa0627964"},{"comment":"sb v0, 0x7970 (v1)","type":"word","value":"0xa0627970"},{"comment":"sb v0, 0x7971 (v1)","type":"word","value":"0xa0627971"},{"comment":"j 0x800e493c","type":"word","value":"0x0803924f"},{"type":"word","value":"0x00000000","comment":"nop"}]})

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

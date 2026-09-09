const fs = require('fs');
let schema = fs.readFileSync('src/db/schema.ts', 'utf8');

// Add pembelianId to sppgUjiRapidTest
const insertUji = 'parameterUjiId: integer("parameter_uji_id").references(() => masterParameterUji.id),\n  pembelianId: integer("pembelian_id").references(() => sppgPembelianBahan.id),';
schema = schema.replace('parameterUjiId: integer("parameter_uji_id").references(() => masterParameterUji.id),', insertUji);

// Add relation
const relationUji = `  parameterMaster: one(masterParameterUji, {
    fields: [sppgUjiRapidTest.parameterUjiId],
    references: [masterParameterUji.id],
  }),
  pembelian: one(sppgPembelianBahan, {
    fields: [sppgUjiRapidTest.pembelianId],
    references: [sppgPembelianBahan.id],
  }),`;
schema = schema.replace(`  parameterMaster: one(masterParameterUji, {
    fields: [sppgUjiRapidTest.parameterUjiId],
    references: [masterParameterUji.id],
  }),`, relationUji);

fs.writeFileSync('src/db/schema.ts', schema);

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Beispiel: Löschen und Einfügen von Daten
  await knex('theme_rooms').del();
  await knex('theme_rooms').insert([
    { name: 'Room 1', description: 'Beschreibung 1' },
    { name: 'Room 2', description: 'Beschreibung 2' }
  ]);
}

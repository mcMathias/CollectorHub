import { PrismaClient, FieldType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ── Collection Types with Custom Field Definitions ──

  const lego = await prisma.collectionType.upsert({
    where: { slug: 'lego' },
    update: {},
    create: {
      name: 'LEGO',
      slug: 'lego',
      description: 'LEGO sets and minifigures',
      icon: '🧱',
      color: '#FFD700',
      isSystem: true,
      fieldDefinitions: {
        create: [
          { name: 'Set Number', slug: 'set-number', fieldType: FieldType.TEXT, sortOrder: 1 },
          { name: 'Theme', slug: 'theme', fieldType: FieldType.TEXT, sortOrder: 2 },
          { name: 'Pieces', slug: 'pieces', fieldType: FieldType.NUMBER, sortOrder: 3 },
          { name: 'Minifigures', slug: 'minifigures', fieldType: FieldType.NUMBER, sortOrder: 4 },
          { name: 'Year Released', slug: 'year-released', fieldType: FieldType.NUMBER, sortOrder: 5 },
          { name: 'Retired', slug: 'retired', fieldType: FieldType.BOOLEAN, sortOrder: 6 },
        ],
      },
    },
  });

  const pokemon = await prisma.collectionType.upsert({
    where: { slug: 'pokemon-cards' },
    update: {},
    create: {
      name: 'Pokémon Cards',
      slug: 'pokemon-cards',
      description: 'Pokémon Trading Card Game',
      icon: '⚡',
      color: '#FFCB05',
      isSystem: true,
      fieldDefinitions: {
        create: [
          { name: 'Card Number', slug: 'card-number', fieldType: FieldType.TEXT, sortOrder: 1 },
          { name: 'Set', slug: 'set', fieldType: FieldType.TEXT, sortOrder: 2 },
          { name: 'Rarity', slug: 'rarity', fieldType: FieldType.SELECT, options: ['Common', 'Uncommon', 'Rare', 'Ultra Rare', 'Secret Rare'], sortOrder: 3 },
          { name: 'Grade', slug: 'grade', fieldType: FieldType.TEXT, sortOrder: 4 },
          { name: 'Language', slug: 'language', fieldType: FieldType.SELECT, options: ['English', 'Japanese', 'Korean', 'Chinese', 'French', 'German', 'Italian', 'Spanish', 'Portuguese'], sortOrder: 5 },
          { name: 'First Edition', slug: 'first-edition', fieldType: FieldType.BOOLEAN, sortOrder: 6 },
          { name: 'Holographic', slug: 'holographic', fieldType: FieldType.BOOLEAN, sortOrder: 7 },
        ],
      },
    },
  });

  const mtg = await prisma.collectionType.upsert({
    where: { slug: 'magic-the-gathering' },
    update: {},
    create: {
      name: 'Magic: The Gathering',
      slug: 'magic-the-gathering',
      description: 'MTG trading cards',
      icon: '🃏',
      color: '#8B4513',
      isSystem: true,
      fieldDefinitions: {
        create: [
          { name: 'Set', slug: 'set', fieldType: FieldType.TEXT, sortOrder: 1 },
          { name: 'Card Number', slug: 'card-number', fieldType: FieldType.TEXT, sortOrder: 2 },
          { name: 'Rarity', slug: 'rarity', fieldType: FieldType.SELECT, options: ['Common', 'Uncommon', 'Rare', 'Mythic Rare'], sortOrder: 3 },
          { name: 'Foil', slug: 'foil', fieldType: FieldType.BOOLEAN, sortOrder: 4 },
          { name: 'Language', slug: 'language', fieldType: FieldType.TEXT, sortOrder: 5 },
          { name: 'Grade', slug: 'grade', fieldType: FieldType.TEXT, sortOrder: 6 },
        ],
      },
    },
  });

  const funkoPop = await prisma.collectionType.upsert({
    where: { slug: 'funko-pop' },
    update: {},
    create: {
      name: 'Funko Pop',
      slug: 'funko-pop',
      description: 'Funko Pop vinyl figures',
      icon: '🎭',
      color: '#00B2FF',
      isSystem: true,
      fieldDefinitions: {
        create: [
          { name: 'Number', slug: 'number', fieldType: FieldType.TEXT, sortOrder: 1 },
          { name: 'Series', slug: 'series', fieldType: FieldType.TEXT, sortOrder: 2 },
          { name: 'Exclusive', slug: 'exclusive', fieldType: FieldType.TEXT, sortOrder: 3 },
          { name: 'Vaulted', slug: 'vaulted', fieldType: FieldType.BOOLEAN, sortOrder: 4 },
          { name: 'Chase', slug: 'chase', fieldType: FieldType.BOOLEAN, sortOrder: 5 },
          { name: 'Glow in the Dark', slug: 'glow-in-the-dark', fieldType: FieldType.BOOLEAN, sortOrder: 6 },
        ],
      },
    },
  });

  const hotWheels = await prisma.collectionType.upsert({
    where: { slug: 'hot-wheels' },
    update: {},
    create: {
      name: 'Hot Wheels',
      slug: 'hot-wheels',
      description: 'Hot Wheels diecast cars',
      icon: '🏎️',
      color: '#FF4500',
      isSystem: true,
      fieldDefinitions: {
        create: [
          { name: 'Scale', slug: 'scale', fieldType: FieldType.SELECT, options: ['1:64', '1:43', '1:24', '1:18'], sortOrder: 1 },
          { name: 'Series', slug: 'series', fieldType: FieldType.TEXT, sortOrder: 2 },
          { name: 'Color', slug: 'color', fieldType: FieldType.COLOR, sortOrder: 3 },
          { name: 'Treasure Hunt', slug: 'treasure-hunt', fieldType: FieldType.BOOLEAN, sortOrder: 4 },
          { name: 'Year', slug: 'year', fieldType: FieldType.NUMBER, sortOrder: 5 },
        ],
      },
    },
  });

  const videoGames = await prisma.collectionType.upsert({
    where: { slug: 'video-games' },
    update: {},
    create: {
      name: 'Video Games',
      slug: 'video-games',
      description: 'Video games for all platforms',
      icon: '🎮',
      color: '#9B59B6',
      isSystem: true,
      fieldDefinitions: {
        create: [
          { name: 'Platform', slug: 'platform', fieldType: FieldType.SELECT, options: ['PC', 'PlayStation 5', 'PlayStation 4', 'Xbox Series X', 'Xbox One', 'Nintendo Switch', 'Retro'], sortOrder: 1 },
          { name: 'Genre', slug: 'genre', fieldType: FieldType.TEXT, sortOrder: 2 },
          { name: 'Region', slug: 'region', fieldType: FieldType.SELECT, options: ['NTSC-U', 'PAL', 'NTSC-J', 'Region Free'], sortOrder: 3 },
          { name: 'CIB', slug: 'cib', fieldType: FieldType.BOOLEAN, sortOrder: 4 },
          { name: 'Sealed', slug: 'sealed', fieldType: FieldType.BOOLEAN, sortOrder: 5 },
        ],
      },
    },
  });

  const watches = await prisma.collectionType.upsert({
    where: { slug: 'watches' },
    update: {},
    create: {
      name: 'Watches',
      slug: 'watches',
      description: 'Luxury and collectible watches',
      icon: '⌚',
      color: '#C0C0C0',
      isSystem: true,
      fieldDefinitions: {
        create: [
          { name: 'Reference Number', slug: 'reference-number', fieldType: FieldType.TEXT, sortOrder: 1 },
          { name: 'Movement', slug: 'movement', fieldType: FieldType.SELECT, options: ['Automatic', 'Manual', 'Quartz', 'Solar'], sortOrder: 2 },
          { name: 'Case Size', slug: 'case-size', fieldType: FieldType.TEXT, sortOrder: 3 },
          { name: 'Material', slug: 'material', fieldType: FieldType.SELECT, options: ['Steel', 'Gold', 'Titanium', 'Ceramic', 'Platinum'], sortOrder: 4 },
          { name: 'Year', slug: 'year', fieldType: FieldType.NUMBER, sortOrder: 5 },
          { name: 'Box & Papers', slug: 'box-papers', fieldType: FieldType.BOOLEAN, sortOrder: 6 },
        ],
      },
    },
  });

  const coins = await prisma.collectionType.upsert({
    where: { slug: 'coins' },
    update: {},
    create: {
      name: 'Coins',
      slug: 'coins',
      description: 'Numismatic coins and currency',
      icon: '🪙',
      color: '#DAA520',
      isSystem: true,
      fieldDefinitions: {
        create: [
          { name: 'Country', slug: 'country', fieldType: FieldType.TEXT, sortOrder: 1 },
          { name: 'Year', slug: 'year', fieldType: FieldType.NUMBER, sortOrder: 2 },
          { name: 'Denomination', slug: 'denomination', fieldType: FieldType.TEXT, sortOrder: 3 },
          { name: 'Metal', slug: 'metal', fieldType: FieldType.SELECT, options: ['Gold', 'Silver', 'Copper', 'Bronze', 'Nickel', 'Platinum'], sortOrder: 4 },
          { name: 'Grade', slug: 'grade', fieldType: FieldType.TEXT, sortOrder: 5 },
          { name: 'Mint Mark', slug: 'mint-mark', fieldType: FieldType.TEXT, sortOrder: 6 },
        ],
      },
    },
  });

  const custom = await prisma.collectionType.upsert({
    where: { slug: 'custom' },
    update: {},
    create: {
      name: 'Custom',
      slug: 'custom',
      description: 'Create your own collection type with custom fields',
      icon: '✨',
      color: '#6C63FF',
      isSystem: true,
      fieldDefinitions: { create: [] },
    },
  });

  console.log('✅ Seeded collection types:', {
    lego: lego.id,
    pokemon: pokemon.id,
    mtg: mtg.id,
    funkoPop: funkoPop.id,
    hotWheels: hotWheels.id,
    videoGames: videoGames.id,
    watches: watches.id,
    coins: coins.id,
    custom: custom.id,
  });

  // ── Currencies ──

  const currencies = [
    { code: 'DKK', name: 'Danish Krone', symbol: 'kr' },
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'SEK', name: 'Swedish Krona', symbol: 'kr' },
    { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
    { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  ];

  for (const currency of currencies) {
    await prisma.currency.upsert({
      where: { code: currency.code },
      update: {},
      create: currency,
    });
  }

  console.log('✅ Seeded currencies:', currencies.map((c) => c.code).join(', '));

  console.log('🎉 Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

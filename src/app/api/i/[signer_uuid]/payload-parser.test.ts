import { describe, it, expect } from 'vitest';
import { getSocialPostTextFromDinkPayload } from './payload-parser';

describe('getSocialPostTextFromDinkPayload', () => {
  it('handles DEATH (PvP)', () => {
    const payload = {
      type: 'DEATH',
      playerName: 'Alice',
      extra: { isPvp: true, killerName: 'Bob', valueLost: 100000 },
    };
    expect(getSocialPostTextFromDinkPayload(payload)).toContain('💀 Alice was PKed by Bob! 💸 Lost: 100,000 gp');
  });

  it('handles DEATH (NPC)', () => {
    const payload = {
      type: 'DEATH',
      playerName: 'Alice',
      extra: { isPvp: false, killerName: 'Goblin', valueLost: 500 },
    };
    expect(getSocialPostTextFromDinkPayload(payload)).toContain('💀 Alice was slain by Goblin! 💸 Lost: 500 gp');
  });

  it('handles COLLECTION', () => {
    const payload = {
      type: 'COLLECTION',
      playerName: 'Alice',
      extra: { itemName: 'Zamorak chaps', completedEntries: 10, totalEntries: 100 },
    };
    expect(getSocialPostTextFromDinkPayload(payload)).toContain('📚 Alice added Zamorak chaps to their collection! (10/100 logs)');
  });

  it('handles LEVEL', () => {
    const payload = {
      type: 'LEVEL',
      playerName: 'Alice',
      extra: { levelledSkills: { Fishing: 99 } },
    };
    expect(getSocialPostTextFromDinkPayload(payload)).toContain('⬆️ Alice levelled up: Fishing to level 99');
  });

  it('handles XP_MILESTONE', () => {
    const payload = {
      type: 'XP_MILESTONE',
      playerName: 'Alice',
      extra: { milestoneAchieved: ['Cooking'], interval: 5000000 },
    };
    expect(getSocialPostTextFromDinkPayload(payload)).toContain('🏅 Alice hit an XP milestone in: Cooking (5,000,000 XP)');
  });

  it('handles LOOT', () => {
    const payload = {
      type: 'LOOT',
      playerName: 'Alice',
      extra: { items: [{ name: 'Dragon scimitar', quantity: 1, priceEach: 60000 }], source: 'Monkey Madness', party: ['Alice', 'Bob'] },
    };
    expect(getSocialPostTextFromDinkPayload(payload)).toContain('📦 Alice looted: Dragon scimitar (60,000 gp) from Monkey Madness 👥 Party: Alice, Bob');
  });

  it('handles SLAYER', () => {
    const payload = {
      type: 'SLAYER',
      playerName: 'Alice',
      extra: { slayerTask: 'Abyssal demons', slayerPoints: '15', slayerCompleted: '30' },
    };
    expect(getSocialPostTextFromDinkPayload(payload)).toContain('🗡️ Alice completed a slayer task: Abyssal demons (15 pts, 30 tasks)');
  });

  it('handles QUEST', () => {
    const payload = {
      type: 'QUEST',
      playerName: 'Alice',
      extra: { questName: 'Dragon Slayer I', completedQuests: 22, totalQuests: 156 },
    };
    expect(getSocialPostTextFromDinkPayload(payload)).toContain('🧭 Alice completed the quest: Dragon Slayer I (22/156 quests)');
  });

  it('handles CLUE', () => {
    const payload = {
      type: 'CLUE',
      playerName: 'Alice',
      extra: { clueType: 'Beginner', numberCompleted: 5, items: [{ name: 'Feather', quantity: 100, priceEach: 3 }] },
    };
    expect(getSocialPostTextFromDinkPayload(payload)).toContain('🗺️ Alice completed a Beginner clue (#5) and got: 100x Feather (3 gp)');
  });

  it('handles KILL_COUNT', () => {
    const payload = {
      type: 'KILL_COUNT',
      playerName: 'Alice',
      extra: { boss: 'Zulrah', count: 42, isPersonalBest: true, party: ['Alice'] },
    };
    expect(getSocialPostTextFromDinkPayload(payload)).toContain('🏆 Alice defeated Zulrah (42). 🔥 New PB! 👥 Party: Alice');
  });

  it('handles COMBAT_ACHIEVEMENT (tier)', () => {
    const payload = {
      type: 'COMBAT_ACHIEVEMENT',
      playerName: 'Alice',
      extra: { justCompletedTier: 'MASTER', task: 'Peach Conjurer' },
    };
    expect(getSocialPostTextFromDinkPayload(payload)).toContain('🥇 Alice unlocked MASTER tier by completing: Peach Conjurer');
  });

  it('handles COMBAT_ACHIEVEMENT (task)', () => {
    const payload = {
      type: 'COMBAT_ACHIEVEMENT',
      playerName: 'Alice',
      extra: { tier: 'GRANDMASTER', task: 'Peach Conjurer' },
    };
    expect(getSocialPostTextFromDinkPayload(payload)).toContain('🥇 Alice completed GRANDMASTER combat task: Peach Conjurer');
  });

  it('handles ACHIEVEMENT_DIARY', () => {
    const payload = {
      type: 'ACHIEVEMENT_DIARY',
      playerName: 'Alice',
      extra: { area: 'Varrock', difficulty: 'HARD', total: 15 },
    };
    expect(getSocialPostTextFromDinkPayload(payload)).toContain('📖 Alice finished the HARD Varrock Achievement Diary (15 diaries)');
  });

  it('handles PET', () => {
    const payload = {
      type: 'PET',
      playerName: 'Alice',
      extra: { petName: 'Ikkle hydra', milestone: '5,000 killcount', duplicate: false },
    };
    expect(getSocialPostTextFromDinkPayload(payload)).toContain('🐾 Alice got a pet: Ikkle hydra - 5,000 killcount');
  });

  it('handles SPEEDRUN (PB)', () => {
    const payload = {
      type: 'SPEEDRUN',
      playerName: 'Alice',
      extra: { questName: "Cook's Assistant", currentTime: '1:13.20', isPersonalBest: true },
    };
    expect(getSocialPostTextFromDinkPayload(payload)).toContain('⏱️ Alice set a new PB in Cook\'s Assistant: 1:13.20');
  });

  it('handles SPEEDRUN (normal)', () => {
    const payload = {
      type: 'SPEEDRUN',
      playerName: 'Alice',
      extra: { questName: "Cook's Assistant", currentTime: '1:22.20', personalBest: '1:13.20' },
    };
    expect(getSocialPostTextFromDinkPayload(payload)).toContain('⏱️ Alice finished a speedrun of Cook\'s Assistant: 1:22.20 (PB: 1:13.20)');
  });

  it('handles BARBARIAN_ASSAULT_GAMBLE', () => {
    const payload = {
      type: 'BARBARIAN_ASSAULT_GAMBLE',
      playerName: 'Alice',
      extra: { gambleCount: 500, items: [{ name: 'Granite shield', quantity: 1, priceEach: 35500 }] },
    };
    expect(getSocialPostTextFromDinkPayload(payload)).toContain('🎲 Alice reached 500 high gambles and got: Granite shield (35,500 gp)');
  });

  it('handles PLAYER_KILL', () => {
    const payload = {
      type: 'PLAYER_KILL',
      playerName: 'Alice',
      extra: { victimName: 'Bob', victimCombatLevel: 69 },
    };
    expect(getSocialPostTextFromDinkPayload(payload)).toContain("⚔️ Alice PK'd Bob (lvl 69)!");
  });

  it('handles GROUP_STORAGE', () => {
    const payload = {
      type: 'GROUP_STORAGE',
      playerName: 'Alice',
      extra: {
        deposits: [{ name: 'Shrimps', quantity: 2, priceEach: 56 }],
        withdrawals: [{ name: 'Bronze pickaxe', quantity: 1, priceEach: 22 }],
      },
    };
    expect(getSocialPostTextFromDinkPayload(payload)).toContain('🏦 Alice deposited: 2x Shrimps (56 gp) | withdrew: Bronze pickaxe (22 gp)');
  });

  it('handles GRAND_EXCHANGE', () => {
    const payload = {
      type: 'GRAND_EXCHANGE',
      playerName: 'Alice',
      extra: { status: 'SOLD', item: { name: 'Feather', quantity: 2, priceEach: 3 } },
    };
    expect(getSocialPostTextFromDinkPayload(payload)).toContain('💱 Alice sold Feather x2 on the GE (3 gp each)');
  });

  it('handles TRADE', () => {
    const payload = {
      type: 'TRADE',
      playerName: 'Alice',
      extra: {
        counterparty: 'Bob',
        receivedItems: [{ name: 'Feather', quantity: 100, priceEach: 2 }],
        givenItems: [{ name: 'Cannonball', quantity: 3, priceEach: 150 }],
      },
    };
    expect(getSocialPostTextFromDinkPayload(payload)).toContain('🤝 Alice traded with Bob. Received: 100x Feather (2 gp) | Gave: 3x Cannonball (150 gp)');
  });

  it('handles LEAGUES_AREA', () => {
    const payload = {
      type: 'LEAGUES_AREA',
      playerName: 'Alice',
      extra: { area: 'Kandarin', index: 2 },
    };
    expect(getSocialPostTextFromDinkPayload(payload)).toContain('🌍 Alice unlocked region: Kandarin (#2)');
  });

  it('handles LEAGUES_MASTERY', () => {
    const payload = {
      type: 'LEAGUES_MASTERY',
      playerName: 'Alice',
      extra: { masteryType: 'Melee', masteryTier: 1 },
    };
    expect(getSocialPostTextFromDinkPayload(payload)).toContain('🥋 Alice unlocked Combat Mastery: Melee (Tier 1)');
  });

  it('handles LEAGUES_RELIC', () => {
    const payload = {
      type: 'LEAGUES_RELIC',
      playerName: 'Alice',
      extra: { relic: 'Production Prodigy', tier: 1 },
    };
    expect(getSocialPostTextFromDinkPayload(payload)).toContain('🔮 Alice unlocked Tier 1 Relic: Production Prodigy');
  });

  it('handles LEAGUES_TASK (trophy)', () => {
    const payload = {
      type: 'LEAGUES_TASK',
      playerName: 'Alice',
      extra: { difficulty: 'Hard', taskName: 'The Frozen Door', earnedTrophy: 'Bronze', taskPoints: 80 },
    };
    expect(getSocialPostTextFromDinkPayload(payload)).toContain('🏆 Alice completed a Hard task: The Frozen Door, unlocking the Bronze trophy!');
  });

  it('handles LEAGUES_TASK (normal)', () => {
    const payload = {
      type: 'LEAGUES_TASK',
      playerName: 'Alice',
      extra: { difficulty: 'Easy', taskName: 'Pickpocket a Citizen', taskPoints: 10 },
    };
    expect(getSocialPostTextFromDinkPayload(payload)).toContain('📝 Alice completed a Easy task: Pickpocket a Citizen (+10 pts)');
  });

  it('handles CHAT', () => {
    const payload = {
      type: 'CHAT',
      playerName: 'Alice',
      extra: { message: 'Hello world!' },
    };
    expect(getSocialPostTextFromDinkPayload(payload)).toContain('💬 Alice received a chat message: "Hello world!"');
  });

  it('handles EXTERNAL_PLUGIN', () => {
    const payload = {
      type: 'EXTERNAL_PLUGIN',
      playerName: 'Alice',
      extra: { sourcePlugin: 'MyPlugin' },
    };
    expect(getSocialPostTextFromDinkPayload(payload)).toContain('🔌 Alice got a notification from MyPlugin');
  });

  it('handles LOGIN', () => {
    const payload = {
      type: 'LOGIN',
      playerName: 'Alice',
      extra: { world: 338 },
    };
    expect(getSocialPostTextFromDinkPayload(payload)).toContain('🔑 Alice logged in to World 338');
  });

  it('handles LOGOUT', () => {
    const payload = {
      type: 'LOGOUT',
      playerName: 'Alice',
    };
    expect(getSocialPostTextFromDinkPayload(payload)).toContain('🚪 Alice logged out.');
  });

  it('handles TOA_UNIQUE', () => {
    const payload = {
      type: 'TOA_UNIQUE',
      playerName: 'Alice',
    };
    expect(getSocialPostTextFromDinkPayload(payload)).toContain('🟣 Alice rolled a purple (unique) drop in Tombs of Amascut!');
  });

  it('handles unknown type (fallback)', () => {
    const payload = {
      type: 'UNKNOWN_TYPE',
      playerName: 'Alice',
      content: 'Custom content',
    };
    expect(getSocialPostTextFromDinkPayload(payload)).toBe('Custom content');
  });
}); 
// Utility to generate a social media post text (with emojis) from a Dink payload_json
// Covers all types from the DinkPlugin spec

interface DinkPayload {
  type: string;
  content?: string;
  playerName?: string;
  accountType?: string;
  seasonalWorld?: boolean;
  clanName?: string;
  groupIronClanName?: string;
  world?: number;
  regionId?: number;
  extra?: Record<string, any>;
  [key: string]: any;
}

// Helper: format item list
function formatItems(items: any[] | undefined): string {
  if (!items || !items.length) return '';
  return items
    .map(
      (item) =>
        `${item.quantity > 1 ? `${item.quantity}x ` : ''}${item.name} (${item.priceEach?.toLocaleString?.() ?? '?'} gp)`
    )
    .join(', ');
}

// Helper: format party
function formatParty(party: string[] | undefined): string {
  if (!party || !party.length) return '';
  return `👥 Party: ${party.join(', ')}`;
}

// Helper: format skill list
function formatSkills(skills: Record<string, number> | undefined): string {
  if (!skills) return '';
  return Object.entries(skills)
    .map(([skill, lvl]) => `${skill} to level ${lvl}`)
    .join(', ');
}

// Main function
export function getSocialPostTextFromDinkPayload(payload: DinkPayload): string {
  const { type, playerName, extra = {}, content } = payload;
  switch (type) {
    case 'DEATH': {
      const lost = extra.valueLost ? `💸 Lost: ${extra.valueLost.toLocaleString()} gp` : '';
      if (extra.isPvp) {
        return `💀 ${playerName} was PKed by ${extra.killerName || 'another player'}! ${lost}`;
      }
      if (extra.killerName) {
        return `💀 ${playerName} was slain by ${extra.killerName}! ${lost}`;
      }
      return `💀 ${playerName} has died. ${lost}`;
    }
    case 'COLLECTION': {
      return `📚 ${playerName} added ${extra.itemName} to their collection! (${extra.completedEntries}/${extra.totalEntries} logs)`;
    }
    case 'LEVEL': {
      const skills = formatSkills(extra.levelledSkills);
      return `⬆️ ${playerName} levelled up: ${skills}`;
    }
    case 'XP_MILESTONE': {
      const skills = (extra.milestoneAchieved || []).join(', ');
      return `🏅 ${playerName} hit an XP milestone in: ${skills} (${extra.interval?.toLocaleString()} XP)`;
    }
    case 'LOOT': {
      const items = formatItems(extra.items);
      const src = extra.source ? `from ${extra.source}` : '';
      const party = formatParty(extra.party);
      return `📦 ${playerName} looted: ${items} ${src} ${party}`.trim();
    }
    case 'SLAYER': {
      return `🗡️ ${playerName} completed a slayer task: ${extra.slayerTask} (${extra.slayerPoints} pts, ${extra.slayerCompleted} tasks)`;
    }
    case 'QUEST': {
      return `🧭 ${playerName} completed the quest: ${extra.questName} (${extra.completedQuests}/${extra.totalQuests} quests)`;
    }
    case 'CLUE': {
      const items = formatItems(extra.items);
      return `🗺️ ${playerName} completed a ${extra.clueType} clue (#${extra.numberCompleted}) and got: ${items}`;
    }
    case 'KILL_COUNT': {
      const boss = extra.boss || 'a boss';
      const count = extra.count ? `(${extra.count})` : '';
      const pb = extra.isPersonalBest ? '🔥 New PB!' : '';
      const party = formatParty(extra.party);
      return `🏆 ${playerName} defeated ${boss} ${count}. ${pb} ${party}`.trim();
    }
    case 'COMBAT_ACHIEVEMENT': {
      if (extra.justCompletedTier) {
        return `🥇 ${playerName} unlocked ${extra.justCompletedTier} tier by completing: ${extra.task}`;
      }
      return `🥇 ${playerName} completed ${extra.tier} combat task: ${extra.task}`;
    }
    case 'ACHIEVEMENT_DIARY': {
      return `📖 ${playerName} finished the ${extra.difficulty} ${extra.area} Achievement Diary (${extra.total} diaries)`;
    }
    case 'PET': {
      return `🐾 ${playerName} got a pet: ${extra.petName || 'A new pet'}${extra.duplicate ? ' (duplicate!)' : ''}${extra.milestone ? ` - ${extra.milestone}` : ''}`;
    }
    case 'SPEEDRUN': {
      if (extra.isPersonalBest) {
        return `⏱️ ${playerName} set a new PB in ${extra.questName}: ${extra.currentTime}`;
      }
      return `⏱️ ${playerName} finished a speedrun of ${extra.questName}: ${extra.currentTime} (PB: ${extra.personalBest})`;
    }
    case 'BARBARIAN_ASSAULT_GAMBLE': {
      const items = formatItems(extra.items);
      return `🎲 ${playerName} reached ${extra.gambleCount} high gambles and got: ${items}`;
    }
    case 'PLAYER_KILL': {
      return `⚔️ ${playerName} PK'd ${extra.victimName} (lvl ${extra.victimCombatLevel})!`;
    }
    case 'GROUP_STORAGE': {
      const deposits = formatItems(extra.deposits);
      const withdrawals = formatItems(extra.withdrawals);
      return `🏦 ${playerName} deposited: ${deposits} | withdrew: ${withdrawals}`;
    }
    case 'GRAND_EXCHANGE': {
      return `💱 ${playerName} ${extra.status?.toLowerCase()} ${extra.item?.name} x${extra.item?.quantity} on the GE (${extra.item?.priceEach?.toLocaleString()} gp each)`;
    }
    case 'TRADE': {
      const received = formatItems(extra.receivedItems);
      const given = formatItems(extra.givenItems);
      return `🤝 ${playerName} traded with ${extra.counterparty}. Received: ${received} | Gave: ${given}`;
    }
    case 'LEAGUES_AREA': {
      return `🌍 ${playerName} unlocked region: ${extra.area} (#${extra.index})`;
    }
    case 'LEAGUES_MASTERY': {
      return `🥋 ${playerName} unlocked Combat Mastery: ${extra.masteryType} (Tier ${extra.masteryTier})`;
    }
    case 'LEAGUES_RELIC': {
      return `🔮 ${playerName} unlocked Tier ${extra.tier} Relic: ${extra.relic}`;
    }
    case 'LEAGUES_TASK': {
      if (extra.earnedTrophy) {
        return `🏆 ${playerName} completed a ${extra.difficulty} task: ${extra.taskName}, unlocking the ${extra.earnedTrophy} trophy!`;
      }
      return `📝 ${playerName} completed a ${extra.difficulty} task: ${extra.taskName} (+${extra.taskPoints} pts)`;
    }
    case 'CHAT': {
      return `💬 ${playerName} received a chat message: "${extra.message}"`;
    }
    case 'EXTERNAL_PLUGIN': {
      return `🔌 ${playerName} got a notification from ${extra.sourcePlugin}`;
    }
    case 'LOGIN': {
      return `🔑 ${playerName} logged in to World ${extra.world}`;
    }
    case 'LOGOUT': {
      return `🚪 ${playerName} logged out.`;
    }
    case 'TOA_UNIQUE': {
      return `🟣 ${playerName} rolled a purple (unique) drop in Tombs of Amascut!`;
    }
    default: {
      // Fallback: use content or generic
      return content || `${playerName} did something cool in OSRS!`;
    }
  }
}

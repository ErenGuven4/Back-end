// PlayersStore: Oyuncu kayıtlarını players.json dosyasında saklar.
// Gerçek üretim ortamında bu dosya yerine TypeORM + PostgreSQL Repository kullanılır.
// Ders notlarındaki Repository<Player> mantığını yansıtır.

import * as fs from 'fs';
import * as path from 'path';
import { Player } from './player.entity';

interface PlayersDatabase {
  players: Player[];
  nextId: number;
}

const DB_PATH = path.join(process.cwd(), 'data', 'players.json');

// Başlangıç verisi: dosya yoksa bu yapıyla oluşturulur
const DEFAULT_DB: PlayersDatabase = {
  players: [],
  nextId: 1,
};

// JSON dosyasını okur; yoksa varsayılan yapıyı oluşturur
function getDb(): PlayersDatabase {
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify(DEFAULT_DB, null, 2), 'utf-8');
    return { ...DEFAULT_DB };
  }
  const raw = fs.readFileSync(DB_PATH, 'utf-8');
  return JSON.parse(raw);
}

// Güncel veriyi dosyaya kaydeder
function saveDb(data: PlayersDatabase): void {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

// Tüm TypeORM Repository metodlarını taklit eden basit nesne.
// Ders notlarındaki playersRepository.findOneBy(), .save(), .update() çağrılarının karşılığı.
export const PlayersStore = {
  findOneBy(criteria: Partial<Player>): Player | null {
    const db = getDb();
    return (
      db.players.find((p) =>
        Object.entries(criteria).every(([k, v]) => p[k] === v),
      ) || null
    );
  },

  findAll(): Player[] {
    return getDb().players;
  },

  create(data: Partial<Player>): Player {
    const db = getDb();
    const player: Player = {
      id: db.nextId,
      username: data.username,
      email: data.email,
      password: data.password,
      refreshToken: null,
      role: data.role || 'player',
      level: data.level || 0,
      createdAt: new Date(),
    };
    db.players.push(player);
    db.nextId += 1;
    saveDb(db);
    return player;
  },

  update(id: number, fields: Partial<Player>): void {
    const db = getDb();
    const idx = db.players.findIndex((p) => p.id === id);
    if (idx !== -1) {
      db.players[idx] = { ...db.players[idx], ...fields };
      saveDb(db);
    }
  },
};

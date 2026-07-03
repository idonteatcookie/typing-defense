# 游戏配置文件说明

本文档详细说明盲打塔防游戏的所有配置文件位置、字段含义和配置方法。

## 配置文件列表

| 配置文件 | 路径 | 说明 |
|---------|------|------|
| 怪物配置 | [src/data/monsters.json](file:///Users/xia/code/md/typing-defense/src/data/monsters.json) | 所有怪物的属性、贴图等 |
| 防御塔配置 | [src/data/towers.json](file:///Users/xia/code/md/typing-defense/src/data/towers.json) | 所有可放置防御塔的属性 |
| 关卡配置 | [src/data/levels.json](file:///Users/xia/code/md/typing-defense/src/data/levels.json) | 每一关的地图、怪物波次、练习字母等 |

---

## 1. 怪物配置文件

**文件路径**：`src/data/monsters.json`

### 字段说明

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `type` | string | 是 | 怪物唯一标识，用于代码中引用 |
| `name` | string | 是 | 怪物显示名称 |
| `maxHp` | number | 是 | 最大生命值 |
| `speed` | number | 是 | 移动速度（像素/秒） |
| `goldReward` | number | 是 | 击杀后获得的金币 |
| `color` | string | 是 | 怪物颜色（十六进制，用于无贴图时的渲染） |
| `size` | number | 是 | 怪物大小（半径，像素） |
| `sprite` | string | 否 | 贴图资源名称（对应 Phaser 中加载的 texture key） |
| `description` | string | 否 | 怪物描述 |

### 配置示例

```json
{
  "type": "slime",
  "name": "史莱姆",
  "maxHp": 30,
  "speed": 30,
  "goldReward": 5,
  "color": "#4ade80",
  "size": 20,
  "sprite": "slime",
  "description": "基础怪物，血量低，速度慢"
}
```

### 添加新怪物

1. 在 `monsters.json` 数组中添加新的怪物对象
2. 如果使用自定义贴图，将图片放入 `public/assets/monsters/` 目录
3. 在 `src/phaser/scenes/BootScene.ts` 的 `preload()` 方法中添加图片加载：
   ```typescript
   this.load.image('你的怪物type', '/assets/monsters/你的图片文件名.png');
   ```
4. 保存后游戏启动时会自动加载新怪物配置

### 注意事项

- `type` 字段必须唯一，不可重复
- 贴图图片建议使用 PNG 透明背景格式
- 如果没有配置 `sprite` 或贴图加载失败，会自动使用 `color` 字段渲染圆形怪物

---

## 2. 防御塔配置文件

**文件路径**：`src/data/towers.json`

### 字段说明

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `type` | string | 是 | 防御塔唯一标识 |
| `name` | string | 是 | 防御塔显示名称 |
| `cost` | number | 是 | 建造费用（金币） |
| `damage` | number | 是 | 攻击伤害 |
| `attackSpeed` | number | 是 | 攻击速度（次/秒） |
| `range` | number | 是 | 攻击范围（像素） |
| `attackType` | string | 是 | 攻击类型：`single`（单体）/ `aoe`（范围） |
| `aoeRadius` | number | 否 | AOE 攻击半径（attackType 为 `aoe` 时必填） |
| `color` | string | 是 | 塔的颜色（十六进制，用于无贴图时的渲染） |
| `description` | string | 是 | 塔的描述文字 |
| `slowAmount` | number | 否 | 减速比例（0-1），冰霜塔类使用 |
| `slowDuration` | number | 否 | 减速持续时间（秒） |
| `goldPerTick` | number | 否 | 每次产出金币数（金币塔类使用） |
| `tickInterval` | number | 否 | 金币产出间隔（秒） |
| `sprite` | string | 否 | 贴图资源名称 |

### 配置示例

**基础箭塔：**
```json
{
  "type": "arrow",
  "name": "箭塔",
  "cost": 50,
  "damage": 10,
  "attackSpeed": 1.0,
  "range": 120,
  "attackType": "single",
  "color": "#8b5cf6",
  "description": "基础防御塔，单体攻击，性价比高",
  "sprite": "tower"
}
```

**范围魔法塔：**
```json
{
  "type": "magic",
  "name": "魔法塔",
  "cost": 100,
  "damage": 25,
  "attackSpeed": 0.5,
  "range": 100,
  "attackType": "aoe",
  "aoeRadius": 50,
  "color": "#06b6d4",
  "description": "范围伤害，对付密集怪物群"
}
```

**金币产出塔：**
```json
{
  "type": "gold",
  "name": "金币塔",
  "cost": 120,
  "damage": 0,
  "attackSpeed": 0,
  "range": 0,
  "attackType": "single",
  "color": "#fbbf24",
  "description": "不攻击，定期产生金币",
  "goldPerTick": 5,
  "tickInterval": 5
}
```

### 添加新防御塔

1. 在 `towers.json` 数组中添加新的塔对象
2. 如果使用自定义贴图，将图片放入 `public/assets/towers/` 目录
3. 在 `src/phaser/scenes/BootScene.ts` 的 `preload()` 方法中添加图片加载
4. 保存后游戏启动时会自动加载新塔配置

### 注意事项

- `type` 字段必须唯一
- `attackType` 只能是 `single` 或 `aoe`
- 金币塔的 `damage`、`attackSpeed`、`range` 可设为 0

---

## 3. 关卡配置文件

**文件路径**：`src/data/levels.json`

### 字段说明

#### 关卡顶层字段

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | number | 是 | 关卡 ID（从 1 开始递增，必须唯一） |
| `name` | string | 是 | 关卡名称 |
| `practiceLetters` | string | 否 | 本关练习的字母集合 |
| `startGold` | number | 是 | 初始金币数 |
| `startLives` | number | 是 | 初始生命值 |
| `typingDifficulty` | number | 是 | 打字难度（1-5，数字越大目标字母越长） |
| `path` | array | 是 | 怪物行走路径点数组 |
| `availableTowers` | array | 是 | 本关可用的防御塔 type 列表 |
| `waves` | array | 是 | 怪物波次配置数组 |
| `isEndless` | boolean | 否 | 是否为无尽模式（默认 false） |

#### 路径点 (path)

```json
"path": [
  { "x": 480, "y": 0 },
  { "x": 480, "y": 160 },
  { "x": 160, "y": 160 }
]
```

- `x`、`y`：路径点坐标（像素）
- 怪物会按数组顺序依次经过每个路径点
- 第一个点是出生点，最后一个点是终点（玩家位置）
- 游戏画布尺寸：960 × 640 像素

#### 波次配置 (waves)

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `delay` | number | 是 | 波次开始延迟（毫秒） |
| `monsters` | array | 是 | 本波怪物生成配置数组 |

#### 怪物生成配置 (waves[].monsters[])

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `type` | string | 是 | 怪物 type（必须在 monsters.json 中定义） |
| `count` | number | 是 | 生成数量 |
| `interval` | number | 是 | 生成间隔（毫秒） |

### 完整配置示例

```json
{
  "id": 1,
  "name": "左手基准键",
  "practiceLetters": "asdf",
  "startGold": 100,
  "startLives": 10,
  "typingDifficulty": 1,
  "path": [
    { "x": 480, "y": 0 },
    { "x": 480, "y": 160 },
    { "x": 160, "y": 160 },
    { "x": 160, "y": 400 },
    { "x": 720, "y": 400 },
    { "x": 720, "y": 560 },
    { "x": 480, "y": 560 }
  ],
  "availableTowers": ["arrow", "ice"],
  "waves": [
    {
      "delay": 0,
      "monsters": [
        { "type": "slime", "count": 5, "interval": 2500 },
        { "type": "runner", "count": 3, "interval": 2000 }
      ]
    },
    {
      "delay": 5000,
      "monsters": [
        { "type": "tank", "count": 2, "interval": 3000 }
      ]
    }
  ]
}
```

### 添加新关卡

1. 在 `levels.json` 数组末尾添加新的关卡对象
2. 设置唯一的 `id`（比现有最大 ID 大 1）
3. 配置路径、可用塔、波次等信息
4. 保存后游戏启动时会自动加载新关卡

### 无尽模式配置

在关卡中添加 `"isEndless": true` 即可设置为无尽模式：

```json
{
  "id": 53,
  "name": "无尽模式",
  "isEndless": true,
  "practiceLetters": "abcdefghijklmnopqrstuvwxyz",
  ...
}
```

- 无尽模式的波次会循环播放，直到玩家失败
- 建议配置多波次、多种怪物组合，循环时有变化感

### 打字难度说明

| 难度等级 | 目标字母长度 | 适用场景 |
|---------|-------------|---------|
| 1 | 1 个字母 | 入门关卡，单个字母练习 |
| 2 | 2 个字母 | 初级，简单双字母组合 |
| 3 | 3 个字母 | 中级，三字母单词 |
| 4 | 4 个字母 | 高级，四字母单词 |
| 5 | 5+ 个字母 | 挑战，长单词 |

### 注意事项

- `id` 必须唯一且按顺序递增
- `path` 至少需要 2 个点（起点和终点）
- `availableTowers` 中的塔 type 必须在 `towers.json` 中定义
- `waves[].monsters[].type` 中的怪物 type 必须在 `monsters.json` 中定义
- 同一波次中多个怪物组会同时开始生成

---

## 4. 图片资源放置位置

### 目录结构

```
public/assets/
├── monsters/          # 怪物贴图
│   ├── slime.png
│   ├── runner.png
│   ├── tank.png
│   └── boss.png
├── towers/            # 防御塔贴图
│   └── tower.png
├── bullets/           # 子弹贴图
│   ├── bullet.png
│   ├── bullet_fire.png
│   ├── arrow.png
│   └── red_bullet.png
└── audio/             # 音效文件
    ├── bgm.mp3
    ├── bullet.mp3
    ├── error.mp3
    ├── victory.mp3
    └── ...
```

### 资源加载

所有图片资源需要在 `src/phaser/scenes/BootScene.ts` 的 `preload()` 方法中注册：

```typescript
// 怪物
this.load.image('slime', '/assets/monsters/slime.png');

// 防御塔
this.load.image('tower', '/assets/towers/tower.png');

// 子弹
this.load.image('cannon_bullet', '/assets/bullets/bullet.png');
```

`load.image` 的第一个参数是资源 key，需要与配置文件中的 `sprite` 字段值对应。

---

## 5. 快速调试指南

### 快速修改怪物数量

直接修改 `levels.json` 对应关卡的 `waves[].monsters[].count` 即可。

### 快速调整难度

- 修改怪物血量：`monsters.json` 中的 `maxHp`
- 修改塔的伤害：`towers.json` 中的 `damage`
- 修改初始金币：`levels.json` 中的 `startGold`

### 测试特定关卡

修改关卡列表顺序，把要测试的关卡放到前面，或者在游戏菜单中直接选择对应关卡。

### 配置热更新

修改 JSON 配置文件后，需要重新启动开发服务器才能生效（Vite 支持 HMR，但 JSON 导入可能需要刷新页面）。

---

## 6. 相关代码文件

| 文件 | 说明 |
|------|------|
| [src/game/config/MonsterConfig.ts](file:///Users/xia/code/md/typing-defense/src/game/config/MonsterConfig.ts) | 怪物配置加载 |
| [src/game/config/TowerConfig.ts](file:///Users/xia/code/md/typing-defense/src/game/config/TowerConfig.ts) | 防御塔配置加载 |
| [src/game/level/LevelManager.ts](file:///Users/xia/code/md/typing-defense/src/game/level/LevelManager.ts) | 关卡管理 |
| [src/game/types/monster.ts](file:///Users/xia/code/md/typing-defense/src/game/types/monster.ts) | 怪物类型定义 |
| [src/game/types/tower.ts](file:///Users/xia/code/md/typing-defense/src/game/types/tower.ts) | 防御塔类型定义 |
| [src/game/types/level.ts](file:///Users/xia/code/md/typing-defense/src/game/types/level.ts) | 关卡类型定义 |
| [src/phaser/scenes/BootScene.ts](file:///Users/xia/code/md/typing-defense/src/phaser/scenes/BootScene.ts) | 资源预加载 |

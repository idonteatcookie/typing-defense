# 盲打塔防 (Typing Defense)

一款基于打字练习的塔防游戏，通过输入字母来发射炮弹消灭怪物，在游戏中提升盲打速度和准确率。

## 功能特性

### 核心玩法
- **打字攻击**：输入屏幕显示的目标字母，从底部炮台发射子弹攻击最前方的怪物
- **连击系统**：连续正确输入可获得连击加成，提高伤害（最高2倍）
- **实时统计**：显示打字速度(WPM)、准确率、连击数等数据

### 关卡系统
- **52个关卡**：循序渐进的打字练习，从基准键位到全键盘
- **无尽模式**：第53关为无尽模式，波次循环，挑战极限
- **关卡选择**：可自由选择已解锁的关卡
- **星级评价**：根据剩余生命和准确率给予1-3星评价

### 练习字母设计
- 每关练习特定的字母组合（一排字母或一排中的几个）
- 游戏中输入目标始终为单个字母
- 难度递进：基准行 → 上行 → 下行 → 全键盘

### 塔防元素
- **炮塔系统**：可放置箭塔和冰塔辅助攻击
- **怪物系统**：史莱姆（普通）、疾行者（快速）、坦克（高血量）、Boss
- **波次系统**：每关多波怪物，难度递增
- **路径系统**：怪物沿固定路径前进

### 连击狂热模式
达到一定连击数后触发视觉效果：
- **5连击**：黄色发光、屏幕边框脉动
- **10连击**：⚡ 狂热模式 - 橙色发光、底部火焰燃烧效果
- **20连击**：🔥 狂暴模式 - 紫色发光、文字抖动
- **50连击**：💀 无敌模式 - 红色发光、强烈效果、伤害翻倍

### 危险状态
当怪物接近玩家位置（走过路径80%）时，屏幕四周会出现红色危险光晕脉动，提醒玩家注意。

### 视觉反馈
- 正确输入：字母变绿色
- 错误输入：字母变红色并左右抖动
- 炮台开火动画、炮口闪光
- 怪物受击和死亡效果
- 连击时屏幕边框发光脉动、底部火焰
- 狂热模式子弹使用火焰贴图且更大

### 音效系统
- **背景音乐**：游戏过程中循环播放
- **发射音效**：每次发射子弹时播放
- **错误音效**：输入错误时播放
- **胜利/失败音效**：游戏结束时播放
- 暂停时自动暂停音乐

## 技术栈

- **前端框架**：React 18 + TypeScript
- **游戏引擎**：Phaser 3
- **状态管理**：Zustand
- **样式方案**：Tailwind CSS
- **构建工具**：Vite
- **事件系统**：EventBus（发布-订阅模式）

## 项目结构

```
typing-defense/
├── docs/                        # 文档
│   ├── 盲打塔防游戏PRD.md       # 产品需求文档
│   └── 盲打防线-技术架构设计文档.md  # 技术架构文档
├── public/
│   └── assets/                  # 游戏素材
│       ├── audio/               # 音频文件
│       │   ├── bgm.mp3             # 背景音乐
│       │   ├── bullet.mp3          # 发射音效
│       │   ├── error.mp3           # 错误音效
│       │   ├── victory.mp3         # 胜利音效
│       │   └── defeat.mp3          # 失败音效
│       ├── monsters/            # 怪物图片
│       │   ├── slime.png           # 史莱姆
│       │   ├── runner.png          # 疾行者
│       │   ├── tank.png            # 坦克
│       │   └── boss.png            # Boss
│       ├── towers/              # 炮塔图片
│       │   └── tower.png           # 炮塔
│       └── bullets/             # 子弹图片
│       │   ├── arrow.png           # 箭塔子弹
│       │   └── bullet.png          # 炮台子弹
├── src/
│   ├── components/              # React 组件
│   │   ├── dialog/              # 对话框组件
│   │   │   ├── DefeatDialog.tsx    # 失败弹窗
│   │   │   ├── PauseDialog.tsx     # 暂停弹窗
│   │   │   └── VictoryDialog.tsx   # 胜利弹窗
│   │   ├── game/                # 游戏相关组件
│   │   │   ├── ComboDisplay.tsx    # 连击显示
│   │   │   └── GameView.tsx        # 游戏视图容器
│   │   ├── layout/              # 布局组件
│   │   │   ├── BottomInput.tsx     # 底部输入显示
│   │   │   ├── LeftPanel.tsx       # 左侧炮塔面板
│   │   │   └── TopBar.tsx          # 顶部状态栏
│   │   └── menu/                # 菜单组件
│   │       ├── LevelSelect.tsx     # 关卡选择
│   │       └── MainMenu.tsx        # 主菜单
│   ├── constants/               # 常量定义
│   │   ├── eventNames.ts           # 事件名称常量
│   │   └── gameConstants.ts        # 游戏常量配置
│   ├── data/                    # 数据配置（JSON文件）
│   │   ├── levels.json             # 关卡配置文件
│   │   ├── monsters.json           # 怪物配置文件
│   │   └── towers.json             # 防御塔配置文件
│   ├── game/                    # 游戏核心逻辑
│   │   ├── config/              # 配置
│   │   │   ├── MonsterConfig.ts    # 怪物配置
│   │   │   └── TowerConfig.ts      # 炮塔配置
│   │   ├── entities/            # 实体类
│   │   │   ├── Bullet.ts           # 子弹实体
│   │   │   ├── GameEntity.ts       # 实体基类
│   │   │   ├── Monster.ts          # 怪物实体
│   │   │   └── Tower.ts            # 炮塔实体
│   │   ├── level/               # 关卡管理
│   │   │   ├── LevelManager.ts     # 关卡管理器
│   │   │   └── WaveManager.ts      # 波次管理器
│   │   ├── systems/             # 系统（ECS模式）
│   │   │   ├── BulletSystem.ts     # 子弹系统
│   │   │   ├── MonsterSystem.ts    # 怪物系统
│   │   │   └── TowerSystem.ts      # 炮塔系统
│   │   ├── types/               # 类型定义
│   │   │   ├── bullet.ts           # 子弹类型
│   │   │   ├── game.ts             # 游戏类型
│   │   │   ├── level.ts            # 关卡类型
│   │   │   ├── monster.ts          # 怪物类型
│   │   │   ├── tower.ts            # 炮塔类型
│   │   │   └── typing.ts           # 打字类型
│   │   ├── typing/              # 打字引擎
│   │   │   ├── EngineFactory.ts    # 引擎工厂
│   │   │   ├── QwertyEngine.ts     # QWERTY键盘引擎
│   │   │   └── TypingManager.ts    # 打字管理器
│   │   ├── utils/               # 工具函数
│   │   │   ├── grid.ts             # 网格工具
│   │   │   ├── math.ts             # 数学工具
│   │   │   └── pool.ts             # 对象池
│   │   ├── AudioManager.ts      # 音频管理器
│   │   ├── EventBus.ts          # 事件总线
│   │   └── GameManager.ts       # 游戏管理器（单例）
│   ├── phaser/                  # Phaser 游戏引擎
│   │   ├── scenes/              # 场景
│   │   │   ├── BootScene.ts        # 启动场景（加载资源）
│   │   │   └── GameScene.ts        # 游戏场景（渲染）
│   │   └── PhaserGame.ts         # Phaser游戏实例
│   ├── storage/                 # 本地存储
│   │   ├── SettingsStorage.ts      # 设置存储
│   │   ├── StorageService.ts       # 存储服务
│   │   ├── UserStorage.ts          # 用户数据存储
│   │   └── schema.ts               # 存储schema
│   ├── store/                   # Zustand 状态管理
│   │   ├── useGameStore.ts         # 游戏状态
│   │   ├── useSettingsStore.ts     # 设置状态
│   │   └── useUserStore.ts         # 用户状态
│   ├── App.tsx                 # 根组件
│   ├── index.css               # 全局样式（含连击动画）
│   └── main.tsx                # 入口文件
├── .eslintrc.cjs               # ESLint 配置
├── .gitignore                  # Git 忽略配置
├── index.html                  # HTML 入口
├── package.json                # 项目依赖
├── postcss.config.js           # PostCSS 配置
├── tailwind.config.js          # Tailwind 配置
├── tsconfig.json               # TypeScript 配置
├── tsconfig.node.json          # TypeScript Node 配置
├── vite.config.ts              # Vite 配置
└── README.md                   # 项目说明
```

## 配置文件说明

所有游戏配置均使用 JSON 文件，便于修改和扩展。详细配置说明请参考 [CONFIG.md](CONFIG.md)。

### 配置文件列表

| 配置文件 | 路径 | 说明 |
|---------|------|------|
| 怪物配置 | `src/data/monsters.json` | 所有怪物的属性、贴图等 |
| 防御塔配置 | `src/data/towers.json` | 所有可放置防御塔的属性 |
| 关卡配置 | `src/data/levels.json` | 每一关的地图、怪物波次、练习字母等 |

### 关卡配置 (levels.json)

每关配置字段说明：

```json
{
  "id": 1,                    // 关卡ID（唯一，递增）
  "name": "左手基准键",        // 关卡名称
  "practiceLetters": "asdf",  // 练习字母集
  "isEndless": false,         // 是否为无尽模式
  "startGold": 100,           // 初始金币
  "startLives": 10,           // 初始生命
  "typingDifficulty": 1,      // 打字难度（1-5）
  "path": [...],              // 怪物路径点坐标数组
  "availableTowers": [...],   // 可用炮塔类型列表
  "waves": [...]              // 波次配置数组
}
```

**波次配置结构**：

```json
"waves": [
  {
    "delay": 0,           // 波次开始延迟(毫秒)
    "monsters": [
      {
        "type": "slime",  // 怪物类型（需在monsters.json中定义）
        "count": 5,       // 数量
        "interval": 3000  // 生成间隔(毫秒)
      }
    ]
  }
]
```

### 怪物配置 (monsters.json)

每种怪物配置：

```json
{
  "type": "slime",           // 怪物唯一标识
  "name": "史莱姆",          // 显示名称
  "maxHp": 30,               // 最大血量
  "speed": 30,               // 移动速度(像素/秒)
  "goldReward": 5,           // 击杀金币奖励
  "color": "#4ade80",        // 颜色（无贴图时使用）
  "size": 20,                // 大小(半径)
  "sprite": "slime",         // 贴图资源名
  "description": "..."       // 描述
}
```

**现有怪物类型**：
- `slime` - 史莱姆（血量30，速度慢）
- `runner` - 疾行者（血量20，速度快）
- `tank` - 重甲兵（血量100，速度慢）
- `boss` - Boss（血量500）

### 防御塔配置 (towers.json)

每种防御塔配置：

```json
{
  "type": "arrow",           // 塔唯一标识
  "name": "箭塔",            // 显示名称
  "cost": 50,                // 建造费用
  "damage": 10,              // 伤害
  "attackSpeed": 1.0,        // 攻击速度(次/秒)
  "range": 120,              // 攻击范围(像素)
  "attackType": "single",    // single/aoe
  "color": "#8b5cf6",        // 颜色
  "description": "...",      // 描述
  "sprite": "tower"          // 贴图资源名
}
```

**现有防御塔类型**：
- `arrow` - 箭塔（单体攻击，性价比高）
- `magic` - 魔法塔（范围伤害）
- `ice` - 冰霜塔（减速效果）
- `sniper` - 狙击塔（高伤害，远射程）
- `gold` - 金币塔（产出金币）

### 游戏常量 (gameConstants.ts)

位置：`src/constants/gameConstants.ts`

```typescript
GAME_WIDTH = 960           // 游戏画布宽度
GAME_HEIGHT = 640          // 游戏画布高度
GRID_SIZE = 40             // 网格大小
CANNON_DAMAGE = 15         // 炮台基础伤害
CANNON_BULLET_SPEED = 500  // 炮台子弹速度
```

## 游戏素材

### 图片素材

| 目录 | 文件 | 用途 |
|------|------|------|
| `monsters/` | slime.png | 史莱姆怪物 |
| | runner.png | 疾行者怪物 |
| | tank.png | 坦克怪物 |
| | boss.png | Boss怪物 |
| `towers/` | tower.png | 炮塔 |
| `bullets/` | arrow.png | 箭塔子弹 |
| | bullet.png | 炮台子弹 |

### 音频素材

| 文件 | 用途 | 说明 |
|------|------|------|
| bgm.mp3 | 背景音乐 | 游戏过程中循环播放 |
| bullet.mp3 | 发射音效 | 每次发射子弹时播放 |
| error.mp3 | 错误音效 | 输入错误字母时播放 |
| victory.mp3 | 胜利音效 | 关卡胜利时播放 |
| defeat.mp3 | 失败音效 | 关卡失败时播放 |

## 快速开始

### 环境要求
- Node.js >= 16
- npm 或 yarn

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

启动后访问 http://localhost:5173

### 构建生产版本

```bash
npm run build
```

构建产物在 `dist` 目录。

### 预览生产构建

```bash
npm run preview
```

### 代码检查

```bash
npm run lint
```

### 类型检查

```bash
npm run typecheck
```

## 调试方式

### 关卡调试

修改 `src/data/levels.json`：

```json
{
  "id": 1,
  "name": "测试关",
  "practiceLetters": "asdf",
  "startGold": 999,       // 大量金币便于测试
  "startLives": 99,       // 大量生命防止失败
  "waves": [
    {
      "delay": 0,
      "monsters": [{ "type": "slime", "count": 3, "interval": 3000 }]  // 少量怪物快速测试
    }
  ]
}
```

### 怪物/防御塔调试

修改对应的 JSON 配置文件：

- **怪物属性**：修改 `src/data/monsters.json`（血量、速度、奖励等）
- **防御塔属性**：修改 `src/data/towers.json`（伤害、造价、射程等）

### 其他调试

- **连击伤害倍率**：修改 `src/game/typing/TypingManager.ts` 的 `getComboDamageMultiplier()`
- **连击触发等级**：修改 `src/components/game/GameView.tsx` 的 `getComboLevel()`
- **危险触发阈值**：修改 `src/game/GameManager.ts` 的 `dangerThreshold`（默认0.8）

### 添加新内容

1. **新怪物**：在 `monsters.json` 添加配置，贴图放入 `public/assets/monsters/`，在 `BootScene.ts` 加载
2. **新防御塔**：在 `towers.json` 添加配置，贴图放入 `public/assets/towers/`，在 `BootScene.ts` 加载
3. **新关卡**：在 `levels.json` 添加配置，设置唯一递增的 `id`

### 事件调试

所有游戏事件通过 `EventBus` 发布，可在 `src/constants/eventNames.ts` 查看所有事件名。

## 游戏操作

- **字母键**：输入目标字母，正确则炮台开火
- **ESC**：暂停/继续游戏
- **鼠标点击**：选择炮塔类型，点击地图放置炮塔

## 架构说明

### 核心架构模式
- **单例模式**：`GameManager`、`AudioManager` 全局唯一管理器
- **发布-订阅**：`EventBus` 实现组件间解耦通信
- **ECS模式**：System 管理实体更新逻辑
- **工厂模式**：`EngineFactory` 创建打字引擎

### 数据流
1. 用户键盘输入 → `BottomInput` 组件监听
2. 输入传递给 `GameManager.handleTypingInput()`
3. `TypingManager` 处理输入逻辑
4. 正确输入触发 `fireCannon()` 发射子弹，播放音效
5. `BulletSystem` 更新子弹位置
6. `MonsterSystem` 处理怪物伤害和死亡
7. 状态变化通过 EventBus 发布事件
8. React 组件监听事件更新 UI

### 状态管理
- `useGameStore`：游戏状态（金币、生命、波次、连击）
- `useUserStore`：用户数据（解锁关卡、最高连击）
- `useSettingsStore`：设置（音量、静音）

## License

MIT
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
- **怪物系统**：史莱姆（普通）、疾行者（快速）、坦克（高血量）
- **波次系统**：每关多波怪物，难度递增
- **路径系统**：怪物沿固定路径前进

### 视觉反馈
- 正确输入：字母变绿色
- 错误输入：字母变红色并左右抖动
- 炮台开火动画
- 怪物受击和死亡效果

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
│   ├── data/                    # 数据配置
│   │   └── levels.json             # 关卡配置文件
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
│   │   ├── EventBus.ts          # 事件总线
│   │   └── GameManager.ts       # 游戏管理器（单例）
│   ├── phaser/                  # Phaser 游戏引擎
│   │   ├── scenes/              # 场景
│   │   │   ├── BootScene.ts        # 启动场景
│   │   │   └── GameScene.ts        # 游戏场景
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
│   ├── index.css               # 全局样式
│   └── main.tsx                # 入口文件
├── .eslintrc.cjs               # ESLint 配置
├── .gitignore                  # Git 忽略配置
├── index.html                  # HTML 入口
├── package.json                # 项目依赖
├── postcss.config.js           # PostCSS 配置
├── tailwind.config.js          # Tailwind 配置
├── tsconfig.json               # TypeScript 配置
├── tsconfig.node.json          # TypeScript Node 配置
└── vite.config.ts              # Vite 配置
```

## 配置文件说明

### 关卡配置 (levels.json)

位置：`src/data/levels.json`

每关配置字段说明：

```json
{
  "id": 1,                    // 关卡ID
  "name": "左手基准键",        // 关卡名称
  "practiceLetters": "asdf",  // 练习字母集
  "isEndless": false,         // 是否为无尽模式
  "startGold": 100,           // 初始金币
  "startLives": 10,           // 初始生命
  "typingDifficulty": 1,      // 打字难度
  "path": [...],              // 怪物路径点
  "availableTowers": [...],   // 可用炮塔类型
  "waves": [...]              // 波次配置
}
```

**怪物类型**：
- `slime` - 史莱姆（普通怪物）
- `runner` - 疾行者（速度快）
- `tank` - 坦克（血量高）

**炮塔类型**：
- `arrow` - 箭塔（单体攻击）
- `ice` - 冰塔（减速效果）

### 游戏常量 (gameConstants.ts)

位置：`src/constants/gameConstants.ts`

```typescript
GAME_WIDTH = 960           // 游戏画布宽度
GAME_HEIGHT = 640          // 游戏画布高度
GRID_SIZE = 40             // 网格大小
CANNON_DAMAGE = 15         // 炮台基础伤害
CANNON_BULLET_SPEED = 500  // 炮台子弹速度
START_LIVES = 10           // 默认初始生命
START_GOLD = 100           // 默认初始金币
```

### 怪物配置 (MonsterConfig.ts)

位置：`src/game/config/MonsterConfig.ts`

可配置每种怪物的血量、速度、金币奖励等属性。

### 炮塔配置 (TowerConfig.ts)

位置：`src/game/config/TowerConfig.ts`

可配置每种炮塔的伤害、射程、攻击速度、造价等属性。

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

### React DevTools
使用浏览器 React DevTools 扩展调试 React 组件状态。

### Zustand DevTools
Zustand 状态可通过 Redux DevTools 扩展查看（需配置）。

### 游戏调试
- **怪物数量**：修改 `src/data/levels.json` 中对应关卡的 `waves` 配置，调整怪物数量
- **游戏速度**：在 `GameManager.ts` 的 `update` 方法中调整 deltaTime 缩放
- **初始金币/生命**：修改关卡配置中的 `startGold` 和 `startLives`
- **打字难度**：修改关卡配置中的 `typingDifficulty`（当前目标始终为单字母）
- **练习字母**：修改关卡配置中的 `practiceLetters` 字段

### 关卡调试示例

快速测试某一关，修改对应关卡的 `waves`：

```json
{
  "id": 1,
  "name": "测试关",
  "practiceLetters": "asdf",
  "startGold": 999,
  "startLives": 99,
  "waves": [
    {
      "delay": 0,
      "monsters": [{ "type": "slime", "count": 3, "interval": 3000 }]
    }
  ]
}
```

### 事件调试
所有游戏事件通过 `EventBus` 发布，可在 `src/constants/eventNames.ts` 查看所有事件名，在控制台监听事件：

```javascript
// 浏览器控制台
eventBus.on('typing:correct', (data) => console.log('Correct:', data));
```

## 游戏操作

- **字母键**：输入目标字母，正确则炮台开火
- **ESC**：暂停/继续游戏
- **鼠标点击**：选择炮塔类型，点击地图放置炮塔

## 架构说明

### 核心架构模式
- **单例模式**：`GameManager` 全局唯一游戏管理器
- **发布-订阅**：`EventBus` 实现组件间解耦通信
- **ECS模式**：System 管理实体更新逻辑
- **工厂模式**：`EngineFactory` 创建打字引擎
- **对象池**：`pool.ts` 优化对象创建性能

### 数据流
1. 用户键盘输入 → `BottomInput` 组件监听
2. 输入传递给 `GameManager.handleTypingInput()`
3. `TypingManager` 处理输入逻辑
4. 正确输入触发 `fireCannon()` 发射子弹
5. `BulletSystem` 更新子弹位置
6. `MonsterSystem` 处理怪物伤害和死亡
7. 状态变化通过 EventBus 发布事件
8. React 组件监听事件更新 UI

## License

MIT

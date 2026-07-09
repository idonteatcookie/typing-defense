import json
import os

GAME_WIDTH = 1200
GAME_HEIGHT = 640
CENTER_X = GAME_WIDTH // 2
END_Y = GAME_HEIGHT - 40

# 起点在右侧偏上，终点在左侧中间
START_X = 1100
START_Y = 80
END_X = 80
END_Y_MID = GAME_HEIGHT // 2

maps = {
    "zShape": [
        {"x": START_X, "y": START_Y},
        {"x": START_X, "y": 240},
        {"x": 160, "y": 240},
        {"x": 160, "y": 480},
        {"x": 800, "y": 480},
        {"x": 800, "y": END_Y_MID + 80},
        {"x": END_X, "y": END_Y_MID + 80},
        {"x": END_X, "y": END_Y_MID}
    ],
    "sShape": [
        {"x": START_X, "y": START_Y},
        {"x": START_X, "y": 200},
        {"x": 200, "y": 200},
        {"x": 200, "y": 320},
        {"x": 760, "y": 320},
        {"x": 760, "y": 440},
        {"x": END_X, "y": 440},
        {"x": END_X, "y": END_Y_MID}
    ],
    "uShape": [
        {"x": START_X, "y": START_Y},
        {"x": START_X, "y": 520},
        {"x": 120, "y": 520},
        {"x": 120, "y": 160},
        {"x": 840, "y": 160},
        {"x": 840, "y": END_Y_MID},
        {"x": END_X, "y": END_Y_MID}
    ],
    "snake": [
        {"x": START_X, "y": START_Y},
        {"x": 80, "y": START_Y},
        {"x": 80, "y": 180},
        {"x": 880, "y": 180},
        {"x": 880, "y": 300},
        {"x": 80, "y": 300},
        {"x": 80, "y": 420},
        {"x": 880, "y": 420},
        {"x": 880, "y": END_Y_MID + 60},
        {"x": END_X, "y": END_Y_MID + 60},
        {"x": END_X, "y": END_Y_MID}
    ],
    "spiral": [
        {"x": START_X, "y": START_Y},
        {"x": START_X, "y": 160},
        {"x": 120, "y": 160},
        {"x": 120, "y": 560},
        {"x": 840, "y": 560},
        {"x": 840, "y": 240},
        {"x": 240, "y": 240},
        {"x": 240, "y": 480},
        {"x": 720, "y": 480},
        {"x": 720, "y": 320},
        {"x": 400, "y": 320},
        {"x": 400, "y": END_Y_MID + 40},
        {"x": END_X, "y": END_Y_MID + 40},
        {"x": END_X, "y": END_Y_MID}
    ],
    "lShape": [
        {"x": START_X, "y": START_Y},
        {"x": START_X, "y": 240},
        {"x": 840, "y": 240},
        {"x": 840, "y": 560},
        {"x": 120, "y": 560},
        {"x": 120, "y": END_Y_MID},
        {"x": END_X, "y": END_Y_MID}
    ],
    "doubleL": [
        {"x": START_X, "y": START_Y},
        {"x": START_X, "y": 200},
        {"x": 120, "y": 200},
        {"x": 120, "y": 420},
        {"x": 840, "y": 420},
        {"x": 840, "y": 540},
        {"x": 120, "y": 540},
        {"x": 120, "y": END_Y_MID},
        {"x": END_X, "y": END_Y_MID}
    ],
    "zigzag": [
        {"x": START_X, "y": START_Y},
        {"x": 720, "y": 160},
        {"x": 880, "y": 260},
        {"x": 720, "y": 360},
        {"x": 880, "y": 460},
        {"x": 720, "y": 540},
        {"x": END_X, "y": 540},
        {"x": END_X, "y": END_Y_MID}
    ],
    "maze": [
        {"x": START_X, "y": START_Y},
        {"x": START_X, "y": 160},
        {"x": 840, "y": 160},
        {"x": 840, "y": 300},
        {"x": 600, "y": 300},
        {"x": 600, "y": 200},
        {"x": 360, "y": 200},
        {"x": 360, "y": 340},
        {"x": 120, "y": 340},
        {"x": 120, "y": 480},
        {"x": 480, "y": 480},
        {"x": 480, "y": 540},
        {"x": 760, "y": 540},
        {"x": 760, "y": END_Y_MID + 60},
        {"x": END_X, "y": END_Y_MID + 60},
        {"x": END_X, "y": END_Y_MID}
    ],
    "ring": [
        {"x": START_X, "y": START_Y},
        {"x": START_X, "y": 160},
        {"x": 160, "y": 160},
        {"x": 160, "y": 480},
        {"x": 800, "y": 480},
        {"x": 800, "y": 240},
        {"x": 320, "y": 240},
        {"x": 320, "y": 400},
        {"x": 640, "y": 400},
        {"x": 640, "y": 320},
        {"x": 480, "y": 320},
        {"x": 480, "y": END_Y_MID + 40},
        {"x": END_X, "y": END_Y_MID + 40},
        {"x": END_X, "y": END_Y_MID}
    ],
    "doubleRing": [
        {"x": START_X, "y": START_Y},
        {"x": START_X, "y": 120},
        {"x": 120, "y": 120},
        {"x": 120, "y": 520},
        {"x": 840, "y": 520},
        {"x": 840, "y": 200},
        {"x": 200, "y": 200},
        {"x": 200, "y": 440},
        {"x": 760, "y": 440},
        {"x": 760, "y": 280},
        {"x": 280, "y": 280},
        {"x": 280, "y": 360},
        {"x": 680, "y": 360},
        {"x": 680, "y": END_Y_MID + 40},
        {"x": END_X, "y": END_Y_MID + 40},
        {"x": END_X, "y": END_Y_MID}
    ],
    "longLine": [
        {"x": START_X, "y": START_Y},
        {"x": START_X, "y": 120},
        {"x": 60, "y": 120},
        {"x": 60, "y": 220},
        {"x": 900, "y": 220},
        {"x": 900, "y": 320},
        {"x": 60, "y": 320},
        {"x": 60, "y": 420},
        {"x": 900, "y": 420},
        {"x": 900, "y": 520},
        {"x": 60, "y": 520},
        {"x": 60, "y": END_Y_MID},
        {"x": END_X, "y": END_Y_MID}
    ],
    "complexMaze": [
        {"x": START_X, "y": START_Y},
        {"x": START_X, "y": 120},
        {"x": 880, "y": 120},
        {"x": 880, "y": 240},
        {"x": 640, "y": 240},
        {"x": 640, "y": 160},
        {"x": 400, "y": 160},
        {"x": 400, "y": 280},
        {"x": 80, "y": 280},
        {"x": 80, "y": 420},
        {"x": 320, "y": 420},
        {"x": 320, "y": 360},
        {"x": 560, "y": 360},
        {"x": 560, "y": 480},
        {"x": 800, "y": 480},
        {"x": 800, "y": 560},
        {"x": 160, "y": 560},
        {"x": 160, "y": 500},
        {"x": 320, "y": 500},
        {"x": 320, "y": END_Y_MID + 60},
        {"x": END_X, "y": END_Y_MID + 60},
        {"x": END_X, "y": END_Y_MID}
    ],
    "ultimateMaze": [
        {"x": START_X, "y": START_Y},
        {"x": START_X, "y": 120},
        {"x": 900, "y": 120},
        {"x": 900, "y": 210},
        {"x": 720, "y": 210},
        {"x": 720, "y": 150},
        {"x": 480, "y": 150},
        {"x": 480, "y": 240},
        {"x": 240, "y": 240},
        {"x": 240, "y": 150},
        {"x": 60, "y": 150},
        {"x": 60, "y": 330},
        {"x": 360, "y": 330},
        {"x": 360, "y": 420},
        {"x": 660, "y": 420},
        {"x": 660, "y": 300},
        {"x": 840, "y": 300},
        {"x": 840, "y": 480},
        {"x": 540, "y": 480},
        {"x": 540, "y": 390},
        {"x": 180, "y": 390},
        {"x": 180, "y": 510},
        {"x": 120, "y": 510},
        {"x": 120, "y": 580},
        {"x": 420, "y": 580},
        {"x": 420, "y": END_Y_MID + 60},
        {"x": END_X, "y": END_Y_MID + 60},
        {"x": END_X, "y": END_Y_MID}
    ]
}

def get_available_towers(level_id):
    if level_id >= 13:
        return ["arrow", "ice", "magic", "sniper"]
    if level_id >= 10:
        return ["arrow", "ice", "magic"]
    if level_id >= 5:
        return ["arrow", "ice"]
    return ["arrow"]

def get_map(level_id):
    if level_id <= 2:
        return maps["zShape"]
    if level_id <= 5:
        return maps["sShape"]
    if level_id <= 7:
        return maps["uShape"]
    if level_id <= 10:
        return maps["snake"]
    if level_id <= 12:
        return maps["spiral"]
    if level_id <= 14:
        return maps["lShape"]
    if level_id <= 16:
        return maps["doubleL"]
    if level_id <= 18:
        return maps["zigzag"]
    if level_id <= 21:
        return maps["maze"]
    if level_id <= 24:
        return maps["ring"]
    if level_id <= 26:
        return maps["doubleRing"]
    if level_id <= 29:
        return maps["longLine"]
    if level_id <= 44:
        return maps["complexMaze"]
    return maps["ultimateMaze"]

def slime_wave(count, interval, delay=0):
    return {"delay": delay, "monsters": [{"type": "slime", "count": count, "interval": interval}]}

def runner_wave(count, interval, delay=0):
    return {"delay": delay, "monsters": [{"type": "runner", "count": count, "interval": interval}]}

def tank_wave(count, interval, delay=0):
    return {"delay": delay, "monsters": [{"type": "tank", "count": count, "interval": interval}]}

def mixed_wave(s, r, t, interval, delay=0):
    monsters = []
    if s > 0:
        monsters.append({"type": "slime", "count": s, "interval": interval})
    if r > 0:
        monsters.append({"type": "runner", "count": r, "interval": interval})
    if t > 0:
        monsters.append({"type": "tank", "count": t, "interval": interval})
    return {"delay": delay, "monsters": monsters}

def boss_wave(boss_count, minion_count, delay=0):
    monsters = [{"type": "boss", "count": boss_count, "interval": 5000}]
    if minion_count > 0:
        monsters.append({"type": "slime", "count": minion_count, "interval": 1500})
    return {"delay": delay, "monsters": monsters}

ALL_LETTERS = "qwertyuiopasdfghjkl;zxcvbnm,./"
ALL_DIGITS = "1234567890"
ALL_PUNCT = ",.;:()[]{}+-*/=<>!@#$%^&*\"'~`\\|"
ALL_CHARS = ALL_LETTERS + ALL_DIGITS + ALL_PUNCT

levels = []

def add_level(lid, name, letters, waves):
    levels.append({
        "id": lid,
        "name": name,
        "practiceLetters": letters,
        "startGold": 0,
        "startLives": 10,
        "typingDifficulty": 1,
        "availableTowers": get_available_towers(lid),
        "path": get_map(lid),
        "waves": waves
    })

# 第一阶段：基准键入门（1-3）
add_level(1, "左手基准键", "asdf", [
    slime_wave(6, 2500, 0),
    slime_wave(8, 2200, 3000),
    slime_wave(10, 2000, 3000)
])
add_level(2, "右手基准键", "jkl;", [
    slime_wave(7, 2400, 0),
    slime_wave(9, 2100, 3000),
    slime_wave(11, 1900, 3000)
])
add_level(3, "双手基准键", "asdfghjkl;", [
    slime_wave(6, 2200, 0),
    mixed_wave(6, 3, 0, 2000, 3000),
    mixed_wave(8, 4, 0, 1800, 3000),
    slime_wave(12, 1600, 3000)
])

# 第二阶段：上排字母（4-7）
add_level(4, "左手上排", "qwer", [
    slime_wave(7, 2200, 0),
    mixed_wave(6, 4, 0, 2000, 3000),
    mixed_wave(8, 5, 0, 1800, 3000),
    runner_wave(8, 1500, 3000)
])
add_level(5, "右手上排", "uiop", [
    slime_wave(8, 2000, 0),
    mixed_wave(6, 5, 0, 1800, 3000),
    mixed_wave(8, 6, 0, 1600, 3000),
    runner_wave(10, 1300, 3000)
])
add_level(6, "上排整合", "qwertyuiop", [
    slime_wave(7, 2000, 0),
    mixed_wave(8, 5, 0, 1700, 3000),
    mixed_wave(10, 6, 0, 1500, 3000),
    runner_wave(12, 1200, 3000),
    slime_wave(14, 1400, 3000)
])
add_level(7, "基准+上排", "asdfghjkl;qwertyuiop", [
    mixed_wave(8, 4, 0, 1800, 0),
    mixed_wave(10, 5, 0, 1600, 3000),
    mixed_wave(8, 6, 2, 1500, 3000),
    runner_wave(14, 1100, 3000),
    tank_wave(3, 2500, 3000)
])

# 第三阶段：下排字母（8-12）
add_level(8, "左手下排", "zxcv", [
    slime_wave(8, 2000, 0),
    mixed_wave(8, 5, 0, 1700, 3000),
    mixed_wave(10, 6, 0, 1500, 3000),
    runner_wave(12, 1200, 3000),
    slime_wave(14, 1400, 3000)
])
add_level(9, "右手下排", "m,./", [
    slime_wave(9, 1800, 0),
    mixed_wave(8, 6, 0, 1600, 3000),
    mixed_wave(10, 7, 0, 1400, 3000),
    runner_wave(14, 1100, 3000),
    mixed_wave(10, 5, 1, 1500, 3000)
])
add_level(10, "下排整合", "zxcvbnm,./", [
    slime_wave(7, 1800, 0),
    mixed_wave(10, 6, 0, 1500, 3000),
    mixed_wave(10, 8, 1, 1400, 3000),
    runner_wave(16, 1000, 3000),
    tank_wave(3, 2200, 3000),
    slime_wave(16, 1200, 3000)
])
add_level(11, "基准+下排", "asdfghjkl;zxcvbnm,./", [
    mixed_wave(10, 5, 0, 1600, 0),
    mixed_wave(12, 6, 1, 1400, 3000),
    mixed_wave(10, 8, 2, 1300, 3000),
    runner_wave(18, 900, 3000),
    tank_wave(5, 2000, 3000),
    mixed_wave(12, 6, 2, 1200, 3000)
])
add_level(12, "全键盘字母", ALL_LETTERS, [
    mixed_wave(10, 6, 1, 1500, 0),
    mixed_wave(12, 8, 2, 1300, 3000),
    runner_wave(20, 800, 3000),
    tank_wave(6, 1800, 3000),
    mixed_wave(15, 8, 3, 1100, 3000),
    boss_wave(1, 8, 3000)
])

# 第四阶段：数字行（13-17）
add_level(13, "左手数字", "12345", [
    slime_wave(8, 1800, 0),
    mixed_wave(10, 6, 0, 1500, 3000),
    mixed_wave(12, 8, 1, 1300, 3000),
    runner_wave(16, 900, 3000),
    tank_wave(4, 2000, 3000)
])
add_level(14, "右手数字", "67890", [
    slime_wave(10, 1600, 0),
    mixed_wave(12, 8, 1, 1300, 3000),
    mixed_wave(14, 10, 2, 1100, 3000),
    runner_wave(20, 800, 3000),
    tank_wave(5, 1800, 3000),
    slime_wave(18, 1000, 3000)
])
add_level(15, "数字行整合", ALL_DIGITS, [
    mixed_wave(12, 6, 1, 1400, 0),
    mixed_wave(14, 10, 2, 1200, 3000),
    runner_wave(22, 700, 3000),
    tank_wave(6, 1600, 3000),
    mixed_wave(16, 10, 3, 1000, 3000),
    slime_wave(20, 900, 3000)
])
add_level(16, "字母+数字", ALL_LETTERS + ALL_DIGITS, [
    mixed_wave(12, 8, 2, 1300, 0),
    mixed_wave(15, 10, 3, 1100, 3000),
    runner_wave(24, 700, 3000),
    tank_wave(8, 1500, 3000),
    mixed_wave(18, 12, 4, 900, 3000),
    boss_wave(1, 12, 3000)
])
add_level(17, "数字强化", ALL_LETTERS + ALL_DIGITS, [
    mixed_wave(14, 10, 2, 1200, 0),
    runner_wave(26, 600, 3000),
    tank_wave(10, 1400, 3000),
    mixed_wave(20, 14, 5, 800, 3000),
    slime_wave(24, 700, 3000),
    boss_wave(1, 15, 3000)
])

# 第五阶段：标点符号（18-24）
add_level(18, "基础标点", ",.;:", [
    slime_wave(10, 1600, 0),
    mixed_wave(12, 8, 1, 1300, 3000),
    mixed_wave(14, 10, 2, 1100, 3000),
    runner_wave(20, 750, 3000),
    tank_wave(6, 1700, 3000),
    slime_wave(18, 900, 3000)
])
add_level(19, "括号符号", "()[]{}", [
    mixed_wave(12, 8, 2, 1300, 0),
    mixed_wave(15, 10, 3, 1100, 3000),
    runner_wave(24, 650, 3000),
    tank_wave(8, 1500, 3000),
    mixed_wave(18, 12, 4, 900, 3000),
    slime_wave(22, 800, 3000)
])
add_level(20, "数学符号", "+-*/=<>", [
    mixed_wave(14, 10, 2, 1200, 0),
    mixed_wave(16, 12, 3, 1000, 3000),
    runner_wave(26, 600, 3000),
    tank_wave(10, 1400, 3000),
    mixed_wave(20, 14, 5, 800, 3000),
    boss_wave(1, 10, 3000)
])
add_level(21, "特殊符号", "!@#$%^&*", [
    mixed_wave(12, 10, 2, 1200, 0),
    runner_wave(28, 550, 3000),
    mixed_wave(18, 14, 4, 900, 3000),
    tank_wave(10, 1300, 3000),
    slime_wave(26, 700, 3000),
    mixed_wave(20, 16, 5, 750, 3000)
])
add_level(22, "引号撇号", "\"'~`\\|", [
    mixed_wave(14, 10, 3, 1100, 0),
    mixed_wave(18, 14, 4, 900, 3000),
    runner_wave(30, 500, 3000),
    tank_wave(12, 1200, 3000),
    mixed_wave(22, 16, 6, 700, 3000),
    slime_wave(28, 650, 3000)
])
add_level(23, "标点整合", ALL_PUNCT, [
    mixed_wave(16, 12, 3, 1000, 0),
    mixed_wave(20, 16, 5, 800, 3000),
    runner_wave(32, 450, 3000),
    tank_wave(14, 1100, 3000),
    mixed_wave(24, 18, 7, 650, 3000),
    boss_wave(1, 15, 3000),
    slime_wave(30, 600, 3000)
])
add_level(24, "全字符混合", ALL_CHARS, [
    mixed_wave(18, 12, 4, 950, 0),
    mixed_wave(22, 16, 6, 750, 3000),
    runner_wave(34, 400, 3000),
    tank_wave(16, 1000, 3000),
    mixed_wave(28, 20, 8, 600, 3000),
    boss_wave(2, 12, 3000),
    slime_wave(32, 550, 3000)
])

# 第六阶段：速度训练（25-34）
add_level(25, "速度训练I", ALL_CHARS, [
    runner_wave(20, 700, 0),
    runner_wave(28, 550, 2500),
    mixed_wave(12, 20, 2, 600, 2500),
    runner_wave(36, 400, 2500),
    mixed_wave(16, 24, 3, 500, 2500),
    runner_wave(40, 350, 2500)
])
add_level(26, "密集挑战I", ALL_CHARS, [
    slime_wave(25, 700, 0),
    slime_wave(32, 550, 2500),
    mixed_wave(28, 10, 2, 500, 2500),
    slime_wave(40, 400, 2500),
    mixed_wave(32, 14, 4, 450, 2500),
    slime_wave(48, 350, 2500),
    mixed_wave(36, 16, 6, 400, 2500)
])
add_level(27, "重甲挑战I", ALL_CHARS, [
    tank_wave(6, 1400, 0),
    mixed_wave(10, 6, 8, 800, 3000),
    tank_wave(10, 1100, 3000),
    mixed_wave(14, 10, 12, 700, 3000),
    tank_wave(14, 900, 3000),
    mixed_wave(18, 12, 16, 600, 3000),
    boss_wave(1, 10, 3000)
])
add_level(28, "混合战I", ALL_CHARS, [
    mixed_wave(15, 10, 3, 900, 0),
    mixed_wave(20, 14, 5, 700, 2500),
    runner_wave(30, 450, 2500),
    mixed_wave(25, 18, 8, 550, 2500),
    tank_wave(12, 1000, 2500),
    mixed_wave(30, 22, 10, 500, 2500),
    boss_wave(1, 15, 2500)
])
add_level(29, "Boss战I", ALL_CHARS, [
    mixed_wave(18, 12, 4, 800, 0),
    runner_wave(24, 500, 2500),
    tank_wave(8, 1200, 2500),
    boss_wave(1, 12, 2500),
    mixed_wave(20, 16, 6, 600, 2500),
    boss_wave(2, 10, 2500),
    slime_wave(30, 400, 2500)
])
add_level(30, "速度训练II", ALL_CHARS, [
    runner_wave(25, 600, 0),
    runner_wave(34, 480, 2000),
    mixed_wave(15, 26, 3, 500, 2000),
    runner_wave(42, 350, 2000),
    mixed_wave(20, 30, 5, 400, 2000),
    runner_wave(48, 300, 2000),
    mixed_wave(25, 35, 6, 350, 2000)
])
add_level(31, "密集挑战II", ALL_CHARS, [
    slime_wave(30, 600, 0),
    slime_wave(40, 450, 2000),
    mixed_wave(35, 14, 4, 400, 2000),
    slime_wave(50, 320, 2000),
    mixed_wave(42, 20, 6, 350, 2000),
    slime_wave(60, 280, 2000),
    mixed_wave(48, 24, 8, 300, 2000)
])
add_level(32, "重甲挑战II", ALL_CHARS, [
    tank_wave(8, 1200, 0),
    mixed_wave(14, 8, 10, 700, 2500),
    tank_wave(14, 950, 2500),
    mixed_wave(20, 14, 16, 600, 2500),
    tank_wave(20, 800, 2500),
    mixed_wave(26, 18, 20, 500, 2500),
    boss_wave(2, 12, 2500)
])
add_level(33, "混合战II", ALL_CHARS, [
    mixed_wave(20, 14, 5, 750, 0),
    mixed_wave(28, 20, 8, 550, 2000),
    runner_wave(38, 380, 2000),
    mixed_wave(35, 26, 12, 450, 2000),
    tank_wave(16, 850, 2000),
    mixed_wave(42, 32, 16, 380, 2000),
    boss_wave(2, 18, 2000)
])
add_level(34, "阶段测试", ALL_CHARS, [
    mixed_wave(22, 16, 6, 700, 0),
    runner_wave(36, 350, 2000),
    tank_wave(14, 900, 2000),
    mixed_wave(38, 28, 14, 400, 2000),
    slime_wave(50, 300, 2000),
    boss_wave(2, 20, 2000),
    mixed_wave(45, 35, 18, 320, 2000)
])

# 第七阶段：精通挑战（35-44）
add_level(35, "闪电战I", ALL_CHARS, [
    runner_wave(30, 500, 0),
    runner_wave(42, 380, 1800),
    mixed_wave(20, 36, 5, 400, 1800),
    runner_wave(55, 280, 1800),
    mixed_wave(28, 44, 8, 320, 1800),
    runner_wave(65, 240, 1800),
    mixed_wave(35, 50, 10, 280, 1800)
])
add_level(36, "人海战术I", ALL_CHARS, [
    slime_wave(40, 500, 0),
    slime_wave(55, 360, 1800),
    mixed_wave(48, 20, 6, 320, 1800),
    slime_wave(70, 250, 1800),
    mixed_wave(60, 28, 10, 280, 1800),
    slime_wave(85, 210, 1800),
    mixed_wave(70, 35, 14, 240, 1800)
])
add_level(37, "钢铁军团I", ALL_CHARS, [
    tank_wave(10, 1000, 0),
    mixed_wave(18, 12, 14, 600, 2000),
    tank_wave(18, 800, 2000),
    mixed_wave(28, 20, 22, 480, 2000),
    tank_wave(26, 650, 2000),
    mixed_wave(38, 28, 30, 400, 2000),
    boss_wave(3, 15, 2000)
])
add_level(38, "混乱战场I", ALL_CHARS, [
    mixed_wave(28, 20, 8, 600, 0),
    runner_wave(48, 300, 1800),
    tank_wave(18, 750, 1800),
    mixed_wave(45, 35, 18, 350, 1800),
    slime_wave(65, 220, 1800),
    boss_wave(2, 25, 1800),
    mixed_wave(55, 45, 25, 280, 1800)
])
add_level(39, "双Boss", ALL_CHARS, [
    mixed_wave(30, 22, 10, 550, 0),
    runner_wave(50, 280, 1800),
    tank_wave(20, 700, 1800),
    boss_wave(2, 20, 1800),
    mixed_wave(50, 38, 20, 320, 1800),
    boss_wave(3, 15, 1800),
    slime_wave(70, 200, 1800)
])
add_level(40, "生存挑战", ALL_CHARS, [
    mixed_wave(25, 18, 6, 650, 0),
    runner_wave(40, 350, 1500),
    mixed_wave(35, 25, 12, 450, 1500),
    tank_wave(15, 800, 1500),
    slime_wave(55, 280, 1500),
    mixed_wave(48, 36, 20, 350, 1500),
    boss_wave(2, 20, 1500),
    runner_wave(60, 220, 1500),
    mixed_wave(60, 48, 28, 250, 1500),
    tank_wave(25, 600, 1500),
    slime_wave(80, 180, 1500),
    boss_wave(3, 25, 1500)
])
add_level(41, "闪电战II", ALL_CHARS, [
    runner_wave(38, 400, 0),
    runner_wave(52, 300, 1500),
    mixed_wave(25, 45, 7, 320, 1500),
    runner_wave(68, 220, 1500),
    mixed_wave(35, 55, 10, 250, 1500),
    runner_wave(80, 180, 1500),
    mixed_wave(45, 65, 14, 210, 1500),
    runner_wave(90, 150, 1500)
])
add_level(42, "人海战术II", ALL_CHARS, [
    slime_wave(50, 400, 0),
    slime_wave(70, 280, 1500),
    mixed_wave(62, 26, 8, 250, 1500),
    slime_wave(90, 200, 1500),
    mixed_wave(78, 36, 14, 210, 1500),
    slime_wave(110, 160, 1500),
    mixed_wave(92, 48, 20, 180, 1500)
])
add_level(43, "钢铁军团II", ALL_CHARS, [
    tank_wave(14, 850, 0),
    mixed_wave(24, 18, 20, 500, 1800),
    tank_wave(24, 680, 1800),
    mixed_wave(38, 28, 30, 400, 1800),
    tank_wave(36, 550, 1800),
    mixed_wave(52, 40, 42, 320, 1800),
    boss_wave(4, 18, 1800)
])
add_level(44, "大师挑战", ALL_CHARS, [
    mixed_wave(35, 25, 12, 500, 0),
    runner_wave(60, 250, 1500),
    tank_wave(24, 650, 1500),
    mixed_wave(55, 42, 24, 300, 1500),
    slime_wave(80, 180, 1500),
    boss_wave(3, 30, 1500),
    mixed_wave(70, 55, 35, 220, 1500),
    boss_wave(4, 20, 1500)
])

# 第八阶段：盲打大师（45-52）
add_level(45, "大师试炼I", ALL_CHARS, [
    mixed_wave(40, 28, 15, 450, 0),
    runner_wave(65, 230, 1500),
    tank_wave(28, 600, 1500),
    mixed_wave(65, 50, 30, 270, 1500),
    slime_wave(90, 160, 1500),
    boss_wave(3, 35, 1500),
    mixed_wave(80, 62, 42, 200, 1500),
    tank_wave(40, 480, 1500)
])
add_level(46, "大师试炼II", ALL_CHARS, [
    runner_wave(70, 200, 0),
    mixed_wave(60, 55, 35, 230, 1500),
    tank_wave(32, 550, 1500),
    slime_wave(100, 140, 1500),
    mixed_wave(85, 68, 48, 180, 1500),
    boss_wave(4, 25, 1500),
    runner_wave(100, 140, 1500),
    mixed_wave(95, 78, 58, 150, 1500)
])
add_level(47, "Boss冲锋", ALL_CHARS, [
    mixed_wave(45, 32, 18, 420, 0),
    boss_wave(2, 20, 1500),
    mixed_wave(55, 42, 28, 320, 1500),
    boss_wave(3, 25, 1500),
    mixed_wave(70, 55, 40, 230, 1500),
    boss_wave(4, 30, 1500),
    mixed_wave(85, 68, 52, 180, 1500),
    boss_wave(5, 35, 1500)
])
add_level(48, "无尽狂潮", ALL_CHARS, [
    slime_wave(60, 350, 0),
    mixed_wave(70, 30, 15, 280, 1200),
    runner_wave(80, 180, 1200),
    slime_wave(110, 130, 1200),
    mixed_wave(90, 60, 30, 170, 1200),
    tank_wave(40, 420, 1200),
    mixed_wave(100, 75, 45, 140, 1200),
    runner_wave(110, 120, 1200),
    slime_wave(130, 100, 1200),
    mixed_wave(120, 90, 60, 110, 1200)
])
add_level(49, "钢铁洪流", ALL_CHARS, [
    tank_wave(18, 750, 0),
    mixed_wave(35, 25, 25, 400, 1500),
    tank_wave(30, 550, 1500),
    mixed_wave(50, 38, 40, 300, 1500),
    tank_wave(45, 420, 1500),
    mixed_wave(70, 55, 60, 220, 1500),
    tank_wave(60, 350, 1500),
    boss_wave(5, 30, 1500),
    mixed_wave(90, 72, 80, 160, 1500)
])
add_level(50, "混乱风暴", ALL_CHARS, [
    mixed_wave(50, 35, 20, 380, 0),
    runner_wave(80, 170, 1200),
    tank_wave(35, 500, 1200),
    slime_wave(100, 120, 1200),
    mixed_wave(80, 60, 45, 180, 1200),
    boss_wave(4, 35, 1200),
    runner_wave(120, 100, 1200),
    mixed_wave(110, 85, 70, 130, 1200),
    tank_wave(55, 350, 1200),
    slime_wave(140, 90, 1200)
])
add_level(51, "盲打宗师", ALL_CHARS, [
    mixed_wave(55, 40, 25, 350, 0),
    runner_wave(90, 150, 1000),
    tank_wave(40, 450, 1000),
    slime_wave(120, 100, 1000),
    mixed_wave(100, 75, 60, 150, 1000),
    boss_wave(5, 40, 1000),
    mixed_wave(130, 100, 85, 110, 1000),
    runner_wave(150, 80, 1000),
    tank_wave(70, 300, 1000),
    boss_wave(6, 50, 1000),
    mixed_wave(150, 120, 100, 90, 1000)
])
add_level(52, "盲打大师", ALL_CHARS, [
    mixed_wave(60, 45, 30, 320, 0),
    runner_wave(100, 130, 1000),
    tank_wave(50, 400, 1000),
    slime_wave(140, 85, 1000),
    mixed_wave(120, 90, 75, 130, 1000),
    boss_wave(5, 50, 1000),
    mixed_wave(150, 120, 100, 100, 1000),
    runner_wave(180, 70, 1000),
    tank_wave(90, 250, 1000),
    boss_wave(8, 60, 1000),
    mixed_wave(180, 150, 130, 75, 1000),
    slime_wave(200, 60, 1000),
    boss_wave(10, 80, 1000),
    mixed_wave(200, 170, 150, 55, 1000),
    boss_wave(15, 100, 1000)
])

# 无尽模式（第53关）
levels.append({
    "id": 53,
    "name": "无尽模式",
    "practiceLetters": ALL_CHARS,
    "isEndless": True,
    "startGold": 300,
    "startLives": 10,
    "typingDifficulty": 1,
    "availableTowers": ["arrow", "ice", "magic", "sniper"],
    "path": maps["complexMaze"],
    "waves": [
        mixed_wave(15, 10, 3, 1200, 0),
        mixed_wave(20, 14, 5, 950, 2000),
        runner_wave(30, 500, 2000),
        mixed_wave(25, 18, 8, 700, 2000),
        tank_wave(10, 1000, 2000),
        slime_wave(40, 400, 2000),
        mixed_wave(35, 25, 12, 550, 2000),
        boss_wave(2, 15, 2000),
        mixed_wave(45, 35, 18, 400, 2000),
        runner_wave(60, 300, 2000)
    ]
})

output_path = os.path.join(os.path.dirname(__file__), "..", "src", "data", "levels.json")
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(levels, f, ensure_ascii=False, indent=2)

print(f"Generated {len(levels)} levels")

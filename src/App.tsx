import { useState, useEffect, useCallback } from 'react';
import { useGameStore } from './store/useGameStore';
import { useUserStore } from './store/useUserStore';
import { useSettingsStore } from './store/useSettingsStore';
import { gameManager } from './game/GameManager';
import { eventBus } from './game/EventBus';
import { EVENT_NAMES } from './constants/eventNames';
import { audioManager } from './game/AudioManager';
import { getTowerConfig } from './game/config/TowerConfig';
import MainMenu from './components/menu/MainMenu';
import LevelSelect from './components/menu/LevelSelect';
import GameView from './components/game/GameView';
import VictoryDialog from './components/dialog/VictoryDialog';
import DefeatDialog from './components/dialog/DefeatDialog';
import PauseDialog from './components/dialog/PauseDialog';
import type { VictoryData, DefeatData } from './game/EventBus';

function App() {
  const gameScreen = useGameStore((state) => state.gameScreen);
  const setGameScreen = useGameStore((state) => state.setGameScreen);
  const setCurrentLevelId = useGameStore((state) => state.setCurrentLevelId);
  const setVictory = useGameStore((state) => state.setVictory);
  const setDefeat = useGameStore((state) => state.setDefeat);
  const setGold = useGameStore((state) => state.setGold);
  const setLives = useGameStore((state) => state.setLives);
  const setWave = useGameStore((state) => state.setWave);
  const setTypingTarget = useGameStore((state) => state.setTypingTarget);
  const setCombo = useGameStore((state) => state.setCombo);

  const loadUserStore = useUserStore((state) => state.loadFromStorage);
  const loadSettings = useSettingsStore((state) => state.loadFromStorage);

  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    loadUserStore();
    loadSettings();
    gameManager.init();
    setIsInitialized(true);
  }, [loadUserStore, loadSettings]);

  useEffect(() => {
    const unsub1 = eventBus.on(EVENT_NAMES.GOLD_CHANGE, (data) => {
      setGold(data.current);
    });

    const unsub2 = eventBus.on(EVENT_NAMES.LIFE_CHANGE, (data) => {
      setLives(data.current);
    });

    const unsub3 = eventBus.on(EVENT_NAMES.WAVE_START, (waveNum) => {
      setWave(waveNum, gameManager.getTotalWaves());
    });

    const unsub4 = eventBus.on(EVENT_NAMES.TYPING_TARGET_CHANGE, (target) => {
      setTypingTarget(target);
    });

    const unsub5 = eventBus.on(EVENT_NAMES.TYPING_CORRECT, (data) => {
      setCombo(data.combo);
    });

    const unsub6 = eventBus.on(EVENT_NAMES.TYPING_WRONG, () => {
      setCombo(0);
      audioManager.playWrongSound();
    });

    const unsub7 = eventBus.on(EVENT_NAMES.GAME_VICTORY, (data: VictoryData) => {
      setVictory(data);
      audioManager.stopBgm();
      audioManager.playVictorySound();
    });

    const unsub8 = eventBus.on(EVENT_NAMES.GAME_DEFEAT, (data: DefeatData) => {
      setDefeat(data);
      audioManager.stopBgm();
      audioManager.playDefeatSound();
    });

    const unsub9 = eventBus.on(EVENT_NAMES.BULLET_FIRE, (bullet) => {
      if (bullet.towerType === 'cannon') {
        audioManager.playBulletSound();
      } else {
        const config = getTowerConfig(bullet.towerType);
        if (config && config.sound) {
          audioManager.playTowerSound(config.sound);
        }
      }
    });

    return () => {
      unsub1();
      unsub2();
      unsub3();
      unsub4();
      unsub5();
      unsub6();
      unsub7();
      unsub8();
      unsub9();
    };
  }, [setGold, setLives, setWave, setTypingTarget, setCombo, setVictory, setDefeat]);

  const handleStartGame = useCallback((levelId: number) => {
    gameManager.startLevel(levelId);
    setCurrentLevelId(levelId);
    setGameScreen('playing');
    setWave(1, gameManager.getTotalWaves());
    audioManager.startBgm();
  }, [setGameScreen, setWave, setCurrentLevelId]);

  const handleGoToMenu = useCallback(() => {
    audioManager.stopAll();
    setGameScreen('menu');
  }, [setGameScreen]);

  const handleGoToLevelSelect = useCallback(() => {
    setGameScreen('levelSelect');
  }, [setGameScreen]);

  const handleStartEndless = useCallback(() => {
    gameManager.startLevel(53);
    setCurrentLevelId(53);
    setGameScreen('playing');
    setWave(1, gameManager.getTotalWaves());
    audioManager.startBgm();
  }, [setGameScreen, setWave, setCurrentLevelId]);

  const handlePause = useCallback(() => {
    gameManager.pause();
    audioManager.pauseBgm();
    setGameScreen('paused');
  }, [setGameScreen]);

  const handleResume = useCallback(() => {
    gameManager.resume();
    audioManager.resumeBgm();
    setGameScreen('playing');
  }, [setGameScreen]);

  const handleSpeedToggle = useCallback(() => {
    useGameStore.getState().toggleSpeedMultiplier();
  }, []);

  const handleRestart = useCallback(() => {
    const levelId = useGameStore.getState().currentLevelId;
    if (levelId) {
      gameManager.startLevel(levelId);
      setGameScreen('playing');
      setWave(1, gameManager.getTotalWaves());
      audioManager.startBgm();
    }
  }, [setGameScreen, setWave]);

  const handleNextLevel = useCallback(() => {
    const currentLevel = useGameStore.getState().currentLevelId;
    if (currentLevel && gameManager.levelManager.hasLevel(currentLevel + 1)) {
      const nextLevelId = currentLevel + 1;
      gameManager.startLevel(nextLevelId);
      setCurrentLevelId(nextLevelId);
      setGameScreen('playing');
      setWave(1, gameManager.getTotalWaves());
      audioManager.startBgm();
    } else {
      setGameScreen('levelSelect');
    }
  }, [setGameScreen, setWave, setCurrentLevelId]);

  if (!isInitialized) {
    return (
      <div className="text-white text-2xl">加载中...</div>
    );
  }

  return (
    <div className="w-full h-full flex items-center justify-center">
      {gameScreen === 'menu' && (
        <MainMenu
          onStart={handleGoToLevelSelect}
          onEndless={handleStartEndless}
        />
      )}

      {gameScreen === 'levelSelect' && (
        <LevelSelect
          onSelectLevel={handleStartGame}
          onBack={handleGoToMenu}
        />
      )}

      {(gameScreen === 'playing' || gameScreen === 'paused' || gameScreen === 'victory' || gameScreen === 'defeat') && (
        <GameView onPause={handlePause} onSpeedToggle={handleSpeedToggle}>
          {gameScreen === 'paused' && (
            <PauseDialog
              onResume={handleResume}
              onRestart={handleRestart}
              onMenu={handleGoToMenu}
            />
          )}

          {gameScreen === 'victory' && (
            <VictoryDialog
              onNextLevel={handleNextLevel}
              onRestart={handleRestart}
              onMenu={handleGoToMenu}
            />
          )}

          {gameScreen === 'defeat' && (
            <DefeatDialog
              onRestart={handleRestart}
              onMenu={handleGoToMenu}
            />
          )}
        </GameView>
      )}
    </div>
  );
}

export default App;

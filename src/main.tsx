import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { asset } from './utils/asset'

// 注入带 base 的资源路径，供 index.css 使用
const rootStyle = document.documentElement.style
rootStyle.setProperty('--asset-font-zpix', `url('${asset('assets/fonts/zpix.ttf')}')`)
rootStyle.setProperty('--asset-game-bg', `url('${asset('assets/ui/game_bg.webp')}')`)
rootStyle.setProperty('--asset-dialog-bg', `url('${asset('assets/ui/dialog_bg.webp')}')`)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

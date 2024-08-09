import ReactDOM from 'react-dom/client'
import { ConfigProvider, theme } from 'antd'
import zhCN from 'antd/locale/zh_CN';
import App from './App.tsx'
import './index.css'
// import 'antd/dist/antd.less';
const { darkAlgorithm, compactAlgorithm } = theme;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <>
    <ConfigProvider
      theme={{
        algorithm: [darkAlgorithm, compactAlgorithm]
      }}
      locale={zhCN}
    >
      <App />
    </ConfigProvider>
  </>
)

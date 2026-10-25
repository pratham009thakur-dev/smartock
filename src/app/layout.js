import './globals.css'
import Sidebar from '@/components/Sidebar'
import Topbar from '@/components/Topbar'

export const metadata = {
  title: 'Smart Stock',
  description: 'Intelligent inventory management system',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="layout-container">
          <Sidebar />
          <div className="main-content">
            <Topbar />
            <div className="page-container">
              {children}
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import MainContent from './components/MainContent'
import CalendarView from './components/CalendarView'
import StatsView from './components/StatsView'
import Profile from './components/Profile'
import { isAuthenticated } from '@/services/authenticateService'
import { getProfile } from '@/services/getUserInfoService'

type View = 'tasks' | 'calendar' | 'stats' | 'profile'

export default function Home() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [user, setUser] = useState<any>(null)

  const router = useRouter()
  const searchParams = useSearchParams()

  const [currentView, setCurrentView] = useState<View>(
    (searchParams.get('view') as View) || 'tasks'
  )

  useEffect(() => {
    const checkAuth = async () => {
      const isUserAuthenticated = await isAuthenticated()

      if (!isUserAuthenticated) {
        router.replace('/auth')
        return
      }

      try {
        const profileData = await getProfile()
        setUser(profileData)
      } catch (error) {
        console.error('Ошибка загрузки профиля:', error)
        router.replace('/auth')
      }
    }

    checkAuth()
  }, [router])

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible)
  }

  const toggleSidebarCollapse = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed)
  }

  const changeView = (view: View) => {
    setCurrentView(view)
    router.push(`/?view=${view}`, undefined) // Обновляем URL
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className='flex h-screen overflow-hidden bg-gradient-to-b from-[#8f31f2] to-[#e0dee1]'>
      <Sidebar
        isVisible={isSidebarVisible}
        isCollapsed={isSidebarCollapsed}
        currentView={currentView}
        onChangeView={changeView}
      />

      <div className='flex flex-1 flex-col'>
        <Header
          toggleSidebar={toggleSidebar}
          toggleCollapse={toggleSidebarCollapse}
          isCollapsed={isSidebarCollapsed}
          onProfileClick={() => changeView('profile')}
        />
        <main className='flex-1 overflow-hidden transition-all duration-300 ease-in-out p-6'>
          {currentView === 'tasks' && <MainContent />}
          {currentView === 'calendar' && <CalendarView />}
          {currentView === 'stats' && <StatsView />}
          {currentView === 'profile' && (
            <Profile
              onBackToTasks={() => changeView('tasks')}
              user={user}
              stats={{
                completedTasks: 42,
                ongoingTasks: 15,
                totalTasks: 57,
              }}
            />
          )}
        </main>
      </div>

      {isSidebarVisible && isMobile && (
        <div
          className='fixed inset-0 bg-black/50 md:hidden'
          onClick={toggleSidebar}
        />
      )}
    </div>
  )
}

import { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import { routeArray } from '@/config/routes';
import Header from '@/components/organisms/Header';
import ProjectList from '@/components/organisms/ProjectList';

const Layout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-white">
      {/* Header */}
      <Header onMobileMenuToggle={toggleMobileMenu} />
      
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex lg:flex-col w-80 bg-white border-r border-surface-200 overflow-hidden">
          <nav className="flex-1 p-6 overflow-y-auto">
            <ul className="space-y-2">
              {routeArray.map((route) => (
                <li key={route.id}>
                  <NavLink
                    to={route.path}
                    className={({ isActive }) =>
                      `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-150 ${
                        isActive
                          ? 'bg-primary text-white shadow-sm'
                          : 'text-surface-700 hover:bg-surface-50 hover:text-primary'
                      }`
                    }
                  >
                    <ApperIcon name={route.icon} size={20} />
                    <span className="font-medium">{route.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
            
            <div className="mt-8">
              <ProjectList />
            </div>
          </nav>
        </aside>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={toggleMobileMenu}
            />
          )}
        </AnimatePresence>

        {/* Mobile Menu Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.aside
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-80 bg-white border-r border-surface-200 z-50 lg:hidden overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-display font-bold text-surface-900">TaskFlow</h2>
                  <button
                    onClick={toggleMobileMenu}
                    className="p-2 hover:bg-surface-100 rounded-lg transition-colors"
                  >
                    <ApperIcon name="X" size={20} />
                  </button>
                </div>
                
                <nav className="flex-1 overflow-y-auto">
                  <ul className="space-y-2">
                    {routeArray.map((route) => (
                      <li key={route.id}>
                        <NavLink
                          to={route.path}
                          onClick={toggleMobileMenu}
                          className={({ isActive }) =>
                            `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-150 ${
                              isActive
                                ? 'bg-primary text-white shadow-sm'
                                : 'text-surface-700 hover:bg-surface-50 hover:text-primary'
                            }`
                          }
                        >
                          <ApperIcon name={route.icon} size={20} />
                          <span className="font-medium">{route.label}</span>
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="mt-8">
                    <ProjectList />
                  </div>
                </nav>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
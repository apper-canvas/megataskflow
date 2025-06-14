import AllTasks from '@/components/pages/AllTasks';
import Today from '@/components/pages/Today';
import Upcoming from '@/components/pages/Upcoming';
import Archive from '@/components/pages/Archive';

export const routes = {
  allTasks: {
    id: 'all-tasks',
    label: 'All Tasks',
    path: '/all-tasks',
    icon: 'List',
    component: AllTasks
  },
  today: {
    id: 'today',
    label: 'Today',
    path: '/today',
    icon: 'Calendar',
    component: Today
  },
  upcoming: {
    id: 'upcoming',
    label: 'Upcoming',
    path: '/upcoming',
    icon: 'CalendarDays',
    component: Upcoming
  },
  archive: {
    id: 'archive',
    label: 'Archive',
    path: '/archive',
    icon: 'Archive',
    component: Archive
  }
};

export const routeArray = Object.values(routes);
export default routes;
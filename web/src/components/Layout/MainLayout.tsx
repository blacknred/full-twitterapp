import type { FC, PropsWithChildren } from 'react';
import { Suspense } from 'react';
import { Toaster } from 'react-hot-toast';
import { useMatch } from 'react-router-dom';

import { useI18n } from '@/providers';

import { FormattedMessage } from 'react-intl';

import { useDarkMode } from '@/hooks/useDarkMode';
import { Avatar, Link, Spinner } from '../Elements';
import { Auth, useAuth } from '@/features/auth';
import { data } from 'cypress/types/jquery';
import { TrendList } from '@/features/tweets/components/TrendList';
import { RecommendationList } from '@/features/users/components/RecommendationListList';


// const SideNavigation = () => {
//   const { checkAccess } = useAuthorization();
//   const navigation = [
//     { name: 'Dashboard', to: '.', icon: HomeIcon },
//     { name: 'Discussions', to: './discussions', icon: FolderIcon },
//     checkAccess({ allowedRoles: [ROLES.ADMIN] }) && {
//       name: 'Users',
//       to: './users',
//       icon: UsersIcon,
//     },
//   ].filter(Boolean) as SideNavigationItem[];

//   return (
//     <>
//       {navigation.map((item, index) => (
//         <NavLink
//           end={index === 0}
//           key={item.name}
//           to={item.to}
//           className="text-gray-300 hover:bg-gray-700 hover:text-white"
//           activeClassName="bg-gray-900 text-white"
//         >
//           <item.icon
//             className={clsx(
//               'text-gray-400 group-hover:text-gray-300',
//               'mr-4 flex-shrink-0 h-6 w-6'
//             )}
//             aria-hidden="true"
//           />
//           {item.name}
//         </NavLink>
//       ))}
//     </>
//   );
// };

// p-5 m-5 py-2 border-3 border-t
// w-screen(max-width) h-screen w-full md:w-2/5
// flex flex-col flex-wrap justify-between items-center
// sm:justify-between
// dark:bg-blue-500
// text-2xl font-bold text-white text-center
// round full-round
// hover:shadow-lg



// sm [Nav(b), Page]
// md [Nav(l), Page]
// lg [Nav(l), Page, Trends]
// Nav(A)[Tweet, Explore, TL, Profile, Settings]
// Trends[Topics(!Explore), ToRead]


// function UISettings() {
//   const { locale, setLocale } = useI18n();
//   const [isDarkMode, toggleDark] = useDarkMode(document.documentElement);

//   return (
//     <div className='flex justify-between items-center'>
//       <select value={locale} onChange={(e) => setLocale(e.currentTarget.value)}>
//         <option value="en-EN">English</option>
//         <option value="ru-RU">Русский</option>
//       </select>

//       <div>
//         <label htmlFor="darkMode">
//           <FormattedMessage id="app.ui.theme" defaultMessage="Toggle dark mode" />
//         </label>
//         <input id='darkMode' type='checkbox' checked={isDarkMode} onChange={toggleDark} />
//       </div>
//     </div>
//   )
// }

type NavProps = {
  user: Auth
}

const NavSidebar: FC<NavProps> = ({ user }) => {
  const [isDarkMode, toggleDark] = useDarkMode(document.documentElement);

  return (
    <aside role="nav" className='hidden sm:block'>
      <div className='sticky top-0 h-screen p-5'>
        <div className="flex flex-col h-full items-center justify-between">
          {/* logo */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 dark:fill-white fill-black" viewBox="0 0 20 20">
            <path d="M17.316 6.246c.008.162.011.326.011.488 0 4.99-3.797 10.742-10.74 10.742-2.133 0-4.116-.625-5.787-1.697a7.577 7.577 0 0 0 5.588-1.562 3.779 3.779 0 0 1-3.526-2.621 3.858 3.858 0 0 0 1.705-.065 3.779 3.779 0 0 1-3.028-3.703v-.047a3.766 3.766 0 0 0 1.71.473 3.775 3.775 0 0 1-1.168-5.041 10.716 10.716 0 0 0 7.781 3.945 3.813 3.813 0 0 1-.097-.861 3.773 3.773 0 0 1 3.774-3.773 3.77 3.77 0 0 1 2.756 1.191 7.602 7.602 0 0 0 2.397-.916 3.789 3.789 0 0 1-1.66 2.088 7.55 7.55 0 0 0 2.168-.594 7.623 7.623 0 0 1-1.884 1.953z" />
          </svg>

          {/* nav */}
          <div className='flex flex-col items-center justify-around gap-7'>
            <Link to="/">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 dark:fill-white fill-black" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
            </Link>

            <Link to="/explore">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 dark:fill-white fill-black" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.243 3.03a1 1 0 01.727 1.213L9.53 6h2.94l.56-2.243a1 1 0 111.94.486L14.53 6H17a1 1 0 110 2h-2.97l-1 4H15a1 1 0 110 2h-2.47l-.56 2.242a1 1 0 11-1.94-.485L10.47 14H7.53l-.56 2.242a1 1 0 11-1.94-.485L5.47 14H3a1 1 0 110-2h2.97l1-4H5a1 1 0 110-2h2.47l.56-2.243a1 1 0 011.213-.727zM9.03 8l-1 4h2.938l1-4H9.031z" clipRule="evenodd" />
              </svg>
            </Link>

            <Link to={`/${user.username}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 dark:fill-white fill-black" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </Link>

            <div></div>

            <button onClick={toggleDark}>
              {isDarkMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 dark:fill-white fill-black" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 dark:fill-white fill-black" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>

            {/* <Link to="/tweet" className='dark:bg-white bg-gray-500 p-2 rounded-full'>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                <path className="dark:fill-black fill-white" fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            </Link> */}

          </div>

          {/* profile */}
          <Link to="/my">
            <Avatar size="md" variant='square' src={user.img} alt={user.username} />
          </Link>
        </div>
      </div>
    </aside>
  )
}

const NavFooter: FC<NavProps> = ({ user }) => {
  return (
    <footer role="nav" className='sm:hidden'>
      <div className='fixed bottom-0 left-0 right-0 dark:bg-gray-800 bg-white'>
        <div className='flex items-center justify-around h-20'>
          {/* nav */}
          <Link to="/">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 dark:fill-white fill-black" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
            </svg>
          </Link>

          <Link to="/explore">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 dark:fill-white fill-black" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.243 3.03a1 1 0 01.727 1.213L9.53 6h2.94l.56-2.243a1 1 0 111.94.486L14.53 6H17a1 1 0 110 2h-2.97l-1 4H15a1 1 0 110 2h-2.47l-.56 2.242a1 1 0 11-1.94-.485L10.47 14H7.53l-.56 2.242a1 1 0 11-1.94-.485L5.47 14H3a1 1 0 110-2h2.97l1-4H5a1 1 0 110-2h2.47l.56-2.243a1 1 0 011.213-.727zM9.03 8l-1 4h2.938l1-4H9.031z" clipRule="evenodd" />
            </svg>
          </Link>

          {/* <Link to="/tweet" className='bg-accent p-2 rounded-lg'>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 dark:fill-white fill-black" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
          </Link> */}
          {/* <Link to="/tweet" className='dark:bg-white bg-gray-500 p-2 rounded-full'>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
              <path className="dark:fill-black fill-white" fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
          </Link> */}

          <Link to={`/${user.username}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 dark:fill-white fill-black" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </Link>

          {/* profile */}
          <Link to="/my">
            <Avatar size="sm" src={user.img} alt={user.username} />
          </Link>
        </div>
      </div>
    </footer>
  )
}


export const MainLayout: FC<PropsWithChildren> = ({ children }) => {
  const isProfilePage = useMatch({ path: "my", end: false });
  const isExplorePage = useMatch({ path: "explore", end: false });
  const { data: auth } = useAuth()

  return (
    <>
      {/* header */}
      <header className='sm:hidden h-12 w-full z-10 flex justify-center items-center dark:bg-gray-800'>
        <svg xmlns="http://www.w3.org/2000/svg" className="sm:hidden h-6 w-6 dark:fill-white fill-black" viewBox="0 0 20 20">
          <path d="M17.316 6.246c.008.162.011.326.011.488 0 4.99-3.797 10.742-10.74 10.742-2.133 0-4.116-.625-5.787-1.697a7.577 7.577 0 0 0 5.588-1.562 3.779 3.779 0 0 1-3.526-2.621 3.858 3.858 0 0 0 1.705-.065 3.779 3.779 0 0 1-3.028-3.703v-.047a3.766 3.766 0 0 0 1.71.473 3.775 3.775 0 0 1-1.168-5.041 10.716 10.716 0 0 0 7.781 3.945 3.813 3.813 0 0 1-.097-.861 3.773 3.773 0 0 1 3.774-3.773 3.77 3.77 0 0 1 2.756 1.191 7.602 7.602 0 0 0 2.397-.916 3.789 3.789 0 0 1-1.66 2.088 7.55 7.55 0 0 0 2.168-.594 7.623 7.623 0 0 1-1.884 1.953z" />
        </svg>
      </header>

      <div className='flex h-full w-full justify-center dark:bg-gray-800'>
        {/* nav sidebar */}
        {auth?.data && <NavSidebar user={auth.data} />}

        {/* content */}
        <main role="main">
          <div className="flex sm:mt-10">
            {/* page */}
            <div className='w-[600px] max-w-full'>
              <Suspense
                fallback={
                  <div className="flex items-center justify-center w-screen h-screen">
                    <Spinner size="xl" />
                  </div>
                }
              >
                {children}
              </Suspense>
            </div>

            {/* sidebar */}
            <aside>
              <div className="sticky w-80 hidden lg:inline-block -top-3/4 bg-gray-50 dark:bg-gray-700 h-96">
                {!isExplorePage && <TrendList />}
                <RecommendationList />
              </div>
            </aside>
          </div>
        </main>

        {/* nav footer */}
        {auth?.data && <NavFooter user={auth.data} />}
        {/* <div> */}
        {/* {!isProfilePage ? <TweetTrends /> : (
              <>
                <Link to={'/'}>Back</Link>
                {[['my', 'Common'], ['my/followers', 'Followers'], ['my/followings', 'Followings']].map(([to, name]) => (
                  <NavLink
                    className="text-gray-300 hover:bg-gray-700 hover:text-white"
                    activeClassName="bg-gray-900 text-white"
                    to={to}
                  >{name}</NavLink>
                ))}
              </>
            )}
          </div> */}


      </div>

      <Toaster position="bottom-left" reverseOrder={false} />
    </>
  );
};


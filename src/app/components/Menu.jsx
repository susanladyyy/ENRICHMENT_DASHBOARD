const Menu = memo(({ active, userRole }) => {
  const [open, setOpen] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const activeLink = 'flex items-center bg-gray-100 font-medium p-2 h-full rounded-md';
  const activeLinkDisposal = 'flex items-center bg-gray-100 font-medium hover:px-8 px-8 hover:p-2 p-2 h-full rounded-md';

  const location = useLocation();

  useEffect(() => {
    if (
      location.pathname.includes('/disposal/event') ||
      location.pathname.includes('/disposal/request')
    ) {
      setIsOpen(true);
      setOpen('Disposal');
    } else {
      setIsOpen(false);
      setOpen('');
    }
  }, [location]);

  const links = [
    {
      name: 'Dashboard',
      logo: <FaHome/>,
      link: '/',
    },
    {
      name: 'Part Request',
      logo: <FaBoxOpen/>,
      link: '/partrequest',
    },
    {
      name: 'Discrepancy',
      logo: <FaExclamationTriangle/>,
      link: '/discrepancy',
    },
    {
      name: 'Disposal',
      children: [
        {
          name: 'General',
          children: [
            {
            name:'Event',
            link: '/disposal/event',
            },
            {
              name:'Request',
              link: '/disposal/request',
            },
          ],
        },
        {
          name: 'Ringi',
          link: '/ringi',
        },
      ],
    },
    
    {
      name: 'Master Data Mgt',
      children: [
        {
        name:'Master Data Mgt',
        link: '/masterdata',
        },
        {
          name:'Approval Group',
          link: '/approvalgroup',
          },
      ],
      logo: <FaUserClock/>,
      link: '/userlog',
    },
  
  ];

  const filteredLinks = links.filter((link) => {
    if (link.name === 'User Log' && userRole !== 'Admin') {
      return false; // Hide User Logs for non-admin users
    }
    return true; // Show other links for all other users
  });

  return (
    <div
      className={`w-36 md:w-44 z-10 bg-white p-0 border-solid border-2 h-full fixed left-0 transform transition-transform duration-300 ${
        active ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 top-0 pt-20`}
    >
      <div className="max-w-full min-w-full">
        <ul className="flex flex-col gap-2">
          {filteredLinks.map((link, index) => {
            {console.log("filtered links", filteredLinks)}
            //           {filteredLinks.map((link, index) => {
                        function openFunction() {
                          setIsOpen(!isOpen);
                          setOpen(link.name);
                        }
                        if (link.children) {
                          const isLinkOpen = isOpen && open === link.name;
                          
                          return (
                            <li key={index}>
                              <div
                                className="flex items-center justify-between p-2 cursor-pointer"
                                onClick={openFunction}
                              >
                                <div className='flex gap-2 items-center'>
                                  <FaTrash/>
                                  <span>{link.name}</span>
                                </div>
                                <svg
                                  data-accordion-icon
                                  className={`w-3 h-3 transform transition-transform duration-300 ${
                                    isLinkOpen ? 'rotate-0' : 'rotate-180'
                                  }`}
                                  aria-hidden="true"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 10 6"
                                >
                                  <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M9 5 5 1 1 5"
                                  />
                                </svg>
                              </div>
                              {isLinkOpen && (
                                <ul>
                                  {link.children.map((subLink, subIndex) => (
                                    <NavLink
                                      key={subIndex}
                                      to={subLink.link}
                                      className={({ isActive }) =>
                                        isActive ? activeLinkDisposal : 'flex items-center hover:bg-gray-200 hover:px-8 px-8 hover:p-2 p-2 font-normal hover:h-full h-full rounded-md'
                                      }
                                    >
                                      <span className='flex gap-2 items-center'>{subLink.name}</span>
                                    </NavLink>
                                  ))}
                                </ul>
                              )}
                            </li>
                          );
                        } else if (link.name === 'Disposal') {
                          return (
                            <NavLink
                              key={index}
                              to={link.link}
                              className={'flex items-center hover:bg-gray-200 hover:p-2 p-2 font-normal hover:h-full h-full'}
                            >
                              <span className='flex gap-2 items-center'>{link.logo} {link.name}</span>
                            </NavLink>
                          );
                        } else {
                          return (
                            <NavLink
                              key={index}
                              to={link.link}
                              className={({ isActive }) =>
                                isActive ? activeLink : 'flex items-center hover:bg-gray-200 hover:p-2 p-2 font-normal hover:h-full h-full'
                              }
                            >
                              <span className='flex gap-2 items-center'>{link.logo} {link.name}</span>
                            </NavLink>
                          );
                        }
          })}
        </ul>
      </div>
    </div>
  );
});

export default Menu;
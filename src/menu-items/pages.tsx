// third-party
import { FormattedMessage } from 'react-intl';

// assets
import {
  LoginOutlined,
  PhoneOutlined,
  RocketOutlined,
  UserOutlined,
  HomeOutlined,
  AppstoreOutlined,
  FileTextOutlined,
  ShoppingCartOutlined,
  DollarOutlined
} from '@ant-design/icons';

// type
import { NavItemType } from 'types/menu';

// icons
const icons = {
  LoginOutlined,
  PhoneOutlined,
  RocketOutlined,
  UserOutlined,
  HomeOutlined,
  AppstoreOutlined,
  FileTextOutlined,
  ShoppingCartOutlined,
  DollarOutlined
};

// ==============================|| MENU ITEMS - PAGES ||============================== //

const pages: NavItemType = {
  id: 'group-pages',
  title: <FormattedMessage id="pages" />,
  type: 'group',
  children: [
    {
      id: 'users-list',
      title: <FormattedMessage id="users-list" />,
      type: 'item',
      url: '/users-list',
      icon: icons.UserOutlined,
      info: 'Страница управления ролями пользователей'
    },
    {
      id: 'projects',
      title: <FormattedMessage id="projects" />,
      type: 'item',
      url: '/projects',
      icon: icons.HomeOutlined,
      info: 'Страница управления проектами пользователей'
    },
    {
      id: 'inventory',
      title: <FormattedMessage id="inventory" />,
      type: 'item',
      url: '/inventory',
      icon: icons.AppstoreOutlined,
      info: 'Страница управления инвентарем (складом) материалов'
    },
    {
      id: 'requests',
      title: <FormattedMessage id="requests" />,
      type: 'item',
      url: '/requests',
      icon: icons.FileTextOutlined,
      info: 'Страница управления заявками к проектам'
    },
    {
      id: 'suppliers',
      title: <FormattedMessage id="suppliers" />,
      type: 'item',
      url: '/suppliers',
      icon: icons.ShoppingCartOutlined,
      info: 'Cтраница управления поставщиков'
    },
    {
      id: 'accounting',
      title: <FormattedMessage id="accounting" />,
      type: 'item',
      url: '/accounting',
      icon: icons.DollarOutlined,
      info: 'Страница управления финансами компании'
    },
    {
      id: 'contact-us',
      title: <FormattedMessage id="contact-us" />,
      type: 'item',
      url: '/contact-us',
      icon: icons.PhoneOutlined,
      target: true
    },
    {
      id: 'maintenance',
      title: <FormattedMessage id="maintenance" />,
      type: 'collapse',
      icon: icons.RocketOutlined,
      children: [
        {
          id: 'error-404',
          title: <FormattedMessage id="error-404" />,
          type: 'item',
          url: '/maintenance/404',
          target: true
        },
        {
          id: 'error-500',
          title: <FormattedMessage id="error-500" />,
          type: 'item',
          url: '/maintenance/500',
          target: true
        },
        {
          id: 'coming-soon',
          title: <FormattedMessage id="coming-soon" />,
          type: 'item',
          url: '/maintenance/coming-soon',
          target: true
        },
        {
          id: 'under-construction',
          title: <FormattedMessage id="under-construction" />,
          type: 'item',
          url: '/maintenance/under-construction',
          target: true
        }
      ]
    }
  ]
};

export default pages;

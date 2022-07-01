import clsx from 'clsx';
import type { FC } from 'react';
import { NavLink as RouterLink, LinkProps } from 'react-router-dom';

export const Link: FC<LinkProps> = ({ className, children, ...props }) => (
  <RouterLink className={({ isActive }) => clsx(isActive ? 'text-primary' : 'text-dark-600', 'hover:text-primary', 'hoverEffect', className)} {...props}>
    {children}
  </RouterLink>
);

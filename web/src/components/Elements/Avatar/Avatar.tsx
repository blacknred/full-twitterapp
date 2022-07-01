import clsx from 'clsx';
import type { FC } from 'react';
import { generateAvatar } from './generateAvatar';

const variants = {
  round: 'rounded-full',
  square: 'rounded',
};

const sizes = {
  sm: 'h-10 w-10',
  md: 'h-14 w-14',
  lg: 'h-20 w-20',
  xl: 'h-30 w-30',
};

const pxSizes = {
  sm: 38,
  md: 44,
  lg: 50,
  xl: 56,
};

type SrcType =
  | { src: string; alt?: string }
  | { src?: string; alt: string; }

export type IAvatarProps = {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
} & SrcType;

export const Avatar: FC<IAvatarProps> = ({
  variant = 'round',
  size = 'md',
  src,
  alt
}) => {
  if (!src) {
    const text = alt?.split(' ').reduce((a, k) => a + k[0], '').slice(0, 2).toUpperCase()
    return <>{generateAvatar({ text, round: variant === 'round', size: pxSizes[size] })}</>
  }

  return (
    <>
      <img src={src} alt={alt} className={clsx(
        'inline-block border-2 border-gray-100 w- dark:border-gray-600',
        variants[variant],
        sizes[size],
      )} />
    </>
  )
};

Avatar.displayName = 'Avatar';


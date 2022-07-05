import { Avatar } from "@/components/Elements/Avatar";
import clsx from "clsx";
import type { FC, ReactNode } from "react";
import type { User as UserType } from "../types/subscription.entity";

// const sizes = {
//   sm: 'py-2 px-4 text-sm',
//   md: 'py-2 px-6 text-md',
//   lg: 'py-3 px-8 text-lg',
// };

interface IUserProps {
  data: UserType;
  variant?: 'xs' | 'sm' | 'md' | 'lg';
  renderAction?: (data: UserType) => ReactNode
}

export const User: FC<IUserProps> = ({ data, variant = 'sm', renderAction }) => {
  if (variant === 'xs') {
    return (
      <div className="flex justify-between items-center">
        <div className="flex items-center text-base">
          <h4 className="font-semibold text-slate-900">{data.name}</h4>
          <p>@{data.username}</p>
        </div>

        <div>{renderAction?.(data)}</div>
      </div>
    )
  }

  return (
    <div className="flex items-start">
      <Avatar size={variant} src={data.img} alt={data.name} />
      
      <div className="pt-3 flex flex-col grow-2 items-start text-base">
        <h4 className={clsx(
          "font-semibold space-y-1 dark:text-white",
          variant === 'lg' ? 'font-large' : 'font-medium'
        )}>{data.name}</h4>
        
        <p className="text-sm text-gray-500 dark:text-gray-400">@{data.username}</p>
        {variant !== 'sm' && <p className="text-sm text-gray-500 dark:text-gray-400">{data.bio}</p>}
        {variant === 'lg' && (
          <div className="flex justify-start items-start">
            <span>Регистрация: июнь 2010 г.</span>
            <span>4 511 в читаемых</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">178,3 тыс. читателя</span>
          </div>
        )}
      </div>

      <div>{renderAction?.(data)}</div>
    </div>
  )
}

// XS
// name @username     renderaction?

// SM
// img name           renderaction?
//     @username

// MD
// img name           renderaction?
//     @username
//     bio

// LG
// i-m-g name         renderaction?
// i-m-g @username
// i-m-g bio
//       registration followings followers
 


// TWEET
// [User(author, slim | small)] datetime? [Subscription(id)]
// text
// media
// datetime?
// comments likes reposts

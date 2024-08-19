"use client";
import clsx from "clsx";
import { ComponentProps } from "react";
import { IconButton } from "../button";

export interface Action {
  id: string;
  title: string;
  Icon: (props: any) => JSX.Element;
  handle: () => void;
}

interface ActionBarProps extends ComponentProps<"ul"> {
  actions: Action[];
}
export const ActionBar: React.FC<ActionBarProps> = ({ actions, className }) => {
  return (
    <ul className={clsx("flex gap-1 text-surface-variant", className)}>
      {actions.map(({ id, title, Icon, handle }) => (
        <li key={id} title={title}>
          <IconButton
            Icon={Icon}
            onClick={(e) => {
              e.stopPropagation();
              handle();
            }}
          />
        </li>
      ))}
    </ul>
  );
};

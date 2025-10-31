import React from 'react';
import { Textarea } from './ui/textarea';

interface MenuInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  disabled: boolean;
}

export const MenuInput: React.FC<MenuInputProps> = ({ value, onChange, disabled }) => {
  return (
    <div className="space-y-3">
      <label htmlFor="menu-text" className="text-xl font-bold font-serif text-brand-bg">
        1. Paste Your Menu
      </label>
      <Textarea
        id="menu-text"
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={`Example:\n\nClassic Burger - 100% beef patty, cheddar cheese, lettuce, tomato, and our secret sauce.\n\nMargherita Pizza - Fresh mozzarella, basil, and san marzano tomato sauce.`}
        className="h-48"
      />
    </div>
  );
};
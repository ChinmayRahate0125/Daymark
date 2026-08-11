import React from 'react';
import * as LucideIcons from 'lucide-react';

interface IconRendererProps {
  name: string;
  className?: string;
}

export const IconRenderer: React.FC<IconRendererProps> = ({ name, className = 'w-4 h-4' }) => {
  // Fallback to Sparkles if icon name doesn't exist directly
  const LucideIcon = (LucideIcons as Record<string, React.ComponentType<{ className?: string }>>)[name] || LucideIcons.Sparkles;
  return <LucideIcon className={className} />;
};

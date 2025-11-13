'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Alert({ title, description, type = 'default', onDismiss, className = '' }) {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    if (onDismiss) onDismiss();
  };

  const alertClasses = {
    default: 'bg-blue-50 border-blue-200 text-blue-800',
    success: 'bg-green-50 border-green-200 text-green-800',
    warning: 'bg-amber-50 border-amber-200 text-amber-800',
    error: 'bg-red-50 border-red-200 text-red-800'
  };

  if (!isVisible) return null;

  return (
    <div className={`border rounded-lg p-4 flex items-start ${alertClasses[type]} ${className}`}>
      <div className="flex-1">
        <h3 className="font-medium text-sm mb-1">{title}</h3>
        <p className="text-sm opacity-90">{description}</p>
      </div>
      <Button 
        variant="ghost" 
        size="sm" 
        className="p-1 h-auto ml-2 text-current hover:bg-transparent"
        onClick={handleClose}
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
}
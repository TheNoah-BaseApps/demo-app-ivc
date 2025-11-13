'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Alert({ type = 'info', title, description, onClose, show = true }) {
  const [visible, setVisible] = useState(show);

  const handleClose = () => {
    setVisible(false);
    if (onClose) onClose();
  };

  if (!visible) return null;

  const alertClasses = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    success: 'bg-green-50 border-green-200 text-green-800',
    warning: 'bg-amber-50 border-amber-200 text-amber-800',
    error: 'bg-red-50 border-red-200 text-red-800'
  };

  const iconClasses = {
    info: 'text-blue-600',
    success: 'text-green-600',
    warning: 'text-amber-600',
    error: 'text-red-600'
  };

  return (
    <div className={`flex items-start p-4 border rounded-lg ${alertClasses[type]}`}>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-semibold text-sm">{title}</h3>
        </div>
        <p className="text-sm">{description}</p>
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="p-1 h-6 w-6 text-current hover:bg-transparent"
        onClick={handleClose}
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
}
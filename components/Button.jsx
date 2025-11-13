'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Home, Package, BarChart3, ShoppingBag, ShoppingCart, DollarSign, Database, Settings, Users, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

export default function Button({ variant = 'default', size = 'default', onClick, children, icon: Icon, href, loading = false, className = '' }) {
  const router = useRouter();

  const handleClick = (e) => {
    if (loading) return;
    if (href) {
      router.push(href);
    } else if (onClick) {
      onClick(e);
    }
  };

  const baseClasses = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background";

  const variantClasses = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    destructive: "bg-red-600 text-white hover:bg-red-700",
    outline: "border border-input hover:bg-accent hover:text-accent-foreground",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    link: "underline-offset-4 hover:underline text-blue-600"
  };

  const sizeClasses = {
    default: "h-10 py-2 px-4",
    sm: "h-9 px-3 rounded-md",
    lg: "h-11 px-8 rounded-md",
    icon: "h-10 w-10"
  };

  const iconClasses = "mr-2";

  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  if (href) {
    return (
      <Button asChild>
        <a href={href} className={buttonClasses}>
          {Icon && <Icon className={iconClasses} />}
          {children}
        </a>
      </Button>
    );
  }

  return (
    <Button 
      disabled={loading}
      onClick={handleClick}
      className={buttonClasses}
    >
      {loading ? (
        <span className="flex items-center">
          <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></span>
          {children}
        </span>
      ) : (
        <>
          {Icon && <Icon className={iconClasses} />}
          {children}
        </>
      )}
    </Button>
  );
}